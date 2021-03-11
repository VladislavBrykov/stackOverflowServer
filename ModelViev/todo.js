const {Router} = require('express');
bcrypt = require('bcrypt');
let express = require('express');
fs = require('fs');
let multer  = require('multer');
let path = require('path');
let sizeOf = require('image-size');
let upload = multer({ dest: 'upload/' });
const router = Router();
const bodyParser = require("body-parser");
const db_update_comment = require('../DB/commemt_like/db_update_comment');
const db_all_categories_post = require('../DB/commemt_like/db_all_categories_post');
const db_avatar = require('../DB/users/db_avatar');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

/*-----------Authentication module----------------*/ 
/*------------------------------------------------*/
// Регистрация
router.post('/auth/register', (req, res) => {
	let data = req.body;
	console.log(data);

	if(data.password !== data.passwordConfirmation)
		res.status(401).json('Passwords do not match');
	if(!data.login)
		res.status(400).json('Enter login');
	if(!data.email)
		res.status(400).json('Enter email');
	
	let hashPass = bcrypt.hashSync(data.password, 12)
	new Promise((resolve, reject) => {
		const result = require('../DB/log_reg/db_registration')
		if(!data.role_user)
			role_user = "admin";  //если не указана роль пользователя - по дефолту - админ

		result.db_registration(data.login, hashPass, data.email, role_user)
			.then(response => {
				if (response) {
					resolve(response);
				} else {
					reject(0)
				}
			})
	}).then(rp => {
		const reg_token = require('../Controller/new_token.js')
		let regToken = reg_token.new_token(); //получили токен регистрации
		const result_db_new_reg_token = require('../DB/token/db_new_reg_token')
		result_db_new_reg_token.db_new_reg_token(rp.id, regToken); //записали в бд новый токен регистрации
		function func() {
		const status_reg_token = require('../DB/token/status_reg_token');
		status_reg_token.status_reg_token(rp.id)
		}
		setTimeout(func, 360000) //время жизни токена 1 час, после чего токен и юзер удаляется
		const resultTokenMail = require('../Controller/reg_token_mail')
		resultTokenMail.reg_token_mail(regToken, data.email); //отправили токен на почту
		res.json({status: true, rp});
	}).catch(() => {
		res.status(403).json('login or mail is already taken');

	})
});

//токен подтверждение
router.get('/auth/register/:token', (req, res) => {
	let token = req.params.token;

	new Promise((resolve, reject) => {
		const result = require('../DB/token/giv_reg_token')
		result.giv_reg_token(token)
			.then(response => {
				if (response) {
					resolve(response);
				} else {
					reject(0)
				}
			})
	}).then(rp => {
		res.json({result: "Mail is verified, you can log in"});
	}).catch(() => {
		res.status(401).json('Token is not valid, please register again');
	})
});

//Логин
router.post('/auth/login', (req, res) => {
	let data = req.body;
	if(!data.login)
		res.status(400).json('Enter login');
	if(!data.email)
		res.status(400).json('Enter email');
	if(!data.password)
		res.status(400).json('Enter password');

	console.log(data);
	let hashPass = bcrypt.hashSync(data.password, 12)


	new Promise((resolve, reject) => {
		const result = require('../DB/log_reg/db_login')
		result.db_login(data.login, hashPass, data.email)
			.then(response => {
				if (response) {
					resolve(response);
				} else {
					reject(0)
				}
			})
	}).then(rp => {
		const jwt_token = require('../Controller/new_token.js')
		let jwtToken = jwt_token.new_token(); //получили токен регистрации
		const result_db_new_jwt_token = require('../DB/token/db_new_jwt_token')
		result_db_new_jwt_token.db_new_jwt_token(rp.id, jwtToken); //записали в бд новый токен jwt
		function func() {
			const status_online = require('../DB/log_reg/db_logout');
			status_online.db_logout(rp.id)
			}
		 	setTimeout(func, 8640000) //время жизни токена 24 часf, после чего узера вылогинивает
		res.json({status: true, rp, jwtToken: jwtToken});
	}).catch(() => {
		res.status(401).json('user not found, check your input');
	})
});

