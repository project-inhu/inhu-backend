
CREATE TABLE bookmark
(
  idx        int                      NOT NULL,
  user_idx   int                      NOT NULL,
  place_idx  int                      NOT NULL GENERATED ALWAYS AS IDENTITY UNIQUE,
  created_at timestamp with time zone NOT NULL,
  deleted_at timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE keyword
(
  idx        int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  content    varchar                  NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL,
  deleted_at timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE place
(
  idx        int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  name       varchar                  NOT NULL,
  tel        varchar                  NOT NULL,
  address    varchar                  NOT NULL,
  address_x  numeric                  NOT NULL,
  address_y  numeric                  NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now,
  deleted_at timestamp with time zone,
  closed_at  timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE place_hours
(
  idx       int     NOT NULL GENERATED ALWAYS AS IDENTITY,
  place_idx int     NOT NULL,
  day       varchar NOT NULL,
  start     time   ,
  end       time   ,
  PRIMARY KEY (idx)
);

CREATE TABLE place_image
(
  idx        int NOT NULL,
  place_idx  int NOT NULL,
  image_path    ,
  PRIMARY KEY (idx)
);

CREATE TABLE place_menu
(
  idx         int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  place_idx   int                      NOT NULL,
  name        varchar                  NOT NULL,
  content     varchar                 ,
  price       int                     ,
  image_path  varchar                 ,
  is_flexible boolean                  NOT NULL,
  created_at  timestamp with time zone NOT NULL,
  deleted_at  timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE place_type
(
  idx        int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  content    varchar                  NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL,
  deleted_at timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE place_type_mapping
(
  place_type_idx int NOT NULL,
  place_idx      int NOT NULL,
  PRIMARY KEY (place_type_idx, place_idx)
);

CREATE TABLE review
(
  idx        int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  user_idx   int                      NOT NULL,
  place_idx  int                      NOT NULL,
  content    varchar                  NOT NULL,
  created_at timestamp with time zone NOT NULL,
  deleted_at timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE review_image
(
  idx        int     NOT NULL GENERATED ALWAYS AS IDENTITY,
  review_idx int     NOT NULL,
  image_path varchar NOT NULL,
  PRIMARY KEY (idx)
);

CREATE TABLE review_keyword_mapping
(
  review_idx  int NOT NULL,
  keyword_idx int NOT NULL,
  PRIMARY KEY (review_idx, keyword_idx)
);

CREATE TABLE service1
(
  idx     int     NOT NULL GENERATED ALWAYS AS IDENTITY,
  content varchar,
  PRIMARY KEY (idx)
);

CREATE TABLE service1_result
(
  idx          int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  user_idx     int                      NOT NULL,
  service1_idx int                      NOT NULL,
  content      varchar                 ,
  created_at   timestamp with time zone NOT NULL,
  PRIMARY KEY (idx)
);

CREATE TABLE service2
(
  idx     int     NOT NULL GENERATED ALWAYS AS IDENTITY,
  content varchar,
  PRIMARY KEY (idx)
);

CREATE TABLE service2_result
(
  idx          int                      NOT NULL,
  user_idx     int                      NOT NULL,
  service2_idx int                      NOT NULL,
  content      varchar                 ,
  created_at   timestamp with time zone NOT NULL,
  PRIMARY KEY (idx)
);

CREATE TABLE user
(
  idx                int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  nickname           varchar                  NOT NULL UNIQUE,
  profile_image_path varchar                  NOT NULL,
  created_at         timestamp with time zone NOT NULL,
  deleted_at         timestamp with time zone,
  provider           smallint                ,
  sns_id             varchar                 ,
  PRIMARY KEY (idx)
);

CREATE TABLE withdraw_service
(
  idx     int     NOT NULL GENERATED ALWAYS AS IDENTITY,
  content varchar,
  PRIMARY KEY (idx)
);

CREATE TABLE withdraw_service_result
(
  idx                  int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  user_idx             int                      NOT NULL,
  withdraw_service_idx int                      NOT NULL,
  created_at           timestamp with time zone NOT NULL,
  PRIMARY KEY (idx)
);

ALTER TABLE review_image
  ADD CONSTRAINT FK_review_TO_review_image
    FOREIGN KEY (review_idx)
    REFERENCES review (idx);

ALTER TABLE review_keyword_mapping
  ADD CONSTRAINT FK_review_TO_review_keyword_mapping
    FOREIGN KEY (review_idx)
    REFERENCES review (idx);

ALTER TABLE review_keyword_mapping
  ADD CONSTRAINT FK_keyword_TO_review_keyword_mapping
    FOREIGN KEY (keyword_idx)
    REFERENCES keyword (idx);

ALTER TABLE review
  ADD CONSTRAINT FK_user_TO_review
    FOREIGN KEY (user_idx)
    REFERENCES user (idx);

ALTER TABLE bookmark
  ADD CONSTRAINT FK_user_TO_bookmark
    FOREIGN KEY (user_idx)
    REFERENCES user (idx);

ALTER TABLE bookmark
  ADD CONSTRAINT FK_place_TO_bookmark
    FOREIGN KEY (place_idx)
    REFERENCES place (idx);

ALTER TABLE review
  ADD CONSTRAINT FK_place_TO_review
    FOREIGN KEY (place_idx)
    REFERENCES place (idx);

ALTER TABLE place_type_mapping
  ADD CONSTRAINT FK_place_type_TO_place_type_mapping
    FOREIGN KEY (place_type_idx)
    REFERENCES place_type (idx);

ALTER TABLE place_type_mapping
  ADD CONSTRAINT FK_place_TO_place_type_mapping
    FOREIGN KEY (place_idx)
    REFERENCES place (idx);

ALTER TABLE place_image
  ADD CONSTRAINT FK_place_TO_place_image
    FOREIGN KEY (place_idx)
    REFERENCES place (idx);

ALTER TABLE place_menu
  ADD CONSTRAINT FK_place_TO_place_menu
    FOREIGN KEY (place_idx)
    REFERENCES place (idx);

ALTER TABLE service1_result
  ADD CONSTRAINT FK_user_TO_service1_result
    FOREIGN KEY (user_idx)
    REFERENCES user (idx);

ALTER TABLE service1_result
  ADD CONSTRAINT FK_service1_TO_service1_result
    FOREIGN KEY (service1_idx)
    REFERENCES service1 (idx);

ALTER TABLE service2_result
  ADD CONSTRAINT FK_user_TO_service2_result
    FOREIGN KEY (user_idx)
    REFERENCES user (idx);

ALTER TABLE service2_result
  ADD CONSTRAINT FK_service2_TO_service2_result
    FOREIGN KEY (service2_idx)
    REFERENCES service2 (idx);

ALTER TABLE withdraw_service_result
  ADD CONSTRAINT FK_user_TO_withdraw_service_result
    FOREIGN KEY (user_idx)
    REFERENCES user (idx);

ALTER TABLE withdraw_service_result
  ADD CONSTRAINT FK_withdraw_service_TO_withdraw_service_result
    FOREIGN KEY (withdraw_service_idx)
    REFERENCES withdraw_service (idx);

ALTER TABLE place_hours
  ADD CONSTRAINT FK_place_TO_place_hours
    FOREIGN KEY (place_idx)
    REFERENCES place (idx);
