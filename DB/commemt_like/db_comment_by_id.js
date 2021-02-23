function db_comment_by_id(id) {
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

        const sqll = `SELECT comment FROM comments WHERE id = ?`;

        connection.query(sqll, id, function(err, results) {
            if(!results[0]) {
                resolve(false);
            }

            else {
                let k = results[0];
                k = k.comment;
                resolve(k);
                }
            });
        });
}

module.exports = {
    db_comment_by_id: db_comment_by_id
}