function db_new_comment(post_id, id_user, comment, token) {
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


        const sqll = `SELECT id FROM tokens WHERE jwt_token = ?`;
        connection.query(sqll, token, function(err, results) {
            if(!results[0]) {
                console.log("err");
                resolve (false);
            }
            else {

            let status = "off";
            let user = [post_id, id_user, comment, status];
            const sqll = `INSERT INTO comments(id_post, id_user, comment, status) VALUES(?, ?, ?, ?)`;
            
            connection.query(sqll, user, function(err, results) {
                if(err) console.log(err);
                console.log(results)

                if (results) {
                    const sqlll = `SELECT id FROM comments WHERE id_post = ? AND id_user = ? AND comment = ? AND status = ?`;
                    connection.query(sqlll, user, function(err, results) {
                        if(err) {
                            console.log("err");
                            resolve (false);
                        }
                        
                        
                    let a;
                  

                    a = {
                        results,
                        server_status: "true"
                    }
                    console.log(a);

                    
           

                    resolve(a);
                });
                }
            });
        }
        });
        });
}

module.exports = {
    db_new_comment: db_new_comment
}