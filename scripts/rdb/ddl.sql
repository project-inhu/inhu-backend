CREATE TABLE bookmark_tb
(
  user_idx   int                      NOT NULL,
  place_idx  int                      NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_idx, place_idx)
);

CREATE TABLE break_time_tb
(
  idx       int      NOT NULL GENERATED ALWAYS AS IDENTITY,
  place_idx int      NOT NULL,
  start_at  time(6)  NOT NULL,
  end_at    time(6)  NOT NULL,
  day       smallint NOT NULL,
  PRIMARY KEY (idx)
);

CREATE TABLE closed_day_tb
(
  idx       int      NOT NULL GENERATED ALWAYS AS IDENTITY,
  place_idx int      NOT NULL,
  day       smallint NOT NULL,
  week      smallint NOT NULL,
  PRIMARY KEY (idx)
);

CREATE TABLE keyword_tb
(
  idx        int                      NOT NULL,
  content    varchar                  NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE menu_tb
(
  idx         int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  place_idx   int                      NOT NULL,
  name        varchar                  NOT NULL,
  content     varchar                 ,
  price       int                     ,
  image_path  varchar                 ,
  is_flexible boolean                  NOT NULL DEFAULT false,
  sort_order  smallint                 NOT NULL,
  created_at  timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at  timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE operating_hour_tb
(
  idx       int      NOT NULL GENERATED ALWAYS AS IDENTITY,
  place_idx int      NOT NULL,
  start_at  time(6)  NOT NULL,
  end_at    time(6)  NOT NULL,
  day       smallint NOT NULL,
  PRIMARY KEY (idx)
);

CREATE TABLE picked_place_tb
(
  idx        int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  place_idx  int                      NOT NULL UNIQUE,
  title      varchar                  NOT NULL,
  content    varchar                  NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE place_image_tb
(
  idx        int     NOT NULL GENERATED ALWAYS AS IDENTITY,
  place_idx  int     NOT NULL,
  image_path varchar NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE place_keyword_count_tb
(
  place_idx   int NOT NULL,
  keyword_idx int NOT NULL,
  count       int NOT NULL DEFAULT 0,
  PRIMARY KEY (place_idx, keyword_idx)
);

CREATE TABLE place_tb
(
  idx                   int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  name                  varchar                  NOT NULL,
  tel                   varchar                  ,
  review_count          int                      NOT NULL DEFAULT 0,
  bookmark_count        int                      NOT NULL DEFAULT 0,
  road_address_idx      int                      NOT NULL,
  is_closed_on_holiday  boolean                  ,
  created_at            timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at            timestamp with time zone,
  permanently_closed_at timestamp with time zone,
  activated_at          timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE place_type_mapping_tb
(
  place_type_idx int NOT NULL,
  place_idx      int NOT NULL,
  PRIMARY KEY (place_type_idx, place_idx)
);

CREATE TABLE place_type_tb
(
  idx        int                      NOT NULL,
  content    varchar                  NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE review_image_tb
(
  idx        int     NOT NULL GENERATED ALWAYS AS IDENTITY,
  review_idx int     NOT NULL,
  image_path varchar NOT NULL,
  PRIMARY KEY (idx)
);

CREATE TABLE review_keyword_mapping_tb
(
  review_idx  int NOT NULL,
  keyword_idx int NOT NULL,
  PRIMARY KEY (review_idx, keyword_idx)
);

CREATE TABLE review_tb
(
  idx        int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  user_idx   int                      NOT NULL,
  place_idx  int                      NOT NULL,
  content    varchar                  NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE road_address_tb
(
  idx            int     NOT NULL GENERATED ALWAYS AS IDENTITY,
  address_name   varchar NOT NULL,
  detail_address varchar,
  address_x      numeric NOT NULL,
  address_y      numeric NOT NULL,
  PRIMARY KEY (idx)
);

CREATE TABLE service1_result_tb
(
  idx          int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  user_idx     int                      NOT NULL,
  service1_idx int                      NOT NULL,
  content      varchar                 ,
  created_at   timestamp with time zone NOT NULL DEFAULT NOW(),
  PRIMARY KEY (idx)
);

CREATE TABLE service1_tb
(
  idx     int     NOT NULL GENERATED ALWAYS AS IDENTITY,
  content varchar,
  PRIMARY KEY (idx)
);

CREATE TABLE service2_result_tb
(
  idx          int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  user_idx     int                      NOT NULL,
  service2_idx int                      NOT NULL,
  content      varchar                 ,
  created_at   timestamp with time zone NOT NULL DEFAULT NOW(),
  PRIMARY KEY (idx)
);

CREATE TABLE service2_tb
(
  idx     int     NOT NULL GENERATED ALWAYS AS IDENTITY,
  content varchar,
  PRIMARY KEY (idx)
);

CREATE TABLE user_provider_tb
(
  idx    int     NOT NULL,
  name   varchar NOT NULL,
  sns_id varchar NOT NULL,
  PRIMARY KEY (idx)
);

CREATE TABLE user_tb
(
  idx                int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  nickname           varchar                  NOT NULL,
  profile_image_path varchar                 ,
  created_at         timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at         timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE admin_account_tb
(
  idx        int                      NOT NULL,
  id         varchar                  NOT NULL,
  pw         varchar                  NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  PRIMARY KEY (idx)
);

CREATE TABLE weekly_closed_day_tb
(
  idx         int      NOT NULL GENERATED ALWAYS AS IDENTITY,
  place_idx   int      NOT NULL,
  closed_date date     NOT NULL,
  type        smallint NOT NULL DEFAULT 0,
  PRIMARY KEY (idx)
);

CREATE TABLE withdraw_service_result_tb
(
  idx                  int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  user_idx             int                      NOT NULL,
  withdraw_service_idx int                      NOT NULL,
  created_at           timestamp with time zone NOT NULL DEFAULT NOW(),
  PRIMARY KEY (idx)
);

CREATE TABLE withdraw_service_tb
(
  idx     int     NOT NULL GENERATED ALWAYS AS IDENTITY,
  content varchar,
  PRIMARY KEY (idx)
);

ALTER TABLE review_image_tb
  ADD CONSTRAINT FK_review_tb_TO_review_image_tb
    FOREIGN KEY (review_idx)
    REFERENCES review_tb (idx);

ALTER TABLE review_keyword_mapping_tb
  ADD CONSTRAINT FK_review_tb_TO_review_keyword_mapping_tb
    FOREIGN KEY (review_idx)
    REFERENCES review_tb (idx);

ALTER TABLE review_keyword_mapping_tb
  ADD CONSTRAINT FK_keyword_tb_TO_review_keyword_mapping_tb
    FOREIGN KEY (keyword_idx)
    REFERENCES keyword_tb (idx);

ALTER TABLE review_tb
  ADD CONSTRAINT FK_user_tb_TO_review_tb
    FOREIGN KEY (user_idx)
    REFERENCES user_tb (idx);

ALTER TABLE bookmark_tb
  ADD CONSTRAINT FK_user_tb_TO_bookmark_tb
    FOREIGN KEY (user_idx)
    REFERENCES user_tb (idx);

ALTER TABLE place_type_mapping_tb
  ADD CONSTRAINT FK_place_type_tb_TO_place_type_mapping_tb
    FOREIGN KEY (place_type_idx)
    REFERENCES place_type_tb (idx);

ALTER TABLE service1_result_tb
  ADD CONSTRAINT FK_user_tb_TO_service1_result_tb
    FOREIGN KEY (user_idx)
    REFERENCES user_tb (idx);

ALTER TABLE service1_result_tb
  ADD CONSTRAINT FK_service1_tb_TO_service1_result_tb
    FOREIGN KEY (service1_idx)
    REFERENCES service1_tb (idx);

ALTER TABLE service2_result_tb
  ADD CONSTRAINT FK_user_tb_TO_service2_result_tb
    FOREIGN KEY (user_idx)
    REFERENCES user_tb (idx);

ALTER TABLE service2_result_tb
  ADD CONSTRAINT FK_service2_tb_TO_service2_result_tb
    FOREIGN KEY (service2_idx)
    REFERENCES service2_tb (idx);

ALTER TABLE withdraw_service_result_tb
  ADD CONSTRAINT FK_user_tb_TO_withdraw_service_result_tb
    FOREIGN KEY (user_idx)
    REFERENCES user_tb (idx);

ALTER TABLE withdraw_service_result_tb
  ADD CONSTRAINT FK_withdraw_service_tb_TO_withdraw_service_result_tb
    FOREIGN KEY (withdraw_service_idx)
    REFERENCES withdraw_service_tb (idx);

ALTER TABLE user_provider_tb
  ADD CONSTRAINT FK_user_tb_TO_user_provider_tb
    FOREIGN KEY (idx)
    REFERENCES user_tb (idx);

ALTER TABLE bookmark_tb
  ADD CONSTRAINT FK_place_tb_TO_bookmark_tb
    FOREIGN KEY (place_idx)
    REFERENCES place_tb (idx);

ALTER TABLE review_tb
  ADD CONSTRAINT FK_place_tb_TO_review_tb
    FOREIGN KEY (place_idx)
    REFERENCES place_tb (idx);

ALTER TABLE place_type_mapping_tb
  ADD CONSTRAINT FK_place_tb_TO_place_type_mapping_tb
    FOREIGN KEY (place_idx)
    REFERENCES place_tb (idx);

ALTER TABLE place_image_tb
  ADD CONSTRAINT FK_place_tb_TO_place_image_tb
    FOREIGN KEY (place_idx)
    REFERENCES place_tb (idx);

ALTER TABLE menu_tb
  ADD CONSTRAINT FK_place_tb_TO_menu_tb
    FOREIGN KEY (place_idx)
    REFERENCES place_tb (idx);

ALTER TABLE closed_day_tb
  ADD CONSTRAINT FK_place_tb_TO_closed_day_tb
    FOREIGN KEY (place_idx)
    REFERENCES place_tb (idx);

ALTER TABLE picked_place_tb
  ADD CONSTRAINT FK_place_tb_TO_picked_place_tb
    FOREIGN KEY (place_idx)
    REFERENCES place_tb (idx);

ALTER TABLE operating_hour_tb
  ADD CONSTRAINT FK_place_tb_TO_operating_hour_tb
    FOREIGN KEY (place_idx)
    REFERENCES place_tb (idx);

ALTER TABLE break_time_tb
  ADD CONSTRAINT FK_place_tb_TO_break_time_tb
    FOREIGN KEY (place_idx)
    REFERENCES place_tb (idx);

ALTER TABLE weekly_closed_day_tb
  ADD CONSTRAINT FK_place_tb_TO_weekly_closed_day_tb
    FOREIGN KEY (place_idx)
    REFERENCES place_tb (idx);

ALTER TABLE place_keyword_count_tb
  ADD CONSTRAINT FK_place_tb_TO_place_keyword_count_tb
    FOREIGN KEY (place_idx)
    REFERENCES place_tb (idx);

ALTER TABLE place_keyword_count_tb
  ADD CONSTRAINT FK_keyword_tb_TO_place_keyword_count_tb
    FOREIGN KEY (keyword_idx)
    REFERENCES keyword_tb (idx);

ALTER TABLE place_tb
  ADD CONSTRAINT FK_road_address_tb_TO_place_tb
    FOREIGN KEY (road_address_idx)
    REFERENCES road_address_tb (idx);

ALTER TABLE admin_account_tb
  ADD CONSTRAINT FK_user_tb_TO_admin_tb
    FOREIGN KEY (idx)
    REFERENCES user_tb (idx);