// log out authorized user
router.post('/auth/logout', (req, res) => {
	let data = req.headers;
	console.log(data.authorization);

	new Promise((resolve, reject) => {
		const result = require('../DB/log_reg/db_logout')
		result.db_logout(data.authorization)
			.then(response => {
				if (response) {
					resolve(response);
				} else {
					reject(0)
				}
			})
	}).then(rp => {
		res.json({status: true, rp});
	}).catch(() => {
		res.status(403).json('error logout');

	})
});


// восстановление пароля запрос на почту
router.post('/auth/password-reset', (req, res) => {
	let data = req.body;
	console.log(data);
	

	new Promise((resolve, reject) => {
		const result = require('../DB/users/db_search_id_for_email')
		result.db_search_id_for_email(data.email)
			.then(response => {
				if (response) {
					resolve(response);
				} else {
					reject(0)
				}
			})
	}).then(rp => {
		const pass_token = require('../Controller/new_token.js')
		let passToken = pass_token.new_token(); //получили токен для восстановления пароля
		const result_db_new_pass_token = require('../DB/token/db_new_pass_token')
		result_db_new_pass_token.db_new_pass_token(passToken, rp.id); //записали в бд новый токен pass
		
		
		const result = require('../Controller/pass_reset')
	 	result.pass_reset(passToken, data.email);
		res.json({status: true});
	}).catch(() => {
		res.status(500).json('server error');

	})
});


//восстановление пароля с кодом (на мейл)
router.post('/auth/password-reset/:confirm_token', (req, res) => {
	let data = req.body;
	let email_password = data.token;

	new Promise((resolve, reject) => {
		const result = require('../DB/log_reg/db_pass_reset')
		result.db_pass_reset(data.password, email_password)
			.then(response => {
				if (response) {
					resolve(response);
				} else {
					reject(0)
				}
			})
	}).then(rp => {
		res.json({status: true, rp});
	}).catch(() => {
		res.status(403).json('token is not valid');
	})
});

//добавить avatar
router.post('/users/avatar', upload.single('image'), (req, res) => {
	let data = req.body;
	let token = req.headers.authorization
	let mimetype = req.file.mimetype;
	let size = req.file.size;
	mimetype = mimetype

	if(req.file.size > 70000)
		res.status(403).json('size image very big');

	let avatar = req.file.filename + ".jpg";
	let adres = avatar;
	multer({dest:"uploads"}).single("filedata")
	
	fs.rename('upload/' + req.file.filename, 'upload/' + req.file.filename + '.jpg', (err) => {
		if (err) throw err;
		console.log('renamed complete');
	  });

	if((mimetype == 'image/jpeg') || (mimetype == 'image/png'))

	new Promise((resolve, reject) => {
		const result = require('../DB/users/db_avatar')
		result.db_avatar(adres, token, data.id)
			.then(response => {
				if (response) {
					resolve(response);
				} else {
					reject(0)
				}
			})
	}).then(rp => {
		res.json({status: true, rp});
	}).catch(() => {
		res.status(500).json('server error');
	})
	else
	res.status(403).json('use format image jpg or png');
});

// /*------------------------------------------------*/


// /*-----------------User module--------------------*/ 
// /*------------------------------------------------*/

// //получить всех пользователей права: для всех пользователей admin/user/guest
router.get('/users', (rec, res) => {
		new Promise((resolve, reject) => {
			const result = require('../DB/users/db_all_users')
			result.db_all_users()
				.then(response => {
					if (response) {
						resolve(response);
					} else {
						reject(0)
					}
				})
		}).then(rp => {
			res.json({status: true, rp});
		}).catch(() => {
			res.json({status: false})
		})
});

//получить пользователя по его айди для всех пользователей admin/user/guest
router.get('/users/:user_id', (req, res) => {
	let user_id = req.params.user_id;

	new Promise((resolve, reject) => {
		const result = require('../DB/users/db_id_user')
		result.db_id_user(user_id)
			.then(response => {
				if (response) {
					resolve(response);
				} else {
					reject(0)
				}
			})
	}).then(rp => {
		res.json({status: true, rp});
	}).catch(() => {
		res.json({status: false, error: "user exists"})
	})
});

