function status_reg_token(id) {
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

 
    
        const sqll = `SELECT used FROM tokens WHERE id = ?`;
        connection.query(sqll, id, function(err, results) {
            if(err) 
                resolve(false);
                else {
            results = results[0];
            results = results.used;
            console.log(results + "!!!!!!!!!!!!!!!")
            console.log(id + "!!!!!!!!!!!");
                if(results == "false") {
                    connection.query('DELETE FROM tokens WHERE id = ?', [id]);
                    connection.query('DELETE FROM users WHERE id = ?', [id]);
                    connection.query('DELETE FROM online WHERE id_user = ?', [id]);
                    console.log("delete from users and tokens");
                 }
            
                // else if(results == "true") {
                //     connection.query('DELETE FROM tokens WHERE id = ?', [id]);
                //     console.log("delete true");
                // }
                }
});
        
            

 
    });
}

module.exports = {
    status_reg_token: status_reg_token
}