CREATE USER inhu_admin WITH PASSWORD '1234';

CREATE DATABASE inhu OWNER inhu_admin;

\c inhu inhu_admin;

\i /rdb/ddl.sql

\i /rdb/default-seed.sql

INSERT INTO user_tb (nickname) VALUES ('nickname1');

INSERT INTO admin_account_tb (idx, id, pw) VALUES (1, '1234', '$2b$10$l.EPjNQZOAdfiLqk5Lp8sujej5a7MTVCV7KL1z9wykrAZz04uSLLG');