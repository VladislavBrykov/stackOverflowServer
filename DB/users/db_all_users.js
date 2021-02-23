function db_all_users() {
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

            const sqll = `SELECT id, login FROM users`;
            console.log(sqll);

            connection.query(sqll, function(err, results) {
                if(err) console.log(err);
                console.log(results)

                    let a = results
                    console.log(a);


                    const sqll = `SELECT * FROM avatar`;
                    console.log(sqll);
        
                    connection.query(sqll, function(err, results) {
                        if(err) console.log(err);
                        console.log(results)
        
                            let b = results
                            console.log(a);

                            let res = {
                                a,
                                b
                            }

                    resolve(res);
                });
            });
        });
}

module.exports = {
    db_all_users: db_all_users
}