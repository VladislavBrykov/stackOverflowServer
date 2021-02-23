function db_all_posts() {
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


        const db_posts = "CREATE TABLE IF NOT EXISTS posts (id int(10) unsigned NOT NULL AUTO_INCREMENT, title varchar(700) NOT NULL, content TEXT(7000) NOT NULL, id_categiries int(10) NOT NULL, id_user int(10) NOT NULL, status varchar(15) NOT NULL, PRIMARY KEY (id));"
        connection.query(db_posts, function(err, results) {
            if(err) console.log(err);
            console.log(results);
        });

        const sqll = `SELECT * FROM posts`;
            //const sqll = `SELECT login FROM users`;
            //console.log(sqll);

            connection.query(sqll, function(err, results) {
                if(err) console.log(err);
               // console.log(results[0])
                    let k = results;
                   // let r = `MAX(id)`;
                 console.log(k);
                
                

                    resolve(k);
            });
        });
}

module.exports = {
    db_all_posts: db_all_posts
}