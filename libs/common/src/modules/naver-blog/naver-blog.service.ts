import { NaverBlogEntity } from '@libs/common/modules/naver-blog/entity/NaverBlogEntity';
import { NaverBlogNotFoundException } from '@libs/common/modules/naver-blog/exception/NaverBlogNotFoundException';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { isAxiosError } from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class NaverBlogService {
  constructor(private readonly httpService: HttpService) {}

  public async extractNaverBlogMetaData(
    link: string,
  ): Promise<NaverBlogEntity> {
    const iframeSrc = await this.getNaverBlogIframeSrc(link);
    const html = await this.getNaverBlogViaIframeSrc(iframeSrc || '');
    const $ = cheerio.load(html);

    const result = $('meta').toArray();

    // 본문
    const paragraphs = $('.se-viewer .se-component.se-text .se-text-paragraph')
      .toArray()
      .map((el) =>
        $(el)
          .text()
          .replace(/[\u200B-\u200D\uFEFF]/g, '') // zero-width: ZWSP/ZWNJ/ZWJ/BOM
          .replace(/\u00A0/g, ' ') // NBSP → space
          .replace(/\s+/g, ' ') // collapse spaces
          .trim(),
      )
      .filter(Boolean);

    // 작성일
    const uploadedAt = this.getUploadedAt($('span.se_publishDate').text());

    // 메타 데이터
    const metadataList = result.map((v) => v.attribs);
    const metadata = this.extractInformationFromMetadata(metadataList);

    return {
      authorName: metadata.authorName || '',
      blogName: metadata.blogName || '',
      authorProfileImageUrl: metadata.authorProfileImage,
      contents: paragraphs.join(' '),
      description: metadata.description,
      thumbnailImageUrl: metadata.thumbnail,
      title: metadata.title || '',
      uploadedAt: uploadedAt,
      url: link,
    };
  }

  private async getNaverBlogIframeSrc(link: string) {
    try {
      const { data } = await this.httpService.axiosRef.get(link);

      const $ = cheerio.load(data);

      return 'https://blog.naver.com' + $('iframe').attr('src');
    } catch (err) {
      if (isAxiosError(err)) {
        if (err.response?.status === 404) {
          throw new NaverBlogNotFoundException();
        }
      }

      throw err;
    }
  }

  private async getNaverBlogViaIframeSrc(iframeSrc: string) {
    try {
      const { data } = await this.httpService.axiosRef.get(iframeSrc);

      return data;
    } catch (err) {
      if (isAxiosError(err)) {
        if (err.response?.status === 404) {
          throw new NaverBlogNotFoundException();
        }
      }

      throw err;
    }
  }

  private extractInformationFromMetadata(metadata: Record<string, string>[]) {
    const TITLE_PROPERTY_NAME = 'og:title' as const;
    const DESCRIPTION_PROPERTY_NAME = 'og:description' as const;
    const URL_PROPERTY_NAME = 'og:url' as const;
    const AUTHOR_NICKNAME_PROPERTY_NAME = 'naverblog:nickname' as const;
    const AUTHOR_PROFILE_IMAGE_PROPERTY_NAME =
      'naverblog:profile_image' as const;
    const BLOG_NAME_PROPERTY_NAME = 'og:site_name' as const;
    const THUMBNAIL_PROPERTY_NAME = 'og:image' as const;

    return {
      title: this.getProperty(metadata, TITLE_PROPERTY_NAME),
      description: this.getProperty(metadata, DESCRIPTION_PROPERTY_NAME),
      url: this.getProperty(metadata, URL_PROPERTY_NAME),
      authorName: this.getProperty(metadata, AUTHOR_NICKNAME_PROPERTY_NAME),
      authorProfileImage: this.getProperty(
        metadata,
        AUTHOR_PROFILE_IMAGE_PROPERTY_NAME,
      ),
      blogName:
        this.getProperty(metadata, BLOG_NAME_PROPERTY_NAME)?.replace(
          '네이버 블로그 | ',
          '',
        ) || null,
      thumbnail: this.getProperty(metadata, THUMBNAIL_PROPERTY_NAME),
    };
  }

  private getProperty(
    metadataList: Record<string, string>[],
    key: string,
  ): string | null {
    return (
      metadataList.find((metadata) => metadata.property === key)?.content ||
      null
    );
  }

  private getUploadedAt(publishStr: string) {
    const dateArr = publishStr.split('.').map((d) => d.trim());

    const year = dateArr[0];
    const month = dateArr[1].padStart(2, '0');
    const date = dateArr[2].padStart(2, '0');
    const hhmm = dateArr[3];

    const dateStr = `${year}-${month}-${date}T${hhmm}:00`;
    return new Date(dateStr);
  }
}
