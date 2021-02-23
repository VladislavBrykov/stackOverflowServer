CREATE TABLE tokens (
                        id INT(100) NOT NULL,
                        reg_token CHAR(254) NOT NULL,
                        jwt_token CHAR(254),
                        used CHAR(10) DEFAULT "false"
);