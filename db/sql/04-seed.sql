INSERT INTO user_tb (nickname) VALUES
('맛집탐방가'),
('인덕이');

INSERT INTO place_tb (name, tel, address, address_x, address_y) VALUES
('스타벅스 인하대점', '1522-3232', '인천 미추홀구 인하로59', 126.650892, 37.452601);

INSERT INTO menu_tb (place_idx, name, content, price, image_path) VALUES 
(1, '아메리카노', '깊고 진한 에스프레소의 깔끔한 맛', 4500, '/menu/c3b2d1a0-e9f8-7654-3210-fedcba987654-202507062_11400.jpg'), 
(1, '카페라떼', '부드러운 우유와 에스프레소의 고소한 조화', 5000, '/menu/c3b2d1a0-e9f8-7654-3210-fedcba987655-20250706_211401.jpg');
INSERT INTO operating_day_tb (place_idx, day) VALUES
(1, 'mon'),
(1, 'tue'),
(1, 'wed'),
(1, 'thu'),
(1, 'fri'),
(1, 'sat'),
(1, 'sun');
INSERT INTO operating_hour_tb (operating_day_idx, start_at, end_at) VALUES
(1, '08:00:00', '22:00:00'),
(2, '08:00:00', '22:00:00'),
(3, '08:00:00', '22:00:00'),
(4, '08:00:00', '22:00:00'),
(5, '08:00:00', '22:00:00'),
(6, '08:00:00', '22:00:00'),
(7, '08:00:00', '22:00:00');
INSERT INTO place_image_tb (place_idx, image_path) VALUES
(1, 'place/f9c2e36f-8e99-4b18-b3e8-7cd327682f94_20240706_124512.jpg');
INSERT INTO place_type_mapping_tb (place_idx, place_type_idx) VALUES 
(1, 1);

INSERT INTO place_tb (name, tel, address, address_x, address_y) VALUES
('인하칼국수 인하대후문점', '032-874-4067', '인천 미추홀구 경인남길30번길 35-1 1층', 126.654536, 37.460835);

INSERT INTO menu_tb (place_idx, name, content, price, is_flexible) VALUES 
(2, '해물칼국수', '계절에 따라 달라요', 10000, true);
INSERT INTO menu_tb (place_idx, name, price) VALUES 
(2, '들깨칼국수', 9500);
INSERT INTO operating_day_tb (place_idx, day) VALUES
(2, 'mon'),
(2, 'wed'),
(2, 'thu'),
(2, 'fri'),
(2, 'sat'),
(2, 'sun');
INSERT INTO operating_hour_tb (operating_day_idx, start_at, end_at) VALUES
(8, '08:00:00', '12:00:00'),
(8, '14:00:00', '20:00:00'),
(10, '08:00:00', '12:00:00'),
(10, '14:00:00', '20:00:00'),
(11, '08:00:00', '12:00:00'),
(11, '14:00:00', '20:00:00'),
(12, '08:00:00', '20:00:00'),
(13, '08:00:00', '20:00:00');
INSERT INTO break_time_tb (operating_hour_idx, start_at, end_at) VALUES
(8, '10:00:00', '10:30:00'),
(9, '17:00:00', '17:30:00'),
(10, '10:00:00', '10:30:00'), 
(11, '17:00:00', '17:30:00'),
(12, '10:00:00', '10:30:00'), 
(13, '17:00:00', '17:30:00'),
(14, '10:00:00', '10:30:00'), 
(15, '17:00:00', '17:30:00');
INSERT INTO place_image_tb (place_idx, image_path) VALUES 
(2, 'place/7e4a0a69-60d2-4d90-a1aa-70ef8e40816d_20240706_124512.jpg');
INSERT INTO place_type_mapping_tb (place_idx, place_type_idx) VALUES 
(2, 2);

INSERT INTO place_tb (name, tel, address, address_x, address_y) VALUES
('피자헛 인하대점', '032-123-4567', '인천 미추홀구 인하로 100', 126.651000, 37.453000);
INSERT INTO menu_tb (place_idx, name, content, price) VALUES
(3, '페퍼로니 피자', '클래식한 맛의 피자', 22000),
(3, '치즈 스파게티', '고소한 치즈 스파게티', 12000);
INSERT INTO operating_day_tb (place_idx, day) VALUES 
(3, 'mon'), 
(3, 'tue'), 
(3, 'wed'), 
(3, 'thu'), 
(3, 'fri'), 
(3, 'sat'), 
(3, 'sun');
INSERT INTO operating_hour_tb (operating_day_idx, start_at, end_at) VALUES 
(14, '11:00:00', '23:00:00'), 
(15, '11:00:00', '23:00:00'), 
(16, '11:00:00', '23:00:00'), 
(17, '11:00:00', '23:00:00'), 
(18, '11:00:00', '23:00:00'), 
(19, '11:00:00', '23:00:00'), 
(20, '11:00:00', '23:00:00');
INSERT INTO place_image_tb (place_idx, image_path) VALUES
(3, 'place/c2b1e0f0-1234-5678-9abc-def012345678_20250706_120000.jpg');
INSERT INTO place_type_mapping_tb (place_idx, place_type_idx) VALUES (3, 2); 

