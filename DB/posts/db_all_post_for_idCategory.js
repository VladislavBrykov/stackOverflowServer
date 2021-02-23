function db_all_post_for_idCategory(id_categories) {
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

        const sqll = `SELECT * FROM posts WHERE id_categiries = ?`;
        connection.query(sqll, id_categories, function(err, results) {
            if(err) {
                console.log(err);
                resolve(false)
            }
            resolve(results[0]);
        });
    });
}

module.exports = {
    db_all_post_for_idCategory: db_all_post_for_idCategory
}