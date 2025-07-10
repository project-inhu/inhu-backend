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
(1, '바닐라 크림 콜드 브루', '바닐라 크림의 부드러움과 콜드 브루의 만남', 5800,'/menu/41ee298f-7745-43cd-b81b-374a0e692fc9-candies.jpg'),
(1, '카라멜 프라푸치노', '달콤한 카라멜과 부드러운 우유의 조화', 6200, '/menu/41ee298f-7745-43cd-b81b-374a0e692fc9-candies.jpg');
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
INSERT INTO place_image_tb (place_idx, image_path) VALUES
(1, '/place/hospital.jpg');
INSERT INTO place_image_tb (place_idx, image_path) VALUES
(1, '/place/moscow.jpg');
INSERT INTO place_image_tb (place_idx, image_path) VALUES
(1, '/place/soccer_field.jpg');
INSERT INTO place_image_tb (place_idx, image_path) VALUES
(1, '/place/theater.jpg');
INSERT INTO place_type_mapping_tb (place_idx, place_type_idx) VALUES 
(1, 1);

INSERT INTO place_tb (name, tel, address, address_x, address_y) VALUES
('인하칼국수 인하대후문점', '032-874-4067', '인천 미추홀구 경인남길30번길 35-1 1층', 126.654536, 37.460835);
INSERT INTO menu_tb (place_idx, name, content, is_flexible) VALUES 
(2, '해물칼국수', '계절에 따라 달라요', true);
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
INSERT INTO place_image_tb (place_idx, image_path) VALUES 
(2, '/place/hospital.jpg');
INSERT INTO place_image_tb (place_idx, image_path) VALUES 
(2, '/place/soccer_field.jpg');
INSERT INTO place_type_mapping_tb (place_idx, place_type_idx) VALUES 
(2, 2);

INSERT INTO place_tb (name, tel, address, address_x, address_y) VALUES
('피자헛 인하대점', '032-123-4567', '인천 미추홀구 인하로 100', 126.651000, 37.453000);
INSERT INTO menu_tb (place_idx, name, content, price, image_path) VALUES
(3, '페퍼로니 피자', '클래식한 맛의 피자', 22000, '/menu/41ee298f-7745-43cd-b81b-374a0e692fc9-candies.jpg'),
(3, '치즈 스파게티', '고소한 치즈 스파게티', 12000, '/menu/41ee298f-7745-43cd-b81b-374a0e692fc9-candies.jpg');
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
INSERT INTO break_time_tb (operating_hour_idx, start_at, end_at) VALUES
(16, '15:00:00', '16:30:00'), 
(17, '15:00:00', '16:30:00'), 
(18, '15:00:00', '16:30:00'), 
(19, '15:00:00', '16:30:00'), 
(20, '15:00:00', '16:30:00'), 
(21, '15:00:00', '16:30:00'), 
(22, '15:00:00', '16:30:00');
INSERT INTO place_image_tb (place_idx, image_path) VALUES
(3, '/place/big_volume_mountain.jpg');
INSERT INTO place_image_tb (place_idx, image_path) VALUES
(3, '/place/hospital.jpg');
INSERT INTO place_type_mapping_tb (place_idx, place_type_idx) VALUES 
(3, 2),
(3, 3); 

