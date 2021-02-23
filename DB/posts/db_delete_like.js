function db_delete_like(post_comment_id, type_role, token, id) {
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
            if(!results) {
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
                if(a == id) {



         if(type_role == "post") {

            let type_role = "like";
            const send = [post_comment_id, type_role];
             const sqll = `SELECT id FROM likes WHERE post_id = ? AND type_role = ?`;
     
             connection.query(sqll, send, function(err, results) {
                 if(!results[0]) {
                     console.log("err");
                     resolve (false);
                 }
                 else if (results[0]) {
                 let res = results[0];
                 res = res.id
                 console.log(res);

                 const sqlll = `DELETE FROM likes WHERE id = ?`;
                 connection.query(sqlll, res, function(err, results) {
                    if(!results) {
                        console.log("err");
                        resolve (false);
                    }
                let a = {
                    update: "true"
                }
                resolve(a);
                
             });
            }
         
    });
}


if(type_role == "comment") {

    let type_role = "like";
    const send = [post_comment_id, type_role];
     const sqll = `SELECT id FROM likes WHERE comment_id = ? AND type_role = ?`;

     connection.query(sqll, send, function(err, results) {
         if(!results[0]) {
             console.log("err");
             resolve (false);
         }
         else if (results[0]) {
         let res = results[0];
         res = res.id
         console.log(res);

         const sqlll = `DELETE FROM likes WHERE id = ?`;
         connection.query(sqlll, res, function(err, results) {
            if(!results) {
                console.log("err");
                resolve (false);
            }
        let a = {
            update: "true"
        }
        resolve(a);
     });
    }
 
});
}

                }
                resolve(false)
            });
        }
    });

});
}

module.exports = {
    db_delete_like: db_delete_like
}