// от имени админа создать пользователя ++++
router.post('/users', (req, res) => {
	let data = req.body;
	let token = req.headers.authorization
	console.log(data);

	if(data.role != "admin") {
		res.json({
			status: false,
			err: "role != admin"
		})
	}

	if(data.password != data.password_confirmation) {
		res.json({
			status: false,
			err: "incorrect password"
		})
	}

	new Promise((resolve, reject) => {
		const result = require('../DB/log_reg/db_registration_by_admin')
		result.db_registration_by_admin(data.login, data.password, data.email, data.role_user, token, data.id)
			.then(response => {
				if (response) {
					resolve(response);
				} else {
					reject(0)
				}
			})
	}).then(rp => {
		const reg_token = require('../Controller/new_token.js')
		let regToken = reg_token.new_token(); //получили токен регистрации
		const result_db_new_reg_token = require('../DB/token/db_new_reg_token')
		console.log(rp + "11111");
		console.log(regToken + "2222");
		result_db_new_reg_token.db_new_reg_token(rp, regToken); //записали в бд новый токен регистрации
		function func() {
		const status_reg_token = require('../DB/token/status_reg_token');
		status_reg_token.status_reg_token(rp.id)
		}
		setTimeout(func, 360000) //время жизни токена 1 час, после чего токен и юзер удаляется
		const resultTokenMail = require('../Controller/reg_token_mail')
		resultTokenMail.reg_token_mail(regToken, data.email); //отправили токен на почту
		res.json({status: true, rp});
	}).catch(() => {
		res.json({status: false, err: "check your input"})
		res.status(401).json('check your input');

	})
});

//аватар подгружает только авторизированный пользователь _______________
// { 
// 	"id": "63",
// "avatar" : "http/sdfdsggerg"
// }
router.post('/users/avatar', (req, res) => {
	let data = req.body;
	console.log(data);

	new Promise((resolve, reject) => {
		const result = require('../DB/users/db_avatar')
		result.db_avatar(data.id, data.avatar)

		res.json({status: true});
	})
});


//изменить данные пользователя
router.patch('/users/:user_id', (req, res) => {
	let user_id = req.params.user_id;
	let token = req.headers.authorization
	let data = req.body;
	console.log(data);

	new Promise((resolve, reject) => {
		const result = require('../DB/users/db_update_user')
		result.db_update_user(user_id, data.email, data.login, data.password, token)
			.then(response => {
				if (response) {
					resolve(response);
				} else {
					reject(0)
				}
			})
	}).then(rp => {
		res.json({status: true, rp});
	}).catch(() => {
		res.status(403).json('Check your input, me by login or pasworl used');

	})
});


//удалить пользователя
router.delete('/users/:user_id', (req, res) => {
	let user_id = req.params.user_id;
	let token = req.headers.authorization
	let data = req.body;

	new Promise((resolve, reject) => {
		const result = require('../DB/token/right_det_user')
		result.right(token, user_id)
			.then(response => {
				if (response) {
					resolve(response);
				} else {
					reject(0)
				}
			})
	}).then(rp => {
		const result = require('../DB/users/db_delete_user')
		let del = result.db_delete_user(user_id)
		res.json({status: true});
	}).catch(() => {
		res.status(403).json('not root');

	})
});

// /*------------------------------------------------*/


// /*-----------------Post module--------------------*/ 
// /*------------------------------------------------*/

// //получить все посты
router.get('/posts', (req, res) => {
	new Promise((resolve, reject) => {
		const result = require('../DB/posts/db_all_posts')
		result.db_all_posts()
			.then(response => {
				if (response) {
					resolve(response);
				} else {
					reject(0)
				}
			})
	}).then(rp => {
	 	res.json({status: true, rp});
	 }).catch(() => {
		res.json({status: false})
	})
});

//получить конкретный пост
router.get('/posts/:post_id', (req, res) => {
	let post_id = req.params.post_id;

	new Promise((resolve, reject) => {
		const result = require('../DB/posts/db_one_post')
		result.db_one_post(post_id)
			.then(response => {
				if (response) {
					resolve(response);
				} else {
					reject(0)
				}
			})
	}).then(rp => {
	 	res.json({status: true, rp});
	 }).catch(() => {
		//res.json({status: false, error: "post does not exist"})
		res.status(401).json({status: false, error: "post does not exist"})
	})
});

