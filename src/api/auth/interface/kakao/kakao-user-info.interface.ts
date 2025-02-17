/**
 * KakaoUserInfo 인터페이스: 카카오에서 받아온 사용자 정보 구조를 정의
 */
interface KakaoUserInfo {
  /**
   * 카카오 계정의 고유 ID
   */
  id: number;
  /**
   * 자동 연결 설정을 비활성화한 경우만 존재
   * 연결하기 호출의 완료 여부
   * false: 연결 대기(Preregistered) 상태
   * true: 연결(Registered) 상태
   */
  has_signed_up?: boolean;
  /**
   * 서비스에 연결 완료된 시각, UTC
   */
  connected_at?: string;
  /**
   * 카카오싱크 간편가입을 통해 로그인한 시각, UTC
   */
  synched_at?: string;

  /**
   * 사용자 프로퍼티(Property)
   */
  properties?: {
    /**
     * 사용자의 닉네임
     */
    nickname?: string;
    /**
     * 프로필 사진 URL
     * 640px * 640px 또는 480px * 480px
     */
    profile_image?: string;
    /**
     * 프로필 미리보기 이미지 URL
     * 110px * 110px 또는 100px * 100px
     */
    thumbnail_image?: string;
  };

  /**
   * 카카오계정 정보
   */
  kakao_account?: {
    /**
     * 사용자 동의 시 프로필 정보(닉네임/프로필 사진) 제공 가능 여부
     *
     * 필요한 동의항목: 프로필 정보(닉네임/프로필 사진)
     */
    profile_needs_agreement: boolean;

    /**
     * 사용자 동의 시 닉네임 제공 가능 여부
     *
     * 필요한 동의항목: 닉네임
     */
    profile_nickname_needs_agreement?: boolean;

    /**
     * 사용자 동의 시 프로필 사진 제공 가능 여부
     *
     * 필요한 동의항목: 프로필 사진
     */
    profile_image_needs_agreement?: boolean;

    /**
     * 프로필 정보
     *
     * 필요한 동의항목: 프로필 정보(닉네임/프로필 사진), 닉네임, 프로필 사진
     */
    profile?: {
      /**
       * 닉네임
       *
       * 필요한 동의항목: 프로필 정보(닉네임/프로필 사진) 또는 닉네임
       */
      nickname?: string;
      /**
       * 프로필 미리보기 이미지 URL
       * 110px * 110px 또는 100px * 100px
       *
       * 필요한 동의항목: 프로필 정보(닉네임/프로필 사진) 또는 프로필 사진
       */
      thumbnail_image_url?: string;
      /**
       * 프로필 사진 URL
       * 640px * 640px 또는 480px * 480px
       *
       * 필요한 동의항목: 프로필 정보(닉네임/프로필 사진) 또는 프로필 사진
       */
      profile_image_url?: string;
      /** 프로필 사진 URL이 기본 프로필 사진 URL인지 여부
       * 사용자가 등록한 프로필 사진이 없을 경우, 기본 프로필 사진 제공
       * true: 기본 프로필 사진
       * false: 사용자가 등록한 프로필 사진
       *
       * 필요한 동의항목: 프로필 정보(닉네임/프로필 사진) 또는 프로필 사진
       */
      is_default_image?: boolean;
      /**
       * 닉네임이 기본 닉네임인지 여부
       * 사용자가 등록한 닉네임이 운영정책에 부합하지 않는 경우,
       * "닉네임을 등록해주세요"가 기본 닉네임으로 적용됨
       * true: 기본 닉네임
       * false: 사용자가 등록한 닉네임
       *
       * 필요한 동의항목: 프로필 정보(닉네임/프로필 사진) 또는 닉네임
       */
      is_default_nickname?: boolean;
    };

    /**
     * 이메일 정보 제공 여부
     */
    has_email?: boolean;
    /**
     * 사용자 동의 시 카카오계정 이름 제공 가능 여부
     *
     * 필요한 동의항목: 이름
     */
    name_needs_agreement?: boolean;
    /**
     * 카카오계정 이름
     *
     * 필요한 동의항목: 이름
     */
    name?: string;

    /**
     * 사용자 동의 시 카카오계정 대표 이메일 제공 가능 여부
     *
     * 필요한 동의항목: 카카오계정(이메일)
     */
    email_needs_agreement?: boolean;
    /**
     * 이메일 유효 여부
     * true: 유효한 이메일
     * false: 이메일이 다른 카카오계정에 사용돼 만료
     *
     * 필요한 동의항목: 카카오계정(이메일)
     */
    is_email_valid?: boolean;
    /**
     * 이메일 인증 여부
     * true: 인증된 이메일
     * false: 인증되지 않은 이메일
     *
     * 필요한 동의항목: 카카오계정(이메일)
     */
    is_email_verified?: boolean;
    /**
     * 카카오계정 대표 이메일
     *
     * 필요한 동의항목: 카카오계정(이메일)
     */
    email?: string;

    /**
     * 사용자 동의 시 연령대 제공 가능 여부
     *
     * 필요한 동의항목: 연령대
     */
    age_range_needs_agreement?: boolean;
    /**
     * 연령대
     * 1~9: 1세 이상 10세 미만
     * 10~14: 10세 이상 15세 미만
     * 15~19: 15세 이상 20세 미만
     * 20~29: 20세 이상 30세 미만
     * 30~39: 30세 이상 40세 미만
     * 40~49: 40세 이상 50세 미만
     * 50~59: 50세 이상 60세 미만
     * 60~69: 60세 이상 70세 미만
     * 70~79: 70세 이상 80세 미만
     * 80~89: 80세 이상 90세 미만
     * 90~: 90세 이상
     *
     * 필요한 동의항목: 연령대
     */
    age_range?: string;

    /**
     * 사용자 동의 시 출생 연도 제공 가능 여부
     *
     * 필요한 동의항목: 출생 연도
     */
    birthyear_needs_agreement?: boolean;
    /**
     * 출생 연도(YYYY 형식)
     *
     * 필요한 동의항목: 출생 연도
     */
    birthyear?: string;

    /**
     * 사용자 동의 시 생일 제공 가능 여부
     *
     * 필요한 동의항목: 생일
     */
    birthday_needs_agreement?: boolean;
    /**
     * 생일(MMDD 형식)
     *
     * 필요한 동의항목: 생일
     */
    birthday?: string;
    /**
     * 생일 타입
     * SOLAR(양력) 또는 LUNAR(음력)
     *
     * 필요한 동의항목: 생일
     */
    birthday_type?: string;
    /**
     * 생일의 윤달 여부
     *
     * 필요한 동의항목: 생일
     * */
    is_leap_month?: boolean;

    /**
     * 사용자 동의 시 성별 제공 가능 여부
     *
     * 필요한 동의항목: 성별
     */
    gender_needs_agreement?: boolean;
    /**
     * 성별
     * female: 여성
     * male: 남성
     *
     * 필요한 동의항목: 성별
     */
    gender?: string;

    /**
     * 사용자 동의 시 전화번호 제공 가능 여부
     *
     * 필요한 동의항목: 카카오계정(전화번호)
     */
    phone_number_needs_agreement?: boolean;
    /**
     * 카카오계정의 전화번호
     * 국내 번호인 경우 +82 00-0000-0000 형식
     * 해외 번호인 경우 자릿수, 붙임표(-) 유무나 위치가 다를 수 있음
     *
     * 필요한 동의항목: 카카오계정(전화번호)
     */
    phone_number?: string;

    /**
     * 사용자 동의 시 CI 참고 가능 여부
     *
     * 필요한 동의항목: CI(연계정보)
     */
    ci_needs_agreement?: boolean;
    /**
     * 연계정보
     *
     * 필요한 동의항목: CI(연계정보)
     */
    ci?: string;
    /**
     * CI 발급 시각, UTC
     *
     * 필요한 동의항목: CI(연계정보)
     */
    ci_authenticated_at?: string;
  };

  /**
   * uuid 등 추가 정보
   */
  for_partner?: {
    /**
     * 고유 ID
     * 카카오톡 메시지 API 사용 권한이 있는 경우에만 제공
     */
    uuid?: string;
  };
}
