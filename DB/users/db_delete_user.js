function db_delete_user(id) {
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



       

            connection.query('DELETE FROM users WHERE id = ?', [id]);
            connection.query('DELETE FROM online WHERE id_user = ?', [id]);
            connection.query('DELETE FROM avatar WHERE id= ?', [id]);
            connection.query('DELETE FROM role_user WHERE id_user = ?', [id]);
            connection.query('DELETE FROM tokens WHERE id = ?', [id]);
               let a = {
                   update: "true",
               }

                console.log(a);
                resolve(true);
    });

}

module.exports = {
    db_delete_user: db_delete_user
}