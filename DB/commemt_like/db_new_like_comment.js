function db_new_like_comment(id_user, comment_id, type_role, token) {
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

        const sqlll = `SELECT id FROM tokens WHERE jwt_token = ?`;
        connection.query(sqlll, token, function(err, results) {
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
               if((results == 'admin') || (results == id)) {

        //connection.query('UPDATE prof_voto_foto SET punteggio = ' + connection.escape(data.voto) + ', created = ' + connection.escape(created) + ' WHERE profilo_id = ' + connection.escape(profilo) + ' AND foto_id = ' + connection.escape(data.id_foto_votata), function(error, rows) {
            
        
            let str = [id_user, type_role, comment_id]
            const sqll = `SELECT id FROM likes WHERE id_user = ? AND type_role = ? AND comment_id = ?`;
            console.log(sqll);
            connection.query(sqll, str, function(err, results) {
                if(results[0]) {
                    console.log("err");
                    resolve (false);
                }
                
                else if (!results[0]) {


            let publish_date = new Date();
            console.log(publish_date);
            console.log(type_role);
            let post_id;
            let user = [publish_date, id_user, post_id, comment_id, type_role];
            const sqll = `INSERT INTO likes (publish_date, id_user, post_id, comment_id, type_role) VALUES(?, ?, ?, ?, ?)`;
            connection.query(sqll, user, function(err, results) {
                if(err) 
                    resolve(false)

                if (results) {
                    let a;
                  

                    a = {
                        server_status: "true"
                    }
                    console.log(a);

                    
           

                    resolve(a);
                }
                });
            }
            });
        }else 
        resolve(false)
        });
        }
        });
        });
}

module.exports = {
    db_new_like_comment: db_new_like_comment
}