

function db_registration_by_admin(username, password, email, role_user, token, id) {
    const mysql = require("mysql2");

    const connection = mysql.createConnection({
        host: "localhost",
        user: "Vladislav5",
        database: "project",
        password: "Vladislav5"
    });

    return new Promise((resolve, reject) => {
        const create_db = "CREATE DATABASE IF NOT EXISTS project";
        connection.query(create_db, function(err, results) {
            if(err) console.log(err);
            console.log(results);
        });
        
        const db = "USE project";
        console.log(db);
        connection.query(db, function(err, results) {
            if(err) console.log(err);
            console.log(results + "db");
        });

        const db_t = "CREATE TABLE IF NOT EXISTS users (id int(10) unsigned NOT NULL AUTO_INCREMENT, login varchar(700) NOT NULL UNIQUE, password varchar(700) NOT NULL, email varchar(700) NOT NULL UNIQUE, PRIMARY KEY (id));"
        connection.query(db_t, function(err, results) {
            if(err) console.log(err);
            console.log(results + "db_t");
        });

        const sqll = `SELECT jwt_token FROM tokens WHERE id = ?`;
        console.log(sqll);
            connection.query(sqll, id, function(err, results) {
                if(err)
                    resolve(false)

                let myRes = results[0];
                myRes = myRes.jwt_token
                console.log(myRes + "mysres");

                if(token != myRes) 
                    resolve(false);

                if(token === myRes) {
                  


        let users = [username, password, email];
        const sql = `INSERT INTO users(login, password, email) VALUES(?, ?, ?)`;
        connection.query(sql, users, function(err, results) {
            if(err) {
                console.log(err);
                let error = toString(err[0]);

                error = error.sqlMessage;
                resolve (error);
            }


            const sqll = `SELECT id FROM users WHERE login = ?`;
            console.log(sqll);

            users = [username];
            connection.query(sqll, users, function(err, results) {
                if(err) 
                    resolve(false);

                if (results) {
                    let a = results[0]
                    console.log(a.id);

                    let users = [a.id, role_user];

                    const db_role_user = "CREATE TABLE IF NOT EXISTS role_user (id_user INT(10) NOT NULL, role_user varchar(100) default \"user\");"
                    connection.query(db_role_user, function(err, results) {
                        if(err) console.log(err);
                        console.log(results);
                    

                    const sql = `INSERT INTO role_user(id_user, role_user) VALUES(?, ?)`;
                        connection.query(sql, users, function(err, results) { 
                            if(err) console.log(err);

                            let idd = a.id;
                            let online = "off";
                            let id = [idd, online];

                            const db_online = "CREATE TABLE IF NOT EXISTS online (id_user INT(10) NOT NULL, role_user varchar(100) NOT NULL);"
                            connection.query(db_online, function(err, results) {
                                if(err) console.log(err);
                                console.log(results);
                            

                                const sqlll = `INSERT INTO online(id_user, role_user) VALUES(?, ?)`;
                                connection.query(sqlll, id);
                                resolve(a.id);
                            });
                            
                        });
                    });
                    
                } 
            });
        });
    }
    });
});
}

module.exports = {
    db_registration_by_admin: db_registration_by_admin
}