INSERT INTO place_tb (name, tel, address, address_x, address_y) VALUES
('새로운 카페이름', '070-9876-5432', '인천 미추홀구 학익동 123', 126.660000, 37.450000);
INSERT INTO operating_day_tb (place_idx, day) VALUES 
(4, 'mon'), 
(4, 'tue'), 
(4, 'wed'), 
(4, 'thu'),
(4, 'fri'),
(4, 'sat'), 
(4, 'sun'); 
INSERT INTO operating_hour_tb (operating_day_idx, start_at, end_at) VALUES 
(21, '09:00:00', '18:00:00'), 
(22, '09:00:00', '18:00:00'), 
(23, '09:00:00', '18:00:00'), 
(24, '09:00:00', '18:00:00'), 
(25, '09:00:00', '18:00:00'); 
INSERT INTO break_time_tb (operating_hour_idx, start_at, end_at) VALUES
(23, '12:00:00', '13:30:00'), 
(24, '12:00:00', '13:30:00'), 
(25, '12:00:00', '13:30:00'),
(26, '12:00:00', '13:30:00'), 
(27, '12:00:00', '13:30:00');
INSERT INTO place_image_tb (place_idx, image_path) VALUES
(4, '/place/big_volume_mountain.jpg');
INSERT INTO place_type_mapping_tb (place_idx, place_type_idx) VALUES (4, 1);

INSERT INTO place_tb (name, tel, address, address_x, address_y) VALUES
('만두나라', '032-555-1212', '인천 미추홀구 용현동 456', 126.655000, 37.455000);
INSERT INTO menu_tb (place_idx, name, content, price,image_path) VALUES
(5, '고기만두', '육즙 가득 고기만두', 5000, '/menu/41ee298f-7745-43cd-b81b-374a0e692fc9-candies.jpg');
INSERT INTO menu_tb (place_idx, name, content, price) VALUES
(5, '김치만두', '매콤한 김치만두', 5000);
INSERT INTO operating_day_tb (place_idx, day) VALUES 
(5, 'mon'), 
(5, 'tue'), 
(5, 'wed'), 
(5, 'thu'), 
(5, 'fri'), 
(5, 'sat'),
(5, 'sun'); 
INSERT INTO operating_hour_tb (operating_day_idx, start_at, end_at) VALUES 
(28, '10:00:00', '21:00:00'), 
(29, '10:00:00', '21:00:00'), 
(30, '10:00:00', '21:00:00'), 
(31, '10:00:00', '21:00:00'),
(32, '10:00:00', '21:00:00'), 
(33, '10:00:00', '21:00:00'),
(34, '10:00:00', '21:00:00'); 
INSERT INTO break_time_tb (operating_hour_idx, start_at, end_at) VALUES
(28, '15:00:00', '16:30:00'), 
(29, '15:00:00', '16:30:00'), 
(30, '15:00:00', '16:30:00'), 
(31, '15:00:00', '16:30:00'),
(32, '15:00:00', '16:30:00'),
(33, '15:00:00', '16:30:00'),
(34, '15:00:00', '16:30:00');
INSERT INTO place_type_mapping_tb (place_idx, place_type_idx) VALUES (5, 2); 

INSERT INTO place_tb (name, tel, address, address_x, address_y) VALUES
('어머니의 손맛 찌개집', '032-875-1234', '인천 미추홀구 용현동 123-4', 126.653333, 37.459999);
INSERT INTO operating_day_tb (place_idx, day) VALUES
(6, 'mon'), 
(6, 'tue'), 
(6, 'wed'), 
(6, 'thu'), 
(6, 'fri'), 
(6, 'sat'),
(6, 'sun'); 
INSERT INTO operating_hour_tb (operating_day_idx, start_at, end_at) VALUES
(35, '11:00:00', '21:00:00'), 
(36, '11:00:00', '21:00:00'), 
(37, '11:00:00', '21:00:00'), 
(38, '11:00:00', '21:00:00'), 
(39, '11:00:00', '21:00:00'), 
(37, '11:00:00', '21:00:00'); 
INSERT INTO break_time_tb (operating_hour_idx, start_at, end_at) VALUES
(35, '15:00:00', '16:30:00'), 
(36, '15:00:00', '16:30:00'), 
(37, '15:00:00', '16:30:00'), 
(38, '15:00:00', '16:30:00'), 
(39, '15:00:00', '16:30:00'),
(40, '15:00:00', '16:30:00');
INSERT INTO menu_tb (place_idx, name, price, image_path) VALUES 
(6, '김치찌개', 8500, '/menu/41ee298f-7745-43cd-b81b-374a0e692fc9-candies.jpg'), 
(6, '된장찌개', 8500, '/menu/41ee298f-7745-43cd-b81b-374a0e692fc9-candies.jpg');
INSERT INTO place_image_tb (place_idx, image_path) VALUES 
(6, '/place/bakery.jpg');
INSERT INTO place_image_tb (place_idx, image_path) VALUES 
(6, '/place/soccer_field.jpg');
INSERT INTO place_image_tb (place_idx, image_path) VALUES 
(6, '/place/hospital.jpg');
INSERT INTO place_type_mapping_tb (place_idx, place_type_idx) VALUES (6, 2);

