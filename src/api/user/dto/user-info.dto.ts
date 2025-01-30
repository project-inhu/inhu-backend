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