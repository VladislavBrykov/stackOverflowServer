function db_delete_post(id, token) {
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
                

                connection.query('DELETE FROM likes WHERE post_id = ?', [id]);
                connection.query('DELETE FROM comments WHERE id_post = ?', [id]);
                connection.query('DELETE FROM posts WHERE id = ?', [id]);
                
                let a = {
                    update: "true"
                }
                resolve(a);
            }
            resolve(false)
        });
        }
        });
    });
}

module.exports = {
    db_delete_post: db_delete_post
}

