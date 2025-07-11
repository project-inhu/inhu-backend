\i /docker-entrypoint-initdb.d/sql/01-create-user.sql

\c inhu inhu_admin;

\i /docker-entrypoint-initdb.d/sql/02-ddl.sql

\i /docker-entrypoint-initdb.d/sql/03-default-seed.sql