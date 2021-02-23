function db_pass_reset(password, token) {
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



        const sqll = `SELECT id FROM tokens WHERE pass_token = ?`;
        connection.query(sqll, token, function(err, results) {
            if(!results[0]) {
                console.log("err");
                resolve (false);
            }
            else {
            console.log(results);
            let id = results[0]
            id = id.id
           
    
        connection.query('UPDATE users SET password = ? WHERE id = ?', [password, id]);
                
                let a = {
                    new_password: "true"
                }
                resolve(a);
            }
            resolve(false);
        });
            
    });
}

module.exports = {
    db_pass_reset: db_pass_reset
}