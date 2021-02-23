function db_update_post(id, post_id, title, body, content, categories, status, token) {

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
                console.log("errr");
                resolve (false);
            }
            else {

            results =results[0];
            results= results.id;
            let a = results;

            const sqll = `SELECT role_user FROM role_user WHERE id_user = ?`;
            connection.query(sqll, results, function(err, results) {
                results = results[0];
                results = results.role_user;
               console.log(results + " results");
            if((a == id) || (results == 'admin')) {
                //console.log(results);
                //console.log(id);
                
        connection.query('UPDATE posts SET title = ? WHERE id = ?', [title, post_id]);
        connection.query('UPDATE posts SET content = ? WHERE id = ?', [content, post_id]);
        connection.query('UPDATE posts SET status= ? WHERE id = ?', [status, post_id]);
            
             const sqll = `SELECT id FROM categories WHERE category = ?`;
             connection.query(sqll, categories, function(err, results) {
                 if(err) console.log(err);
                 console.log(results);
                 let id_categories = results[0];
                 console.log(id_categories.id);
            
             connection.query('UPDATE posts SET id_categiries = ? WHERE id = ?', [id_categories.id, post_id]);
                
                let a = {
                    update: "true"
                }
                resolve(a);
             });
            }
        
            else
            resolve(false)
        });
            }
        
        
        });
    });
}

module.exports = {
    db_update_post: db_update_post
}
