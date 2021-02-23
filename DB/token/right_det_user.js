function right(token, id) {
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


        const sqll = `SELECT login FROM users WHERE id = ?`;
        connection.query(sqll, id, function(err, results) {
            if(!results[0]) {
                console.log("err");
                resolve (false);
            }
            else {


        const sqll = `SELECT id FROM tokens WHERE jwt_token = ?`;
        connection.query(sqll, token, function(err, results) {
            if(!results[0]) {
                console.log("err");
                resolve (false);
            }
            else {
            console.log(results);
            let res = results[0]
            res = res.id;
            console.log(res);

            if (res == id)
                resolve(true)

                else {

                const sqlll = `SELECT role_user FROM role_user WHERE id_user = ?`;
                connection.query(sqlll, res, function(err, results) {
                    if(!results[0]) {
                        console.log("err 1");
                        resolve (false);
                    }
                    
                    let ress = results[0]
                    ress = ress.role_user;
                    console.log(ress + "1");
                if(ress == 'admin') {
                    console.log("true");
                     resolve(true);
                }
                 else 
                         resolve(false);
                     
                });
            }
        }
    
        });
            }
        });
        
    });
}

module.exports = {
    right: right
}