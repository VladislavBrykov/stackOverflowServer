function db_all_categories_post(post_id) {
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

        const sqll = `SELECT id_categiries FROM posts WHERE id = ?`;
        connection.query(sqll, post_id, function(err, results) {
            if(!results[0]) 
                resolve(false);
            else {
            let k = results[0];
            console.log(k.id_categiries);


            const db_categories = "CREATE TABLE IF NOT EXISTS categories (id int(10) unsigned NOT NULL AUTO_INCREMENT, category varchar(100) NOT NULL, PRIMARY KEY (id));"
            connection.query(db_categories, function(err, results) {
                if(err) console.log(err);
                console.log(results);
            });

            const sqll = `SELECT category FROM categories WHERE id = ?`;
            connection.query(sqll, k.id_categiries, function(err, results) {
                if(!results[0])
                    resolve(false);
                else {
            let res = results[0];
                resolve(res);
                }
            
            });
        }
        });
    });
}

module.exports = {
    db_all_categories_post: db_all_categories_post
}