INSERT INTO place_tb (name, tel, address, address_x, address_y) VALUES
('달콤한 하루', '070-1111-2222', '인천 미추홀구 인하로77번길 10', 126.651111, 37.454444);
INSERT INTO operating_day_tb (place_idx, day) VALUES
(7, 'tue'), 
(7, 'wed'), 
(7, 'thu'), 
(7, 'fri'), 
(7, 'sat'), 
(7, 'sun'); 
INSERT INTO operating_hour_tb (operating_day_idx, start_at, end_at) VALUES
(42, '12:00:00', '22:00:00'), 
(43, '12:00:00', '22:00:00'), 
(44, '12:00:00', '22:00:00'), 
(45, '12:00:00', '22:00:00');
INSERT INTO break_time_tb (operating_hour_idx, start_at, end_at) VALUES
(40, '15:00:00', '16:30:00'), 
(41, '15:00:00', '16:30:00'), 
(42, '15:00:00', '16:30:00'), 
(43, '15:00:00', '16:30:00');
INSERT INTO menu_tb (place_idx, name, content,is_flexible, image_path) VALUES 
(7, '딸기빙수', '계절마다 달라요', true, '/menu/41ee298f-7745-43cd-b81b-374a0e692fc9-candies.jpg');
INSERT INTO menu_tb (place_idx, name, content, price, image_path) VALUES 
(7, '치즈케이크', '꾸덕한 뉴욕 치즈케이크', 6500, '/menu/41ee298f-7745-43cd-b81b-374a0e692fc9-candies.jpg');
INSERT INTO place_image_tb (place_idx, image_path) VALUES 
(7, '/place/bakery.jpg');
INSERT INTO place_image_tb (place_idx, image_path) VALUES 
(7, '/place/moscow.jpg');
INSERT INTO place_type_mapping_tb (place_idx, place_type_idx) VALUES (7, 1);

INSERT INTO place_tb (name, tel, address, address_x, address_y) VALUES
('오하이요', '032-876-5432', '인천 미추홀구 경인남길 20', 126.654321, 37.461234);
INSERT INTO operating_day_tb (place_idx, day) VALUES
(8, 'mon'), 
(8, 'tue'), 
(8, 'wed'), 
(8, 'thu'), 
(8, 'fri'); 
INSERT INTO operating_hour_tb (operating_day_idx, start_at, end_at) VALUES
(48, '11:30:00', '13:30:00'), 
(48, '17:30:00', '20:30:00'),
(49, '11:30:00', '13:30:00'), 
(49, '17:30:00', '20:30:00'),
(50, '11:30:00', '13:30:00'), 
(50, '17:30:00', '20:30:00'),
(51, '11:30:00', '13:30:00'), 
(51, '17:30:00', '20:30:00'),
(52, '11:30:00', '13:30:00'), 
(52, '17:30:00', '20:30:00'); 
INSERT INTO menu_tb (place_idx, name, price) VALUES 
(8, '가츠동', 9000),
(8, '사케동', 12000);
INSERT INTO place_image_tb (place_idx, image_path) VALUES 
(8, '/place/bakery.jpg');
INSERT INTO place_type_mapping_tb (place_idx, place_type_idx) VALUES 
(8, 2),
(8, 3);

