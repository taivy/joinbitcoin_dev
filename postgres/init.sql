
CREATE DATABASE joinbitcoin;

CREATE ROLE joinbitcoin LOGIN PASSWORD 'joinbitcoin';
GRANT CONNECT ON DATABASE joinbitcoin TO joinbitcoin;
GRANT ALL PRIVILEGES ON DATABASE joinbitcoin TO joinbitcoin;
ALTER USER joinbitcoin WITH SUPERUSER;

\connect joinbitcoin joinbitcoin;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
