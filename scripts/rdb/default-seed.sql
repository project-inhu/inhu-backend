-- place_type_tb: idx 컬럼과 값을 직접 추가
INSERT INTO place_type_tb (idx, content) VALUES
(1, '카페'),
(2, '식당'),
(3, '술집'),
(4, '기타');

-- keyword_tb: idx 컬럼과 값을 직접 추가
INSERT INTO keyword_tb (idx, content) VALUES
(1, '인테리어가 예뻐요'),
(2, '디저트 맛집이에요'),
(3, '사진 찍기 좋아요'),
(4, '가격이 저렴해요'),
(5, '매장이 청결해요'),
(6, '분위기가 좋아요'),
(7, '인하대 학생 이벤트가 있어요'),
(8, '늦게까지 운영해요'),
(9, '집중하기 좋아요');

-- service1_tb: idx 컬럼과 값을 직접 추가
INSERT INTO service1_tb (idx, content) VALUES
(1, '매우 만족했어요'),
(2, '만족스러웠어요'),
(3, '보통이에요'),
(4, '조금 실망했어요'),
(5, '많이 실망스러웠어요');

-- service2_tb: idx 컬럼과 값을 직접 추가
INSERT INTO service2_tb (idx, content) VALUES
(1, '서비스 지역이 확장됐으면 좋겠어요'),
(2, '리뷰 작성을 통한 리워드가 있으면 좋겠어요'),
(3, '쿠폰 적립이 있는 경우 연동이 됐으면 좋겠어요'),
(4, '기타');

-- withdraw_service_tb: idx 컬럼과 값을 직접 추가
INSERT INTO withdraw_service_tb (idx, content) VALUES
(1, '이용을 잘 안하게 돼요'),
(2, '개인정보 보호를 위해 삭제하고 싶어요'),
(3, '인하대 후문을 떠나게 됐어요'),
(4, '기술적인 오류가 많아서 불편해요'),
(5, '유사한 다른 서비스를 더 자주 이용해요'),
(6, '원하는 기능이 부족해요');