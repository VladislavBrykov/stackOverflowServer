//function db_avatar(id, avatar, token) {
    function db_avatar(avatar, token, id) {
        console.log(token + "token +++");
        console.log(avatar + "avatar +++");
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


        const sqll = `SELECT id FROM tokens WHERE jwt_token = ?`;
        connection.query(sqll, token, function(err, results) {
            if(!results[0]) {
                console.log("err");
                resolve (false);
            }
            else {
                let id = results[0];
                id = id.id;


        const sqll = `SELECT avatar FROM avatar WHERE id = ?`;
        users = [id];
        connection.query(sqll, users, function(err, results) {
             if(!results[0]) {
                let users = [id, avatar];
                const sql = `INSERT INTO avatar(id, avatar) VALUES(?, ?)`;
        
                connection.query(sql, users, function(err, results) {
                    if(err) console.log(err);
                    let a = {
                        status: "new avatar"
                    }
                    resolve(a);
                });
             }

            else {
                connection.query('UPDATE avatar SET avatar = ? WHERE id = ?', [avatar, id]);
    
                let a = {
                    status: "update"
                }
                resolve(a);
            }
        });

    }
    });


    });
}

module.exports = {
    db_avatar: db_avatar
}