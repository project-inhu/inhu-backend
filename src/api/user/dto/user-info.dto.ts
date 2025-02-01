// TODO : class-validator 추가해서 유효성 검증? (닉네임 글자수 제한 etc)

// 내 정보 보기 (client->controller->server->repo)
// user idx 제공 -> Q. 필요없는거같은데
// export class GetMyInfoDto {
//     idx: number;
// }

// 내 정보 보기 (repo->server->controller->client)
// profile, nickname 제공
export class GetMyInfoResponseDto {
    profileImagePath: string | null; // 프로필 이미지 경로
    nickname: string;
}

// 내 정보 수정하기
// Q. DTO에서는 왜 처음부터 대문자죠
// Q. GetMyInfoResponseDto랑 하는 일이 똑같은데 따로 쓸 필요가? -> 네이밍 규약 이슈
// Q. response도 똑같아서 response는 GetMyInfoResponseDto 썼음
export class UpdateMyInfoDto {
    profileImagePath: string | null;
    nickname: string;
}