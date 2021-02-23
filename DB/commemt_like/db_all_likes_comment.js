function db_all_likes_comment(comment_id) {
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

        const sqll = `SELECT * FROM likes WHERE comment_id = ?`;
            //const sqll = `SELECT login FROM users`;
            //console.log(sqll);

            connection.query(sqll, comment_id, function(err, results) {
                if(err) {
                    console.log(err);
                    resolve(false)
                }
               // console.log(results[0])
                    let k = results;
                   // let r = `MAX(id)`;
                 console.log(k);
                
                

                    resolve(k);
            });
        });
}

module.exports = {
    db_all_likes_comment: db_all_likes_comment
}