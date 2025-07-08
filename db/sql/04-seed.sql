INSERT INTO user_tb (nickname, profile_image_path) VALUES
('맛집탐방가', '/profile/ddccb241-5fc2-4aca-9f6f-89a2b32edd68-puppy.jpg');
INSERT INTO user_tb (nickname) VALUES
('인덕이');

INSERT INTO place_tb (name, tel, address, address_x, address_y) VALUES
('스타벅스 인하대점', '1522-3232', '인천 미추홀구 인하로59', 126.650892, 37.452601);
INSERT INTO menu_tb (place_idx, name, content, price, image_path) VALUES 
(1, '아이스 아메리카노', '시원하고 깔끔한 맛', 4500, '/menu/41ee298f-7745-43cd-b81b-374a0e692fc9-candies.jpg'),
(1, '디카페인 아메리카노', '카페인 부담 없이 즐기는 커피', 4800, '/menu/41ee298f-7745-43cd-b81b-374a0e692fc9-candies.jpg'),
(1, '카라멜 마끼아또', '달콤한 카라멜과 부드러운 우유의 조화', 5900, '/menu/41ee298f-7745-43cd-b81b-374a0e692fc9-candies.jpg'),
(1, '돌체 콜드 브루', '연유의 달콤함과 콜드 브루의 깊은 풍미', 6000, '/menu/41ee298f-7745-43cd-b81b-374a0e692fc9-candies.jpg'),
(1, '자몽 허니 블랙 티', '자몽과 꿀의 상큼달콤한 조화', 5700, '/menu/41ee298f-7745-43cd-b81b-374a0e692fc9-candies.jpg'),
(1, '딸기 아사이 레모네이드 리프레셔', '딸기와 아사이베리의 상큼한 맛', 5900, '/menu/41ee298f-7745-43cd-b81b-374a0e692fc9-candies.jpg'),
(1, '제주 말차 라떼', '제주산 말차의 진하고 쌉싸름한 맛', 6100, '/menu/41ee298f-7745-43cd-b81b-374a0e692fc9-candies.jpg'),
(1, '클래식 스콘', '버터 풍미 가득한 담백한 스콘', 3500, '/menu/41ee298f-7745-43cd-b81b-374a0e692fc9-candies.jpg'),
(1, '블루베리 베이글', '블루베리가 콕콕 박힌 쫄깃한 베이글', 3000, '/menu/41ee298f-7745-43cd-b81b-374a0e692fc9-candies.jpg'),
(1, '부드러운 생크림 카스텔라', '촉촉한 카스텔라와 부드러운 생크림', 4500, '/menu/41ee298f-7745-43cd-b81b-374a0e692fc9-candies.jpg'),
(1, '바닐라 크림 콜드 브루', '바닐라 크림의 부드러움과 콜드 브루의 만남', 5800,'/menu/41ee298f-7745-43cd-b81b-374a0e692fc9-candies.jpg');
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
(1, '/place/bakery.jpg');
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
(2, '/place/bakery.jpg');
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
(3, '/place/big_volume_mountain.jpg');
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
(4, '/place/big_volume_mountain.jpg');
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
(5, '/place/big_volume_mountain.jpg');
INSERT INTO place_type_mapping_tb (place_idx, place_type_idx) VALUES (5, 2); 

INSERT INTO place_tb (name, tel, address, address_x, address_y) VALUES
('어머니의 손맛 찌개집', '032-875-1234', '인천 미추홀구 용현동 123-4', 126.653333, 37.459999);
INSERT INTO operating_day_tb (place_idx, day) VALUES
(6, 'mon'), (6, 'tue'), (6, 'wed'), (6, 'thu'), (6, 'fri'), (6, 'sat');
INSERT INTO operating_hour_tb (operating_day_idx, start_at, end_at) VALUES
(32, '11:00:00', '21:00:00'), (33, '11:00:00', '21:00:00'), (34, '11:00:00', '21:00:00'), (35, '11:00:00', '21:00:00'), (36, '11:00:00', '21:00:00'), (37, '11:00:00', '21:00:00');
INSERT INTO break_time_tb (operating_hour_idx, start_at, end_at) VALUES
(34, '15:00:00', '16:30:00'), (35, '15:00:00', '16:30:00'), (36, '15:00:00', '16:30:00'), (37, '15:00:00', '16:30:00'), (38, '15:00:00', '16:30:00');
INSERT INTO menu_tb (place_idx, name, price) VALUES 
(6, '김치찌개', 8500), (6, '된장찌개', 8500);
INSERT INTO place_image_tb (place_idx, image_path) VALUES 
(6, '/place/bakery.jpg');
INSERT INTO place_type_mapping_tb (place_idx, place_type_idx) VALUES (6, 2);

