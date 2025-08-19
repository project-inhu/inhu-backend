CREATE USER inhu_admin WITH PASSWORD '1234';

CREATE DATABASE inhu OWNER inhu_admin;

\c inhu inhu_admin;

\i /rdb/ddl.sql

\i /rdb/default-seed.sql