//получить комментарии к посту с айди
router.get('/posts/:post_id/comments', (req, res) => {
	let post_id = req.params.post_id;
	new Promise((resolve, reject) => {
		const result = require('../DB/commemt_like/db_all_comments')
		result.db_all_comments(post_id)
			.then(response => {
				if (response) {
					resolve(response);
				} else {
					reject(0)
				}
			})
	}).then(rp => {
	 	res.json({status: true, rp});
	 }).catch(() => {
		res.status(500).json('oh noes!');
	})
});

//добавить комментарий к посту
router.post('/posts/:post_id/comments', (req, res) => {
	let data = req.body;
	let token = req.headers.authorization
	console.log(data);
	let post_id = req.params.post_id;
	new Promise((resolve, reject) => {
		const result = require('../DB/commemt_like/db_new_comment')
		result.db_new_comment(post_id, data.id_user, data.comment, token)
			.then(response => {
				if (response) {
					resolve(response);
				} else {
					reject(0)
				}
			})
	}).then(rp => {
		res.json({status: true, rp});
	}).catch(() => {
		res.status(500).json('oh noes!');
	})
});

//получить категории связанные с постом по айди поста
router.post('/posts/:post_id/categories', (req, res) => {
	let post_id = req.params.post_id;
	new Promise((resolve, reject) => {
		const result = require('../DB/commemt_like/db_all_categories_post')
		result.db_all_categories_post(post_id)
			.then(response => {
				if (response) {
					resolve(response);
				} else {
					reject(0)
				}
			})
	}).then(rp => {
	 	res.json({status: true, rp});
	 }).catch(() => {
		res.status(404).json('post not exists!');
	})
});

//получить все лайки к посту по айди поста
router.get('/posts/:post_id/like', (req, res) => {
	let post_id = req.params.post_id;
	new Promise((resolve, reject) => {
		const result = require('../DB/commemt_like/db_all_likes_post')
		result.db_all_likes(post_id)
			.then(response => {
				if (response) {
					resolve(response);
				} else {
					reject(0)
				}
			})
	}).then(rp => {
	 	res.json({status: true, rp});
	 }).catch(() => {
		res.status(404).json('post not exists!');
	})
});


//добавить новый пост
router.post('/posts', (req, res) => {
	let data = req.body;
	let token = req.headers.authorization
	console.log(data);
	console.log(token);

	if(!token)  //для неавторизированного посетителя
	res.status(403).json('login or registration');

	else {
	new Promise((resolve, reject) => {
		const result = require('../DB/posts/db_new_post')
		result.db_new_post(data.title, data.content, data.categories, data.user, token)
			.then(response => {
				if (response) {
					resolve(response);
				} else {
					reject(0)
				}
			})
	}).then(rp => {
		res.json({status: true, rp});
	}).catch(() => {
		res.status(404).json('oh noes!');
	})
	}
});


//поставить лайк под постом
router.post('/posts/:post_id/like', (req, res) => {
	let data = req.body;
	let token = req.headers.authorization
	console.log(data);

if(!token)
	res.json({status: false, error: "error: you need to register"})
else {

	let post_id = req.params.post_id;
	new Promise((resolve, reject) => {
		const result = require('../DB/posts/db_new_like_post')
		result.db_new_like(post_id, data.id, data.comment_id, data.type_role, token)
			.then(response => {
				if (response) {
					resolve(response);
				} else {
					reject(0)
				}
			})
	}).then(rp => {
		res.json({status: true, rp});
	}).catch(() => {
		res.status(500).json('like exists');

	})
	}
});

//изменить данные поста +++++++ от админа тоже проверено
router.patch('/posts/:post_id', (req, res) => {
	let post_id = req.params.post_id;
	let token = req.headers.authorization
	let data = req.body;
	console.log(data);

	if(!token)
		res.status(403).json('error: you need to register');

	else {

	new Promise((resolve, reject) => {
		const result = require('../DB/posts/db_update_post')
		result.db_update_post(data.id, post_id, data.title, data.body, data.content, data.category, data.status, token)
			.then(response => {
				if (response) {
					resolve(response);
				} else {
					reject(0)
				}
			})
	}).then(rp => {
		res.json({status: true, rp});
	}).catch(() => {
		res.status(500).json('oh noes!');

	})
	}	
});


