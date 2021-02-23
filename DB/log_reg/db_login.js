function db_login(username, password, email) {
   





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
        connection.query(db, function(err, results) {
            if(err) console.log(err);
            console.log(results);
        });

        // const db_users = "CREATE TABLE IF NOT EXISTS users (id int(10) unsigned NOT NULL AUTO_INCREMENT, login varchar(700) NOT NULL UNIQUE, password varchar(700) NOT NULL, email varchar(700) NOT NULL UNIQUE, PRIMARY KEY (id));"
        // connection.query(db_users, function(err, results) {
        //     if(err) console.log(err);
        //     console.log(results);
        // });

        let users = [username, password, email];
        const sqll = `SELECT id FROM users WHERE login = ?`;
        users = [username];
        connection.query(sqll, users, function(err, results) {
            if(err) console.log(err);
            console.log(results)

            if (results.length > 0) {
                let a = results[0]
                console.log(a.id);

//


const db_role_user = "CREATE TABLE IF NOT EXISTS role_user (id_user INT(10) NOT NULL, role_user varchar(100) NOT NULL);"
connection.query(db_role_user, function(err, results) {
    if(err) console.log(err);
    console.log(results);
});


const db_role_userr = "CREATE TABLE tokens (id INT(100) NOT NULL, reg_token CHAR(254) NOT NULL, jwt_token CHAR(254), pass_token CHAR(254), used CHAR(10) DEFAULT \"false\");"
connection.query(db_role_userr, function(err, results) {
    if(err) console.log(err);
    console.log(results);
});

const sqll = `SELECT role_user FROM role_user WHERE id_user = ?`;
        users = [a.id];
        connection.query(sqll, users, function(err, results) {
            let role = results[0];
            role = role.role_user
            console.log(role);


            const sqllll = `SELECT avatar FROM avatar WHERE id = ?`;
        users = [a.id];
        // connection.query(sqllll, users, function(err, results) {
        //     let avatar = results[0];
        //     avatar = avatar.avatar
            //console.log(avatar);


                a = {
                    id: a.id,
                    role: role,
                 //   avatar: avatar
                }
                console.log(a);

                let online = "on";
                let idd = a.id;

                const db_online = "CREATE TABLE IF NOT EXISTS online (id_user INT(10) NOT NULL, role_user varchar(100) NOT NULL);"
                connection.query(db_online, function(err, results) {
                    if(err) console.log(err);
                    console.log(results);
                });

                connection.query('UPDATE online SET role_user = ? WHERE id_user = ?', [online, idd]);

                resolve(a);
           // });
            });
                } else {
                    resolve(false);
                }
        });
    });
}

module.exports = {
    db_login: db_login
}
