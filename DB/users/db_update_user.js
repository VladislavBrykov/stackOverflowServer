const router = require("../../ModelViev/todo");

function db_update_user(id, email, login, password, token) {
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

        const sqlll = `SELECT id FROM tokens WHERE jwt_token = ?`;
        connection.query(sqlll, token, function(err, results) {
           if(!results[0]) {
               console.log("errr");
               resolve (false);
           }
        
            else {
               results =results[0];
               results= results.id;
               let a = results;

                const sqll = `SELECT role_user FROM role_user WHERE id_user = ?`;
                connection.query(sqll, results, function(err, results) {
                    results = results[0];
                    results = results.role_user;
                    console.log(results + " results");
        
                        if((results == 'admin') || (results == id)) {
                            
                                
                                   connection.query('UPDATE users SET email = ? WHERE id = ?', [email, id]);
                               
                            
                            
                            
                   
                               connection.query('UPDATE users SET login = ? WHERE id = ?', [login, id]);
                          
                        
                             
                            
                                connection.query('UPDATE users SET password = ? WHERE id = ?', [password, id]);
                        resolve(true)
                     } 
                     resolve(false)    
           });  
          }              
       });
    });
}

module.exports = {
    db_update_user: db_update_user
}