INSERT INTO place_tb (name, tel, address, address_x, address_y) VALUES
('인하비어', '010-1234-5678', '인천 미추홀구 인하로99번길 5', 126.652222, 37.455555);
INSERT INTO operating_day_tb (place_idx, day) VALUES
(9, 'wed'), 
(9, 'thu'), 
(9, 'fri'), 
(9, 'sat'); 
INSERT INTO operating_hour_tb (operating_day_idx, start_at, end_at) VALUES
(53, '18:00:00', '01:00:00'), 
(54, '18:00:00', '01:00:00'), 
(55, '18:00:00', '02:00:00'), 
(56, '18:00:00', '02:00:00'); 
INSERT INTO menu_tb (place_idx, name, price, image_path) VALUES 
(9, '페일에일', 7000, '/menu/41ee298f-7745-43cd-b81b-374a0e692fc9-candies.jpg'), 
(9, '치킨 플래터', 24000,'/menu/41ee298f-7745-43cd-b81b-374a0e692fc9-candies.jpg');
INSERT INTO place_image_tb (place_idx, image_path) VALUES 
(9, '/place/bakery.jpg');
INSERT INTO place_image_tb (place_idx, image_path) VALUES 
(9, '/place/hospital.jpg');
INSERT INTO place_image_tb (place_idx, image_path) VALUES 
(9, '/place/theater.jpg');
INSERT INTO place_image_tb (place_idx, image_path) VALUES 
(9, '/place/soccer_field.jpg');
INSERT INTO place_image_tb (place_idx, image_path) VALUES 
(9, '/place/moscow.jpg');
INSERT INTO place_type_mapping_tb (place_idx, place_type_idx) VALUES 
(9, 2),
(9, 3);

INSERT INTO place_tb (name, tel, address, address_x, address_y) VALUES
('열공 스터디카페', '032-111-2222', '인천 미추홀구 소성로 30', 126.650000, 37.450000);
INSERT INTO operating_day_tb (place_idx, day) VALUES
(10, 'mon'), 
(10, 'tue'), 
(10, 'wed'), 
(10, 'thu'), 
(10, 'fri'), 
(10, 'sat'), 
(10, 'sun'); 
INSERT INTO operating_hour_tb (operating_day_idx, start_at, end_at) VALUES
(57, '09:00:00', '05:00:00'), 
(58, '09:00:00', '05:00:00'), 
(59, '09:00:00', '05:00:00'), 
(60, '09:00:00', '05:00:00'), 
(61, '09:00:00', '05:00:00'), 
(62, '09:00:00', '05:00:00'), 
(63, '09:00:00', '05:00:00'); 
INSERT INTO menu_tb (place_idx, name, price) VALUES 
(10, '4시간 이용권', 6000);
INSERT INTO place_image_tb (place_idx, image_path) VALUES 
(10, '/place/bakery.jpg');
INSERT INTO place_image_tb (place_idx, image_path) VALUES 
(10, '/place/bakery.jpg');
INSERT INTO place_image_tb (place_idx, image_path) VALUES 
(10, '/place/moscow.jpg');
INSERT INTO place_image_tb (place_idx, image_path) VALUES 
(10, '/place/soccer_field.jpg');
INSERT INTO place_image_tb (place_idx, image_path) VALUES 
(10, '/place/hospital.jpg');
INSERT INTO place_type_mapping_tb (place_idx, place_type_idx) VALUES (10, 4);

