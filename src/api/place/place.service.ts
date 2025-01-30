import { Injectable } from '@nestjs/common';
import { PlaceRepository } from './place.repository';
import { AllPlaceResponseDto, GetAllPlaceDto, PlaceEntity } from './place.dto';
import { KeywordRepository } from '../keyword/keyword.repository';

@Injectable()
export class PlaceService {
    constructor(
        private placeRepository: PlaceRepository,
        private keywordRepository: KeywordRepository
    ) { }

    async getAllPlace(getAllPlaceDto: GetAllPlaceDto): Promise<AllPlaceResponseDto> {
        const placeQueryList = await this.placeRepository.getAllPlace(getAllPlaceDto);

        // place를 반환하기 위해 1차 가공
        const placeList: PlaceEntity[] = placeQueryList.map((place) => ({
            idx: place.idx,
            name: place.name,
            address: place.address,
            reviewCount: place.review.length,
            bookmark: place.bookmark.length > 0 ? true : false,
            keyword: [],
            imagePath: place.placeImage.map((path) => path.imagePath)
        }))

        const keywordCountQueryList = await this.keywordRepository.getAllKeywordCountByPlace();
        const keywordQueryList = await this.keywordRepository.getAllKeyword();

        // place 마다 가장 많이 선택된 keyword 2개 골라서 placeList.keyword에 push 해주기
        let placeIdx: number = 0;
        let count: number = 0;
        keywordCountQueryList.forEach((elem) => {
            if (elem.placeIdx != placeIdx) {
                placeIdx = elem.placeIdx;
                count = 0;
            }

            if (count != 2) {
                const foundKeywordObj = keywordQueryList.find(obj => obj.idx === elem.keywordIdx);
                const foundPlaceObj = placeList.find(obj => obj.idx === elem.placeIdx);

                if (foundPlaceObj) {
                    foundPlaceObj.keyword.push(foundKeywordObj.content);
                }
                count++;
            }
        });

        const responseData = {
            placeList: placeList
        }

        return responseData;
    }
}
