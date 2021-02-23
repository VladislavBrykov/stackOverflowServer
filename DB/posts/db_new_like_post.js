function db_new_like(post_id, id_user, comment_id, type_role, token) {
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


        const sqll = `SELECT id FROM tokens WHERE jwt_token = ?`;
        connection.query(sqll, token, function(err, results) {
            if(!results[0]) {
                console.log("err");
                resolve (false);
            }
            else {

        const db_posts = "CREATE TABLE IF NOT EXISTS likes (id INT(10) unsigned NOT NULL AUTO_INCREMENT, publish_date DATETIME NOT NULL, post_id INT DEFAULT -1, comment_id INT DEFAULT -1, type_role varchar(100) NOT NULL, id_user INT(10) NOT NULL, PRIMARY KEY (id));"
        connection.query(db_posts, function(err, results) {
            if(err) console.log(err);
            console.log(results);
        });

        let str = [id_user, post_id]
        const sqll = `SELECT id FROM likes WHERE id_user = ? AND post_id = ?`;
        connection.query(sqll, str, function(err, results) {
            if(results[0]) {
                console.log("err");
                resolve (false);
            }
            
            else if (!results[0]) {


        
        let publish_date = new Date();
            console.log(type_role);
            let user = [publish_date, id_user, post_id, comment_id, type_role];
            const sqll = `INSERT INTO likes (publish_date, id_user, post_id, comment_id, type_role) VALUES(?, ?, ?, ?, ?)`;
            connection.query(sqll, user, function(err, results) {
                if(err) console.log(err);
                console.log(results)

                if (results) {
                    let a;
                  

                    a = {
                        server_status: "true"
                    }
                    console.log(a);

                    
           

                    resolve(a);
                } else {
                    resolve(false);
                }
            });
            }
        });
    }
    });
    
    });
}

module.exports = {
    db_new_like: db_new_like
}