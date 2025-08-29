import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SearchAddressResponseDto } from './dto/response/serach-address.dto';
import { KakaoAddressAPIException } from './exception/kakao-address-api.exception';

@Injectable()
export class KakaoAddressService {
  private readonly KAKAO_APPLICATION_REST_API_KEY: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.KAKAO_APPLICATION_REST_API_KEY =
      this.configService.get('kakaoAddress').key;
  }

  /**
   * 주소를 좌표로 변환하는 메서드
   *
   * @author 강정연
   *
   * @param address 검색할 주소
   */
  public async searchAddress(
    address: string,
  ): Promise<SearchAddressResponseDto> {
    try {
      const result =
        await this.httpService.axiosRef.get<SearchAddressResponseDto>(
          'https://dapi.kakao.com/v2/local/search/address.json',
          {
            headers: {
              Authorization: `KakaoAK ${this.KAKAO_APPLICATION_REST_API_KEY}`,
            },
            params: {
              query: address,
              size: 10,
            },
          },
        );

      if (result.data.documents.length === 0) {
        throw new KakaoAddressAPIException(
          `Fail to GET kakao address + ${address}`,
        );
      }

      return result.data;
    } catch (err: any) {
      if (err instanceof KakaoAddressAPIException) {
        throw err;
      }
      throw new InternalServerErrorException('Fail to GET kakao address');
    }
  }
}
