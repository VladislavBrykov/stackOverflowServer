function db_id_user(id) {
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


            const sqll = `SELECT login, email FROM users WHERE id = ?`;
            console.log(sqll);

            users = [id];
            connection.query(sqll, users, function(err, results) {
                if(err) console.log(err);
                console.log(results)

                if (results.length > 0) {
                    let a = results[0]

                    const sqllll = `SELECT avatar FROM avatar WHERE id = ?`;
                    users = [id];
                    connection.query(sqllll, users, function(err, results) {
                        let avatar = results[0];
                        avatar = avatar.avatar

                   
                    console.log(a.login);

                    a = {
                        login: a.login,
                        email: a.email,
                        avatar
                        
                    }
                    console.log(a);

                    resolve(a);
                });
                } else {
                    resolve(false);
                }
            });
        });
}

module.exports = {
    db_id_user: db_id_user
}