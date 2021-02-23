function db_all_likes(post_id) {
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


        const db_likes = "CREATE TABLE IF NOT EXISTS likes (id INT(10) unsigned NOT NULL AUTO_INCREMENT, publish_date DATETIME NOT NULL, post_id INT DEFAULT -1, comment_id INT DEFAULT -1, type_role varchar(100) NOT NULL, id_user INT(10) NOT NULL, PRIMARY KEY (id));"
        connection.query(db_likes, function(err, results) {
            if(err) console.log(err);
            console.log(results);
        });

            const sqll = `SELECT * FROM likes WHERE post_id = ?`;
            connection.query(sqll, post_id, function(err, results) {
                if(!results[0])
                    resolve(false);
                let k = results;
                console.log(k);
                resolve(k);
            });
        });
}

module.exports = {
    db_all_likes: db_all_likes
}