export class GetAllPlaceDto {
    page: number;
    userIdx: number;
}

export class Place {
    idx: number;
    name: string;
    address: string;
    reviewCount: number;
    bookmark: boolean;
    keyword: string[];
    imagePath: string[];
}

export class AllPlaceResponseDto {
    placeList: Place[];
}
