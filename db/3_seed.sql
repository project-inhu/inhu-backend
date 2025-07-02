INSERT INTO user_tb (nickname) VALUES
('맛집탐방가'),
('인덕이');

INSERT INTO place_tb (name, tel, address, address_x, address_y) VALUES
('스타벅스 인하대점', '1522-3232', '인천 미추홀구 인하로59', 126.650892, 37.452601),
('인하칼국수 인하대후문점', '032-874-4067', '인천 미추홀구 경인남길30번길 35-1 1층', 126.654536, 37.460835),

INSERT INTO place_menu_tb (place_idx, name, price) VALUES 
(1, '아메리카노', 4500), 
(1, '카페라떼', 5000);
INSERT INTO place_hours_tb (place_idx, day, start_at, end_at) VALUES 
(1, '월요일', '08:00:00', '22:00:00'),
(1, '화요일', '08:00:00', '22:00:00'),
(1, '수요일', '08:00:00', '22:00:00'),
(1, '목요일', '08:00:00', '22:00:00'),
(1, '금요일', '08:00:00', '22:00:00'),
(1, '토요일', '08:00:00', '22:00:00'),
(1, '일요일', '08:00:00', '22:00:00'),
INSERT INTO place_image_tb (place_idx, image_path) VALUES
(1, '/images/places/starbucks1.jpg');
INSERT INTO place_type_mapping_tb (place_idx, place_type_idx) VALUES 
(1, 1);

INSERT INTO place_menu_tb (place_idx, name, price) VALUES 
(2, '해물칼국수', 10000), 
(2, '들깨칼국수', 9500);
INSERT INTO place_hours_tb (place_idx, day, start_at, end_at) VALUES 
(2, '월요일', '11:00:00', '15:30:00'),
(2, '월요일', '16:30:00', '21:00:00'),
(2, '화요일', '11:00:00', '15:30:00'),
(2, '화요일', '16:30:00', '21:00:00'),
(2, '수요일', NULL, NULL),
(2, '목요일', '11:00:00', '15:30:00'),
(2, '목요일', '16:30:00', '21:00:00'),
(2, '금요일', '11:00:00', '15:30:00'),
(2, '금요일', '16:30:00', '21:00:00'),
(2, '토요일', '11:00:00', '15:30:00'),
(2, '토요일', '16:30:00', '21:00:00'),
(2, '일요일', '11:00:00', '15:30:00'),
(2, '일요일', '16:30:00', '21:00:00');
INSERT INTO place_image_tb (place_idx, image_path) VALUES 
(2, '/images/places/inhakalnoodle1.jpg');
INSERT INTO place_type_mapping_tb (place_idx, place_type_idx) VALUES 
(2, 2);

INSERT INTO review_tb (user_idx, place_idx, content) VALUES
(1, 1, '역시 스타벅스! 원두향이 좋아요'),
(1, 2, '칼국수 엄청 맛있어요');
(2, 1, '비싸지만 맛있어요');

INSERT INTO review_image_tb (review_idx, image_path, `order`) VALUES
(2, '/images/reviews/review2_image1.jpg'),
(2, '/images/reviews/review2_image2.jpg'),
(3, '/images/reviews/review3_image1.jpg');

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






