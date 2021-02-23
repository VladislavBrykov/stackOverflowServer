function db_new_post(title, content, category, user_id, token) {
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

        const db_categories = "CREATE TABLE IF NOT EXISTS categories (id int(10) unsigned NOT NULL AUTO_INCREMENT, category varchar(100) NOT NULL, PRIMARY KEY (id));"
        connection.query(db_categories, function(err, results) {
            if(err) console.log(err);
            console.log(results);
        });

        const sql = `SELECT id FROM categories WHERE category = ?`;
        let rs = false;

        connection.query(sql, category, function(err, results) {
            if(err) 
                resolve(false)
            console.log(results);
            results = results[0];
            console.log(results);
            results= results.id;

            const db_posts = "CREATE TABLE IF NOT EXISTS posts (id int(10) unsigned NOT NULL AUTO_INCREMENT, title varchar(700) NOT NULL, content TEXT(7000) NOT NULL, id_categiries int(10) NOT NULL, id_user int(10) NOT NULL, status varchar(15) NOT NULL, PRIMARY KEY (id));"
            connection.query(db_posts, function(err, results) {
                if(err) console.log(err);
                console.log(results);
            });

            let status = "off";
            let user = [title, content, results, user_id, status];
            const sqll = `INSERT INTO posts(title, content, id_categiries, id_user, status) VALUES(?, ?, ?, ?, ?)`;
            
            connection.query(sqll, user, function(err, results) {
                if(err) console.log(err);
                console.log(results)

                if (results) {
                    const sqlll = `SELECT id FROM posts WHERE title = ? AND content = ? AND id_categiries = ? AND id_user = ? AND status = ?`;
                    connection.query(sqlll, user, function(err, results) {
                    let a;
                        results = results[0];
                        results = results.id
                    a = {
                        id: results,
                        server_status: "true"
                    }
                    console.log(a);

                    resolve(a);
                });
                
                } else {
                    resolve(false);
                }
                
            });
        });
    }
    });
    });
}

module.exports = {
    db_new_post: db_new_post
}