INSERT INTO place_tb (name, tel, address, address_x, address_y) VALUES
('새로운 카페이름', '070-9876-5432', '인천 미추홀구 학익동 123', 126.660000, 37.450000);
INSERT INTO menu_tb (place_idx, name, content, price) VALUES
(4, '오늘의 커피', '매일 바뀌는 스페셜티 커피', 6000);
INSERT INTO operating_day_tb (place_idx, day) VALUES 
(4, 'mon'), 
(4, 'tue'), 
(4, 'wed'), 
(4, 'thu'), 
(4, 'fri');
INSERT INTO operating_hour_tb (operating_day_idx, start_at, end_at) VALUES 
(21, '09:00:00', '18:00:00'), 
(22, '09:00:00', '18:00:00'), 
(23, '09:00:00', '18:00:00'), 
(24, '09:00:00', '18:00:00'), 
(25, '09:00:00', '18:00:00');
INSERT INTO place_image_tb (place_idx, image_path) VALUES
(4, 'place/d3e4f5g6-7890-abcd-ef01-234567890abc_20250706_120100.jpg');
INSERT INTO place_type_mapping_tb (place_idx, place_type_idx) VALUES (4, 1);

INSERT INTO place_tb (name, tel, address, address_x, address_y) VALUES
('만두나라', '032-555-1212', '인천 미추홀구 용현동 456', 126.655000, 37.455000);
INSERT INTO menu_tb (place_idx, name, content, price) VALUES
(5, '고기만두', '육즙 가득 고기만두', 5000),
(5, '김치만두', '매콤한 김치만두', 5000);
INSERT INTO operating_day_tb (place_idx, day) VALUES 
(5, 'mon'), 
(5, 'tue'), 
(5, 'wed'), 
(5, 'thu'), 
(5, 'fri'), 
(5, 'sat');
INSERT INTO operating_hour_tb (operating_day_idx, start_at, end_at) VALUES 
(26, '10:00:00', '21:00:00'), 
(27, '10:00:00', '21:00:00'), 
(28, '10:00:00', '21:00:00'), 
(29, '10:00:00', '21:00:00'),
(30, '10:00:00', '21:00:00'), 
(31, '10:00:00', '21:00:00');
INSERT INTO place_image_tb (place_idx, image_path) VALUES
(5, 'place/e4f5g6h7-8901-2345-6789-0abcdef01234_20250706_120200.jpg');
INSERT INTO place_type_mapping_tb (place_idx, place_type_idx) VALUES (5, 2); 

INSERT INTO review_tb (user_idx, place_idx, content) VALUES
(1, 1, '역시 스타벅스! 원두향이 좋아요'),
(1, 2, '칼국수 엄청 맛있어요'),
(2, 1, '비싸지만 맛있어요'),
(1, 3, '피자 너무 맛있어요! 친구들이랑 또 올 거예요.'),
(2, 3, '스파게티도 최고! 배달도 빠르고 좋아요.'),
(1, 3, '아이들이 좋아해서 자주 옵니다. 친절해요.'),
(2, 3, '가격은 좀 있지만 맛있어서 용서됩니다.'),
(1, 5, '만두가 정말 맛있네요. 재방문 의사 있습니다.');

INSERT INTO review_image_tb (review_idx, image_path) VALUES
(2, 'review/f7c873c2-4fc6-4a8d-9b8e-85d8a51f56b3-.jpg'),
(2, 'review/b631f9d2-35d1-4b5f-a97f-52f4f41326e3_20240706_124512.jpg'),
(3, 'review/baebea0a-9110-455f-84f6-5608f8978c47_20240706_124512.jpg'),
(4, 'review/e1a2b3c4-d5e6-f7a8-9b0c-1d2e3f4a5b6c_20250706225300.jpg'),
(4, 'review/f8e9d0c1-b2a3-4b5c-6d7e-8f9a0b1c2d3e_20250706225301.jpg'),
(8, 'review/g9h0i1j2-k3l4-m5n6-o7p8-q9r0s1t2u3v4_20250706225302.jpg'); 

INSERT INTO review_keyword_mapping_tb (review_idx, keyword_idx) VALUES
(1, 1),
(2, 2),
(2, 4),
(3, 1),
(3, 3),
(4, 1), 
(5, 2), 
(6, 3), 
(7, 4),
(8, 1); 

INSERT INTO bookmark_tb (user_idx, place_idx) VALUES 
(1, 1),
(2, 1),
(2, 2);

UPDATE place_tb SET review_count = (SELECT COUNT(*) FROM review_tb WHERE place_idx = place_tb.idx);

INSERT INTO picked_place_tb (place_idx, title, content) VALUES
(2, '깔끔한 분위기', '후문 가까이에 위치해 있어 밥약하기 좋아요'),
(3, '특별한 맛을 원한다면', '맛있는 피자');