INSERT INTO place_tb (name, tel, address, address_x, address_y) VALUES
('달콤한 하루', '070-1111-2222', '인천 미추홀구 인하로77번길 10', 126.651111, 37.454444);
INSERT INTO operating_day_tb (place_idx, day) VALUES
(7, 'tue'), (7, 'wed'), (7, 'thu'), (7, 'fri'), (7, 'sat'), (7, 'sun');
INSERT INTO operating_hour_tb (operating_day_idx, start_at, end_at) VALUES
(38, '12:00:00', '22:00:00'), (39, '12:00:00', '22:00:00'), (40, '12:00:00', '22:00:00'), (41, '12:00:00', '22:00:00'), (42, '12:00:00', '22:00:00'), (43, '12:00:00', '22:00:00');
INSERT INTO menu_tb (place_idx, name, content, price) VALUES 
(7, '딸기빙수', '신선한 딸기가 듬뿍', 13000), (7, '치즈케이크', '꾸덕한 뉴욕 치즈케이크', 6500);
INSERT INTO place_image_tb (place_idx, image_path) VALUES 
(7, '/place/bakery.jpg');
INSERT INTO place_type_mapping_tb (place_idx, place_type_idx) VALUES (7, 1);

INSERT INTO place_tb (name, tel, address, address_x, address_y) VALUES
('오하이요', '032-876-5432', '인천 미추홀구 경인남길 20', 126.654321, 37.461234);
INSERT INTO operating_day_tb (place_idx, day) VALUES
(8, 'mon'), (8, 'tue'), (8, 'wed'), (8, 'thu'), (8, 'fri');
INSERT INTO operating_hour_tb (operating_day_idx, start_at, end_at) VALUES
(44, '11:30:00', '20:30:00'), (45, '11:30:00', '20:30:00'), (46, '11:30:00', '20:30:00'), (47, '11:30:00', '20:30:00'), (48, '11:30:00', '20:30:00');
INSERT INTO menu_tb (place_idx, name, price) VALUES 
(8, '가츠동', 9000), (8, '사케동', 12000);
INSERT INTO place_image_tb (place_idx, image_path) VALUES 
(8, '/place/bakery.jpg');
INSERT INTO place_type_mapping_tb (place_idx, place_type_idx) VALUES (8, 2);

INSERT INTO place_tb (name, tel, address, address_x, address_y) VALUES
('인하비어', '010-1234-5678', '인천 미추홀구 인하로99번길 5', 126.652222, 37.455555);
INSERT INTO operating_day_tb (place_idx, day) VALUES
(9, 'wed'), (9, 'thu'), (9, 'fri'), (9, 'sat');
INSERT INTO operating_hour_tb (operating_day_idx, start_at, end_at) VALUES
(49, '18:00:00', '01:00:00'), (50, '18:00:00', '01:00:00'), (51, '18:00:00', '02:00:00'), (52, '18:00:00', '02:00:00');
INSERT INTO menu_tb (place_idx, name, price) VALUES 
(9, '페일에일', 7000), (9, '치킨 플래터', 24000);
INSERT INTO place_image_tb (place_idx, image_path) VALUES 
(9, '/place/bakery.jpg');
INSERT INTO place_type_mapping_tb (place_idx, place_type_idx) VALUES (9, 2);

INSERT INTO place_tb (name, tel, address, address_x, address_y) VALUES
('열공 스터디카페', '032-111-2222', '인천 미추홀구 소성로 30', 126.650000, 37.450000);
INSERT INTO operating_day_tb (place_idx, day) VALUES
(10, 'mon'), (10, 'tue'), (10, 'wed'), (10, 'thu'), (10, 'fri'), (10, 'sat'), (10, 'sun');
INSERT INTO operating_hour_tb (operating_day_idx, start_at, end_at) VALUES
(53, '00:00:00', '23:59:59'), (54, '00:00:00', '23:59:59'), (55, '00:00:00', '23:59:59'), (56, '00:00:00', '23:59:59'), (57, '00:00:00', '23:59:59'), (58, '00:00:00', '23:59:59'), (59, '00:00:00', '23:59:59');
INSERT INTO menu_tb (place_idx, name, price) VALUES 
(10, '4시간 이용권', 6000);
INSERT INTO place_image_tb (place_idx, image_path) VALUES 
(10, '/place/bakery.jpg');
INSERT INTO place_type_mapping_tb (place_idx, place_type_idx) VALUES (10, 1);

INSERT INTO place_tb (name, tel, address, address_x, address_y) VALUES
('빵 굽는 마을', '032-888-7777', '인천 미추홀구 독배로 400', 126.656789, 37.457890);
INSERT INTO operating_day_tb (place_idx, day) VALUES
(11, 'mon'), (11, 'tue'), (11, 'wed'), (11, 'thu'), (11, 'fri'), (11, 'sat');
INSERT INTO operating_hour_tb (operating_day_idx, start_at, end_at) VALUES
(60, '08:00:00', '20:00:00'), (61, '08:00:00', '20:00:00'), (62, '08:00:00', '20:00:00'), (63, '08:00:00', '20:00:00'), (64, '08:00:00', '20:00:00'), (65, '08:00:00', '20:00:00');
INSERT INTO menu_tb (place_idx, name, price) VALUES 
(11, '소금빵', 3000), (11, '앙버터', 4500);
INSERT INTO place_image_tb (place_idx, image_path) VALUES 
(11, '/place/big_volume_mountain.jpg');
INSERT INTO place_type_mapping_tb (place_idx, place_type_idx) VALUES (11, 2);