INSERT INTO place_tb (name, tel, address, address_x, address_y) VALUES
('빵 굽는 마을', '032-888-7777', '인천 미추홀구 독배로 400', 126.656789, 37.457890);
INSERT INTO operating_day_tb (place_idx, day) VALUES
(11, 'mon'), 
(11, 'tue'), 
(11, 'wed'), 
(11, 'thu'), 
(11, 'fri'), 
(11, 'sat'); 
INSERT INTO operating_hour_tb (operating_day_idx, start_at, end_at) VALUES
(64, '08:00:00', '20:00:00'), 
(65, '08:00:00', '20:00:00'),
(66, '08:00:00', '20:00:00'),
(67, '08:00:00', '20:00:00'), 
(68, '08:00:00', '20:00:00'), 
(69, '08:00:00', '20:00:00'); 
INSERT INTO break_time_tb (operating_hour_idx, start_at, end_at) VALUES
(66, '12:00:00', '13:30:00'), 
(67, '12:00:00', '13:30:00'), 
(68, '12:00:00', '13:30:00'), 
(69, '12:00:00', '13:30:00');
INSERT INTO menu_tb (place_idx, name, price, image_path) VALUES 
(11, '소금빵', 3000, '/menu/41ee298f-7745-43cd-b81b-374a0e692fc9-candies.jpg');
INSERT INTO menu_tb (place_idx, name, price) VALUES 
(11, '앙버터', 4500);
INSERT INTO place_image_tb (place_idx, image_path) VALUES 
(11, '/place/big_volume_mountain.jpg');
INSERT INTO place_image_tb (place_idx, image_path) VALUES 
(11, '/place/big_volume_mountain.jpg');
INSERT INTO place_type_mapping_tb (place_idx, place_type_idx) VALUES (11, 2);

INSERT INTO place_tb (name, tel, address, address_x, address_y) VALUES
('맘스터치 인하대점', '032-872-9999', '인천 미추홀구 인하로77번길 20', 126.652345, 37.456789);
INSERT INTO operating_day_tb (place_idx, day) VALUES
(12, 'mon'), 
(12, 'tue'), 
(12, 'wed'), 
(12, 'thu'), 
(12, 'fri'), 
(12, 'sat'), 
(12, 'sun'); 
INSERT INTO operating_hour_tb (operating_day_idx, start_at, end_at) VALUES
(70, '10:00:00', '22:00:00'), 
(71, '10:00:00', '22:00:00'), 
(72, '10:00:00', '22:00:00'),
(73, '10:00:00', '22:00:00'), 
(74, '10:00:00', '22:00:00'), 
(75, '10:00:00', '22:00:00'), 
(76, '10:00:00', '22:00:00'); 
INSERT INTO menu_tb (place_idx, name, price) VALUES 
(12, '싸이버거 세트', 7200);
INSERT INTO place_image_tb (place_idx, image_path) VALUES 
(12, '/place/big_volume_mountain.jpg');
INSERT INTO place_image_tb (place_idx, image_path) VALUES 
(12, '/place/hospital.jpg');
INSERT INTO place_image_tb (place_idx, image_path) VALUES 
(12, '/place/moscow.jpg');
INSERT INTO place_image_tb (place_idx, image_path) VALUES 
(12, '/place/soccer_field.jpg');
INSERT INTO place_type_mapping_tb (place_idx, place_type_idx) VALUES (12, 2);


