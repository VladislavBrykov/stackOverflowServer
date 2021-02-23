function db_new_pass_token(pass_token, id) {
    const mysql = require("mysql2");

    const connection = mysql.createConnection({
        host: "localhost",
        user: "Vladislav5",
        database: "project",
        password: "Vladislav5"
    });

    return new Promise((resolve, reject) => {
        // const create_db = "CREATE DATABASE IF NOT EXISTS project";
        // connection.query(create_db, function(err, results) {
        //     if(err) console.log(err);
        //     console.log(results);
        // });
        
        const db = "USE project";
        connection.query(db, function(err, results) {
            if(err) console.log(err);
            console.log(results);
        });

        //const db_categories = "CREATE TABLE tokens (id INT(100) NOT NULL, reg_token CHAR(254) NOT NULL, jwt_token CHAR(254), pass_token CHAR(254), used CHAR(10) DEFAULT \"false\");"

        // connection.query(db_categories, function(err, results) {
        //     if(err) console.log(err);
        //     console.log(results);
        // });

		console.log(id + "id !!!!!");
		console.log(pass_token + "pass Token");
            connection.query('UPDATE tokens SET pass_token = ? WHERE id = ?', [pass_token, id]); 
            
           
                    let a;

                    a = {
                        server_status: "true"
                    }
                    console.log(a);

                    resolve(a);
                // } else {
                //     resolve(false);
                // }
           // });
 
    });
}

module.exports = {
    db_new_pass_token: db_new_pass_token
}