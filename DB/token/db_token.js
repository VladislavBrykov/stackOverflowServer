function db_token(id) {
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

        // const db_posts = "CREATE TABLE IF NOT EXISTS posts (id int(10) unsigned NOT NULL AUTO_INCREMENT, title varchar(700) NOT NULL, content TEXT(7000) NOT NULL, id_categiries int(10) NOT NULL, id_user int(10) NOT NULL, status varchar(15) NOT NULL, PRIMARY KEY (id));"
        // connection.query(db_posts, function(err, results) {
        //     if(err) console.log(err);
        //     console.log(results);
        // });

        const sqll = `SELECT jwt_token FROM tokens WHERE id = ?`;
        connection.query(sqll, id, function(err, results) {
            if(!results[0]) {
                console.log("err");
                resolve (false);
            }
            console.log(results + "results");
            let res = results[0];
            res = res.jwt_token;
            resolve(res);
        });
    });
}

module.exports = {
    db_token: db_token
}