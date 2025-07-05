INSERT INTO user_tb (nickname) VALUES
('맛집탐방가'),
('인덕이');

INSERT INTO place_tb (name, tel, address, address_x, address_y) VALUES
('스타벅스 인하대점', '1522-3232', '인천 미추홀구 인하로59', 126.650892, 37.452601),
('인하칼국수 인하대후문점', '032-874-4067', '인천 미추홀구 경인남길30번길 35-1 1층', 126.654536, 37.460835);

INSERT INTO place_menu_tb (place_idx, name, price) VALUES 
(1, '아메리카노', 4500), 
(1, '카페라떼', 5000);
INSERT INTO place_day_tb (place_idx, day) VALUES
(1, 'mon'),
(1, 'tue'),
(1, 'wed'),
(1, 'thu'),
(1, 'fri'),
(1, 'sat'),
(1, 'sun');
INSERT INTO place_hour_tb (place_day_idx, start_at, end_at) VALUES
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

INSERT INTO place_menu_tb (place_idx, name, price) VALUES 
(2, '해물칼국수', 10000), 
(2, '들깨칼국수', 9500);
INSERT INTO place_day_tb (place_idx, day) VALUES
(2, 'mon'),
(2, 'tue'),
(2, 'wed'),
(2, 'thu'),
(2, 'fri'),
(2, 'sat'),
(2, 'sun');

INSERT INTO place_hour_tb (place_day_idx, start_at, end_at) VALUES
(8, '08:00:00', '12:00:00'),
(8, '14:00:00', '20:00:00'),
(9, '08:00:00', '12:00:00'),
(9, '14:00:00', '20:00:00'),
(11, '08:00:00', '12:00:00'),
(11, '14:00:00', '20:00:00'),
(12, '08:00:00', '12:00:00'),
(12, '14:00:00', '20:00:00'),
(13, '08:00:00', '20:00:00'),
(14, '08:00:00', '20:00:00');

INSERT INTO place_break_time_tb (place_hour_idx, start_at, end_at) VALUES
(8, '10:00:00', '10:30:00'),
(8, '17:00:00', '17:30:00'),
(9, '10:00:00', '10:30:00'), 
(9, '17:00:00', '17:30:00'),
(11, '10:00:00', '10:30:00'), 
(11, '17:00:00', '17:30:00'),
(12, '10:00:00', '10:30:00'), 
(12, '17:00:00', '17:30:00');
INSERT INTO place_image_tb (place_idx, image_path) VALUES 
(2, 'place/7e4a0a69-60d2-4d90-a1aa-70ef8e40816d_20240706_124512.jpg');
INSERT INTO place_type_mapping_tb (place_idx, place_type_idx) VALUES 
(2, 2);

INSERT INTO review_tb (user_idx, place_idx, content) VALUES
(1, 1, '역시 스타벅스! 원두향이 좋아요'),
(1, 2, '칼국수 엄청 맛있어요'),
(2, 1, '비싸지만 맛있어요');

INSERT INTO review_image_tb (review_idx, image_path) VALUES
(2, 'review/f7c873c2-4fc6-4a8d-9b8e-85d8a51f56b3-.jpg'),
(2, 'review/b631f9d2-35d1-4b5f-a97f-52f4f41326e3_20240706_124512.jpg'),
(3, 'review/baebea0a-9110-455f-84f6-5608f8978c47_20240706_124512.jpg');

INSERT INTO review_keyword_mapping_tb (review_idx, keyword_idx) VALUES
(1, 1),
(2, 2),
(2, 4),
(3, 1),
(3, 3);


INSERT INTO bookmark_tb (user_idx, place_idx) VALUES 
(1, 1),
(2, 1),
(2, 2);

UPDATE place_tb SET review_count = (SELECT COUNT(*) FROM review_tb WHERE place_idx = 1) WHERE idx = 1;
UPDATE place_tb SET review_count = (SELECT COUNT(*) FROM review_tb WHERE place_idx = 2) WHERE idx = 2;