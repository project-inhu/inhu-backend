CREATE USER inhu_admin WITH PASSWORD '1234';

CREATE DATABASE inhu OWNER inhu_admin;

\c inhu inhu_admin

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