//удалить пост
router.delete('/posts/:post_id', (req, res) => {
	let post_id = req.params.post_id;
	let token = req.headers.authorization
	let data = req.body;

	new Promise((resolve, reject) => {
		const result = require('../DB/posts/db_delete_post')
		result.db_delete_post(post_id, token)
			.then(response => {
				if (response) {
					resolve(response);
				} else {
					reject(0)
				}
			})
	}).then(rp => {
		res.json({status: true});
	}).catch(() => {
		res.status(500).json('oh noes!');

	})
});

//удалить лайк под постом/комментарием
router.delete('/posts/:post_id/like', (req, res) => {
	let post_comment_id = req.params.post_id;
	let token = req.headers.authorization
	let data = req.body;

	new Promise((resolve, reject) => {
		const result = require('../DB/posts/db_delete_like')
		result.db_delete_like(post_comment_id, data.type, token, data.id_user)
			.then(response => {
				if (response) {
					resolve(response);
				} else {
					reject(0)
				}
			})
	}).then(rp => {
		res.json({status: true});
	}).catch(() => {
		res.status(500).json('like dont exists');

	})
});

// /*------------------------------------------------*/


// /*---------------Categories module----------------*/ показал
// /*------------------------------------------------*/


//получить скатегорию по айди
router.get('/categories/:category_id', function(req, res) {
	let category_id = req.params.category_id;

	new Promise((resolve, reject) => {
		const result = require('../DB/categories/db_by_id_categories')
		result.db_by_id_categories(category_id)
			.then(response => {
				if (response) {
					resolve(response);
				} else {
					reject(0)
				}
			})
	}).then(rp => {
			if(!rp[0])
				res.status(404).json('I dont have that');
		res.json({status: true, rp});
	}).catch(() => {
		res.status(500).json('oh noes!');
	})
});


//получить список всех категорий
router.get('/categories', function(req, res) {
	new Promise((resolve, reject) => {
		const result = require('../DB/categories/db_all_categories')
		result.db_all_categories()
			.then(response => {
				if (response) {
					resolve(response);
				} else {
					reject(0)
				}
			})
	}).then(rp => {
		res.set('Access-Control-Allow-Origin', '*')
		res.json({status: true, rp});
	}).catch(() => {
		res.status(500).json('oh noes!');
	})
});

//получить все посты по айди категории
router.get('/categories/:category_id/posts', (req, res) => {
	let category_id = req.params.category_id;

	new Promise((resolve, reject) => {
		const result = require('../DB/posts/db_all_post_for_idCategory')
		result.db_all_post_for_idCategory(category_id)
			.then(response => {
				if (response) {
					resolve(response);
				} else {
					reject(0)
				}
			})
	}).then(rp => {
		res.json({status: true, rp});
	}).catch(() => {
		res.status(404).json('I dont have that posts');

	})
});

//добавить новую категорию
router.post('/categories', (req, res) => {
	let data = req.body;
	let token = req.headers.authorization
	console.log(data);
	new Promise((resolve, reject) => {
		const result = require('../DB/categories/db_new_categories')
		result.db_new_categories(data.category, token)
			.then(response => {
				if (response) {
					resolve(response);
				} else {
					reject(0)
				}
			})
	}).then(rp => {
		res.json({status: true, rp});
	}).catch(() => {
		res.status(404).json('not enough rights');

	})
});



//изменить данные категории
router.patch('/categories/:category_id', (req, res) => {
	let category_id = req.params.category_id;
	let token = req.headers.authorization
	let data = req.body;
	console.log(data);
	new Promise((resolve, reject) => {
		const result = require('../DB/categories/db_update_category')
		result.db_update_category(data.category, category_id, token)
			.then(response => {
				if (response) {
					resolve(response);
				} else {
					reject(0)
				}
			})
	}).then(rp => {
		res.json({status: true, rp});
	}).catch(() => {
		res.json({status: false,  error: "not enough rights"})
	})
});

