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

let large = [{"user_id": 1, "page_views": 7, "clicks": 5},
  {"user_id": 5, "page_views": 6, "clicks": 3},
  {"user_id": 9, "page_views": 4, "clicks": 7},
  {"user_id": 1, "page_views": 3, "clicks": 5}
];

let small = [{"id": 9, "first_name": "Barnabas"},
  {"id": 1, "first_name": "Emlyn"},
  {"id": 5, "first_name": "Ervin"}
]

let result = a.map(item => {
  let { id, login } = item;
  let { avatar } = b.reduce((acc, data) => {
    if (data.id == id) {
      acc.avatar += data.avatar;
    }
    return acc;
  }, {avatar: 0, login: 0});
  return { id, login, avatar }
});

                    resolve(result);
                });
            });
        });
}

module.exports = {
    db_all_users: db_all_users
}