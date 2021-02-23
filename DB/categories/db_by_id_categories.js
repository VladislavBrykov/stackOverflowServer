function db_by_id_categories(id) {
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

            const sqll = `SELECT category FROM categories WHERE id = ?`;
            console.log(sqll);

            connection.query(sqll, id, function(err, results) {
                if(err) console.log(err);
                console.log(results)

                    let a = results
                    console.log(a);

                    resolve(a);
            });
        });
}

module.exports = {
    db_by_id_categories: db_by_id_categories
}