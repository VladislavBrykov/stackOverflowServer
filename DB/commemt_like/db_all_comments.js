function db_all_comments(post_id) {
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

        const db_comments = "CREATE TABLE IF NOT EXISTS comments (id int(10) unsigned NOT NULL AUTO_INCREMENT, id_post int(10) NOT NULL, id_user int(10) NOT NULL, comment TEXT(7000) NOT NULL, status varchar(15) NOT NULL, PRIMARY KEY (id));"
        connection.query(db_comments, function(err, results) {
            if(err) console.log(err);
            console.log(results);
        });

        const sqll = `SELECT * FROM comments WHERE id_post = ?`;
        connection.query(sqll, post_id, function(err, results) {
            if(!results) {
                console.log("err");
                resolve (false);
            }
                let k = results;
                console.log(k);
                resolve(k);
            });
        });
}

module.exports = {
    db_all_comments: db_all_comments
}