//удалить категорию по айди
router.delete('/categories/:category_id', (req, res) => {
	let category_id = req.params.category_id;
	let token = req.headers.authorization
	let data = req.body;
	new Promise((resolve, reject) => {
		const result = require('../DB/categories/db_delete_category')
		result.db_delete_category(category_id, token)
			.then(response => {
				if (response) {
					resolve(response);
				} else {
					reject(0)
				}
			})
	}).then(rp => {
		res.json({status: true, rp});
	}).catch(() => {
		res.json({status: false, error: "category not exists"})
	})
});

// /*------------------------------------------------*/


// /*----------------Comments module-----------------*/ 
// /*------------------------------------------------*/

//получить данные комментария по его айди
router.get('/comments/:comment_id', (req, res) => {
	let comment_id = req.params.comment_id;
	new Promise((resolve, reject) => {
		const result = require('../DB/commemt_like/db_comment_by_id')
		result.db_comment_by_id(comment_id)
			.then(response => {
				if (response) {
					resolve(response);
				} else {
					reject(0)
				}
			})
	}).then(rp => {
		res.json({status: true, rp});
	}).catch(() => {
		res.status(404).json('Error, comment dont exists');
	})
});


//получить все лайки под комментарием по его айди
router.get('/comments/:comment_id/like', (req, res) => {
	let comment_id = req.params.comment_id;
	new Promise((resolve, reject) => {
		const result = require('../DB/commemt_like/db_all_likes_comment')
		result.db_all_likes_comment(comment_id)
			.then(response => {
				if (response) {
					resolve(response);
				} else {
					reject(0)
				}
			})
	}).then(rp => {
		if(!rp[0])
		res.status(500).json('likes not exists');


	 	res.json({status: true, rp});
	 }).catch(() => {
		res.status(500).json('comments not exists');

	})
});

//Поставить лайк под комментарием
router.post('/comments/:comment_id/like', (req, res) => {
	let comment_id = req.params.comment_id;
	let token = req.headers.authorization
	let data = req.body;
	console.log(data);
	let post_id = req.params.post_id;
	new Promise((resolve, reject) => {
		const result = require('../DB/commemt_like/db_new_like_comment')
		result.db_new_like_comment(data.id_user, comment_id, data.type_role, token)
			.then(response => {
				if (response) {
					resolve(response);
				} else {
					reject(0)
				}
			})
	}).then(rp => {
		res.json({status: true, rp});
	}).catch(() => {
		res.status(500).json('like exists');

	})
	//
});

//изменить данные комментария
router.patch('/comments/:comment_id', (req, res) => {
	let comment_id = req.params.comment_id;
	let token = req.headers.authorization
	let data = req.body;
	console.log(data);
	new Promise((resolve, reject) => {
		const result = require('../DB/commemt_like/db_update_comment')
		result.db_update_comment(data.status, comment_id, token)
			.then(response => {
				if (response) {
					resolve(response);
				} else {
					reject(0)
				}
			})
	}).then(rp => {
		res.json({status: true, rp});
	}).catch(() => {
		res.status(500).json('oh noes!');
	})
});


//удалить комментарий по его айди
router.delete('/comments/:comment_id', (req, res) => {
	let comment_id = req.params.comment_id;
	let token = req.headers.authorization
	let data = req.body;
	new Promise((resolve, reject) => {
		const result = require('../DB/commemt_like/db_delete_comment')
		result.db_delete_comment(comment_id, token)
			.then(response => {
				if (response) {
					resolve(response);
				} else {
					reject(0)
				}
			})
	}).then(rp => {
		res.json({status: true, rp});
	}).catch(() => {
		res.json({status: false})
	})
});

//удалить лайк под комментарием
router.delete('/comments/:comment_id/like', (req, res) => {
	let comment_id = req.params.comment_id;
	let token = req.headers.authorization
	let data = req.body;
	new Promise((resolve, reject) => {
		const result = require('../DB/posts/db_delete_like')
		let type_role = "comment";
		result.db_delete_like(comment_id, type_role, token, data.id)
			.then(response => {
				if (response) {
					resolve(response);
				} else {
					reject(0)
				}
			})
	}).then(rp => {
		res.json({status: true, rp});
	}).catch(() => {
		res.status(404).json('oh noes!');
	})
});

module.exports = router