INSERT INTO review_tb (user_idx, place_idx, content) VALUES
(1, 1, '역시 스타벅스! 원두향이 좋아요'),
(1, 2, '칼국수 엄청 맛있어요'),
(2, 1, '비싸지만 맛있어요'),
(1, 3, '피자 너무 맛있어요! 친구들이랑 또 올 거예요.'),
(2, 3, '스파게티도 최고! 배달도 빠르고 좋아요.'),
(1, 3, '아이들이 좋아해서 자주 옵니다. 친절해요.'),
(2, 3, '가격은 좀 있지만 맛있어서 용서됩니다.'),
(1, 3, '카페 분위기가 너무 좋아요. 공부하기 딱이에요.'),
(2, 3, '커피도 맛있고 디저트도 좋아요.'),
(1, 3, '만두가 정말 맛있어요! 육즙이 가득해요.'),
(2, 3, '김치만두가 매콤하고 맛있어요. 자주 올 것 같아요.'),
(1, 3, '김치찌개가 진짜 맛있네요. 집밥 같아요!'),
(2, 3, '된장찌개도 맛있고 가격도 착해요.'),
(1, 3, '만두가 정말 맛있네요. 재방문 의사 있습니다.'),
(1, 3, '김치찌개가 정말 집밥 같아요. 맛있어요.'),
(2, 3, '혼밥하기 딱 좋은 곳입니다.'),
(1, 4, '딸기빙수 진짜 맛있어요! 여름에 딱이에요.'),
(2, 4, '케이크도 맛있고 분위기도 좋아요.'),
(1, 5, '가츠동이 정말 맛있어요. 양도 많고 만족합니다.'),
(2, 5, '사케동도 맛있고 가격도 괜찮아요.'),
(1, 6, '치킨이 바삭하고 맥주랑 잘 어울려요.'),
(2, 6, '분위기가 좋아서 친구들이랑 자주 와요.'),
(1, 7, '빙수 양도 많고 케이크도 맛있어요!'),
(2, 7, '분위기가 좋아서 데이트하기 좋아요.'),
(1, 8, '가츠동 양이 많고 바삭해요.'),
(2, 8, '점심시간에 가면 사람이 많아요. 그만큼 맛집!'),
(1, 9, '치킨이 진짜 맛있네요. 맥주랑 찰떡궁합.'),
(2, 10, '조용해서 공부하기 좋아요. 콘센트도 많아요.'),
(1, 11, '갓 나온 소금빵 최고에요!'),
(2, 12, '역시 믿고 먹는 싸이버거입니다.');

INSERT INTO review_image_tb (review_idx, image_path) VALUES
(2, '/review/13072567-38f9-4941-9fb1-5eddb316f38d-bakery.jpg'),
(2, '/review/38b902bb-38bb-41c6-b216-b9536a76088f-buns.jpg'),
(3, '/review/4fbfbef0-b188-4816-820e-609e838ee5da-puppy.jpg'),
(3, '/review/d32bdb09-7c3c-4b78-8a39-740cb34e3a16-school.jpg'),
(3, '/review/5525b1a6-85ea-4359-ad0d-ac54ed77ad54-cupcakes.jpg'),
(3, '/review/38b902bb-38bb-41c6-b216-b9536a76088f-buns.jpg'),
(3, '/review/13072567-38f9-4941-9fb1-5eddb316f38d-bakery.jpg'),
(4, '/review/5525b1a6-85ea-4359-ad0d-ac54ed77ad54-cupcakes.jpg'),
(4, '/review/b670f3ab-1512-49fa-9494-1e845570d300-cat.jpg'),
(8, '/review/d32bdb09-7c3c-4b78-8a39-740cb34e3a16-school.jpg'),
(9, '/review/13072567-38f9-4941-9fb1-5eddb316f38d-bakery.jpg'),
(11, '/review/4fbfbef0-b188-4816-820e-609e838ee5da-puppy.jpg'),
(12, '/review/38b902bb-38bb-41c6-b216-b9536a76088f-buns.jpg'),
(13, '/review/13072567-38f9-4941-9fb1-5eddb316f38d-bakery.jpg'),
(13, '/review/5525b1a6-85ea-4359-ad0d-ac54ed77ad54-cupcakes.jpg'),
(14, '/review/5525b1a6-85ea-4359-ad0d-ac54ed77ad54-cupcakes.jpg'),
(15, '/review/b670f3ab-1512-49fa-9494-1e845570d300-cat.jpg'),
(16, '/review/4fbfbef0-b188-4816-820e-609e838ee5da-puppy.jpg'),
(17, '/review/d32bdb09-7c3c-4b78-8a39-740cb34e3a16-school.jpg'),
(18, '/review/5525b1a6-85ea-4359-ad0d-ac54ed77ad54-cupcakes.jpg');


