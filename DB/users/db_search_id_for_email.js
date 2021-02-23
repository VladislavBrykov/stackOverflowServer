function db_search_id_for_email(email) {
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


            const sqll = `SELECT id FROM users WHERE email = ?`;
            console.log(sqll);
            connection.query(sqll, email, function(err, results) {
                if(err) 
                    resolve(false);

                if (results) {
                    console.log(results);
                    let a = results[0]
                    console.log(a.id);

                    a = {
                        id: a.id
                    }
                    console.log(a);

                    resolve(a);
                } else {
                    resolve(false);
                }
            
            });

    });
}

module.exports = {
    db_search_id_for_email: db_search_id_for_email
}