INSERT INTO place_tb (name, tel, address, address_x, address_y) VALUES
('맘스터치 인하대점', '032-872-9999', '인천 미추홀구 인하로77번길 20', 126.652345, 37.456789);
INSERT INTO operating_day_tb (place_idx, day) VALUES
(12, 'mon'), (12, 'tue'), (12, 'wed'), (12, 'thu'), (12, 'fri'), (12, 'sat'), (12, 'sun');
INSERT INTO operating_hour_tb (operating_day_idx, start_at, end_at) VALUES
(66, '10:00:00', '22:00:00'), (67, '10:00:00', '22:00:00'), (68, '10:00:00', '22:00:00'), (69, '10:00:00', '22:00:00'), (70, '10:00:00', '22:00:00'), (71, '10:00:00', '22:00:00'), (72, '10:00:00', '22:00:00');
INSERT INTO menu_tb (place_idx, name, price) VALUES 
(12, '싸이버거 세트', 7200);
INSERT INTO place_image_tb (place_idx, image_path) VALUES 
(12, '/place/big_volume_mountain.jpg');
INSERT INTO place_type_mapping_tb (place_idx, place_type_idx) VALUES (12, 2);


INSERT INTO review_tb (user_idx, place_idx, content) VALUES
(1, 1, '역시 스타벅스! 원두향이 좋아요'),
(1, 2, '칼국수 엄청 맛있어요'),
(2, 1, '비싸지만 맛있어요'),
(1, 3, '피자 너무 맛있어요! 친구들이랑 또 올 거예요.'),
(2, 3, '스파게티도 최고! 배달도 빠르고 좋아요.'),
(1, 3, '아이들이 좋아해서 자주 옵니다. 친절해요.'),
(2, 3, '가격은 좀 있지만 맛있어서 용서됩니다.'),
(1, 5, '만두가 정말 맛있네요. 재방문 의사 있습니다.'),
(1, 6, '김치찌개가 정말 집밥 같아요. 맛있어요.'),
(2, 6, '혼밥하기 딱 좋은 곳입니다.'),
(1, 7, '빙수 양도 많고 케이크도 맛있어요!'),
(2, 7, '분위기가 좋아서 데이트하기 좋아요.'),
(1, 8, '가츠동 양이 많고 바삭해요.'),
(2, 8, '점심시간에 가면 사람이 많아요. 그만큼 맛집!'),
(1, 9, '치킨이 진짜 맛있네요. 맥주랑 찰떡궁합.'),
(2, 10, '조용해서 공부하기 좋아요. 콘센트도 많아요.'),
(1, 11, '갓 나온 소금빵 최고에요!'),
(2, 12, '역시 믿고 먹는 싸이버거입니다.');

INSERT INTO review_image_tb (review_idx, image_path) VALUES
(2, '/review/b631f9d2-35d1-4b5f-a97f-52f4f41326e3_20240706_124512.jpg'),
(2, '/review/b631f9d2-35d1-4b5f-a97f-52f4f41326e3_20240706_124512.jpg'),
(3, '/review/b631f9d2-35d1-4b5f-a97f-52f4f41326e3_20240706_124512.jpg'),
(4, '/review/b631f9d2-35d1-4b5f-a97f-52f4f41326e3_20240706_124512.jpg'),
(4, '/review/b631f9d2-35d1-4b5f-a97f-52f4f41326e3_20240706_124512.jpg'),
(8, '/review/b631f9d2-35d1-4b5f-a97f-52f4f41326e3_20240706_124512.jpg'),
(9, '/review/b631f9d2-35d1-4b5f-a97f-52f4f41326e3_20240706_124512.jpg'),
(11, '/review/b631f9d2-35d1-4b5f-a97f-52f4f41326e3_20240706_124512.jpg'),
(13, '/review/b631f9d2-35d1-4b5f-a97f-52f4f41326e3_20240706_124512.jpg');

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
(8, 1),
(9, 1), 
(10, 2), 
(11, 1), 
(12, 3), 
(13, 1), 
(14, 2), 
(15, 4), 
(16, 2), 
(17, 1), 
(18, 1);

INSERT INTO bookmark_tb (user_idx, place_idx) VALUES 
(1, 1),
(2, 1),
(2, 2);

UPDATE place_tb SET review_count = (SELECT COUNT(*) FROM review_tb WHERE place_idx = place_tb.idx);

INSERT INTO picked_place_tb (place_idx, title, content) VALUES
(2, '깔끔한 분위기', '후문 가까이에 위치해 있어 밥약하기 좋아요');
INSERT INTO picked_place_tb (place_idx, title, content) VALUES
(3, '특별한 맛을 원한다면', '맛있는 피자');