INSERT INTO review_keyword_mapping_tb (review_idx, keyword_idx) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(2, 2),
(2, 4),
(3, 1),
(3, 3),
(4, 1), 
(5, 2), 
(6, 3),
(6, 4), 
(7, 4),
(7, 5),
(8, 1),
(8, 2),
(8, 4),
(9, 1), 
(10, 2), 
(10, 3),
(10, 4),
(10, 5),
(11, 1), 
(12, 3),
(12, 5),
(12, 8),
(12, 9),  
(15, 4),
(15, 6),
(15, 7),
(15, 9), 
(16, 2), 
(17, 1), 
(18, 3),
(18, 4),
(19, 2), 
(20, 3),
(20, 5),
(20, 7),
(20, 9),
(21, 4), 
(22, 1), 
(23, 2), 
(23, 6),
(23, 8),
(24, 3), 
(25, 4), 
(25, 8),
(25, 9),
(26, 1), 
(27, 2), 
(28, 3), 
(29, 4);

INSERT INTO bookmark_tb (user_idx, place_idx) VALUES 
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(1, 11),
(1, 12),
(2, 1),
(2, 2),
(2, 5),
(2, 6),
(2, 7);

UPDATE place_tb SET review_count = (SELECT COUNT(*) FROM review_tb WHERE place_idx = place_tb.idx);

INSERT INTO picked_place_tb (place_idx, title, content) VALUES
(2, '깔끔한 분위기', '후문 가까이에 위치해 있어 밥약하기 좋아요');
INSERT INTO picked_place_tb (place_idx, title, content) VALUES
(3, '특별한 맛을 원한다면', '맛있는 피자');
INSERT INTO picked_place_tb (place_idx, title, content) VALUES
(7, '디저트가 맛있는 곳', '식사 후 디저트까지 완벽한 선택이에요');
INSERT INTO picked_place_tb (place_idx, title, content) VALUES
(8, '혼밥하기 좋은 식당', '자리 간격도 넓고 눈치 안 보고 먹을 수 있어요');
INSERT INTO picked_place_tb (place_idx, title, content) VALUES
(9, '단체 모임에 좋아요', '넓은 자리와 예약 시스템이 잘 되어 있어요');
INSERT INTO picked_place_tb (place_idx, title, content) VALUES
(10, '인생 라멘집', '국물 맛이 진하고 면발도 탱탱해요');
INSERT INTO picked_place_tb (place_idx, title, content) VALUES
(11, '데이트 장소로 추천', '감성적인 인테리어와 음악이 분위기를 살려줘요');
INSERT INTO picked_place_tb (place_idx, title, content) VALUES
(12, '양 많고 맛있어요', '푸짐하게 나와서 배부르게 먹었어요');

INSERT INTO place_keyword_count_tb (place_idx, keyword_idx, count) VALUES
(1, 1, 2),
(1, 2, 1),
(1, 3, 2),
(1, 4, 1),
(1, 5, 1),
(2, 2, 1),
(2, 4, 1),
(3, 1, 4),
(3, 2, 3),
(3, 3, 3),
(3, 4, 5),
(3, 5, 3),
(3, 6, 1),
(3, 7, 1),
(3, 8, 1),
(3, 9, 2),
(4, 1, 1),
(4, 2, 1),
(4, 3, 1),
(4, 4, 1),
(5, 2, 1),
(5, 3, 1),
(5, 5, 1),
(5, 7, 1),
(5, 9, 1),
(6, 1, 1),
(6, 4, 1),
(7, 2, 1),
(7, 3, 1),
(7, 6, 1),
(7, 8, 1),
(8, 1, 1),
(8, 4, 1),
(8, 8, 1),
(9, 2, 1),
(10, 3, 1),
(11, 4, 1);
