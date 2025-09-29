import { BlogReviewEntity } from '@admin/api/blog-review/entity/blog-review.entity';
import { BlogReviewCoreService } from '@libs/core/blog-review/blog-review-core.service';
import { NaverBlogService } from '@libs/common/modules/naver-blog/naver-blog.service';
import { Injectable } from '@nestjs/common';
import { S3Service } from '@libs/common/modules/s3/s3.service';
import { S3Folder } from '@libs/common/modules/s3/constants/s3-folder.constants';
import { v4 as uuidv4 } from 'uuid';
import { PlaceCoreService } from '@libs/core/place/place-core.service';
import { PlaceNotFoundException } from '@admin/api/place/exception/place-not-found.exception';
import { DuplicateBlogReviewUrlException } from '@admin/api/blog-review/exception/DuplicateBlogReviewUrlExcepion';
import { GetBlogReviewAllDto } from '@admin/api/blog-review/dto/request/get-blog-review-all.dto';
import { BlogReviewOverviewEntity } from '@admin/api/blog-review/entity/blog-review-overview.entity';

@Injectable()
export class BlogReviewService {
  constructor(
    private readonly naverBlogService: NaverBlogService,
    private readonly blogReviewCoreService: BlogReviewCoreService,
    private readonly s3Service: S3Service,
    private readonly placeCoreService: PlaceCoreService,
  ) {}

  public async createBlogReviewViaNaverBlogLink(
    placeIdx: number,
    link: string,
  ): Promise<BlogReviewEntity> {
    const place = await this.placeCoreService.getPlaceByIdx(placeIdx);

    if (!place) {
      throw new PlaceNotFoundException('Cannot find place');
    }

    const alreadyExistedBlogReview =
      await this.blogReviewCoreService.getBlogReviewByUrl(link);

    if (
      alreadyExistedBlogReview &&
      alreadyExistedBlogReview.place.idx === placeIdx
    ) {
      throw new DuplicateBlogReviewUrlException('already existing url');
    }

    const naverBlogEntity =
      await this.naverBlogService.extractNaverBlogMetaData(link);

    const createdBlogReviewModel =
      await this.blogReviewCoreService.createBlogReview(placeIdx, {
        url: link,
        authorName: naverBlogEntity.authorName,
        authorProfileImagePath: await this.uploadImage(
          naverBlogEntity.authorProfileImageUrl,
        ),
        blogName: naverBlogEntity.blogName,
        blogType: 0,
        contents: naverBlogEntity.contents,
        description: naverBlogEntity.description,
        title: naverBlogEntity.title,
        thumbnailImagePath: await this.uploadImage(
          naverBlogEntity.thumbnailImageUrl,
        ),
        uploadedAt: naverBlogEntity.uploadedAt,
      });

    return BlogReviewEntity.fromModel(createdBlogReviewModel);
  }

  private async uploadImage(url: string | null): Promise<string | null> {
    if (!url) return null;

    const model = await this.s3Service.uploadImageFromUrl(
      {
        name: uuidv4() + '.png',
        path: S3Folder.BLOG_REVIEW,
      },
      url,
    );

    return model.path;
  }

  public async getBlogReviewAll(placeIdx: number, dto: GetBlogReviewAllDto) {
    const blogList = await this.blogReviewCoreService.getBlogReviewAll({
      placeIdx,
      skip: (dto.page - 1) * 10,
      take: 11,
    });

    const hasNext = !!blogList[10];

    return {
      hasNext,
      blogReviewList: blogList
        .slice(0, 10)
        .map(BlogReviewOverviewEntity.fromModel),
    };
  }
}
