/**
 * callback 으로 전달되는 Apple 로그인 응답의 body 형식
 *
 * @author 이수인
 */

interface AppleCallbackBody {
  authorizationCode?: {
    code: string;
    id_token?: string;
    state?: string;
  };
  user?: {
    email?: string;
    name?: {
      firstName?: string;
      lastName?: string;
    };
  };
}
