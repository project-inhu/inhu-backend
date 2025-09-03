/**
 * 카카오 주소 검색 API 설정
 *
 * @author 강정연
 */
export default () => ({
  kakaoAddress: {
    key: process.env.KAKAO_APPLICATION_REST_API_KEY || '',
  },
});
