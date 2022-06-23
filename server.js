const express			= require('express');
const session			= require('express-session');
const MongoDB 			= require('./public/js/db')
const passport			= require('passport');
const localStrategy		= require('passport-local').Strategy;
const bcrypt			= require('bcrypt');
const path 				= require("path");
const app				= express();
const fs 				= require('fs');



// Middleware


var db = (() => {
	try{
		var dbo = MongoDB.db()
		app.listen(3000, () => {
			console.log('http://localhost:3000');
		});
		updateUsers(dbo)
		updateMovies(dbo)

		return dbo
	}
	catch(e){
		throw e
	}
})()
app.use(express.static('public'))
app.set('views', path.join(__dirname, 'public/html'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(session({
	secret: "verygoodsecret",
	resave: false,
	saveUninitialized: true
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Passport.js
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
	console.log("serializing the user")
	console.log("serializing user: " + user.username)
	done(null, user);
  });

passport.deserializeUser((user, done) => {
	// console.log("deserializing the user")
	// console.log("deserializing user: " + user.username)
	done(null, user);
  });


passport.use(new localStrategy(function (username, password, done) {
	console.log("initiate passport's localStrategy")
	var isDone = (async (username, password, done) => {
		try{
		const result = await MongoDB.findUserByName(username, password, done, db)
		return result
		}
		catch(e){
			done(e)
		}
	  })(username, password, done)
	return isDone
}));

function isLoggedIn(req, res, next) {
	console.log("authenticated: " + req.isAuthenticated())
	if (req.isAuthenticated()){
		console.log("User Role: " + userInfo(res).role)
		return next();
	} 
	res.render('login');
}

function isLoggedOut(req, res, next) {
	if (!req.isAuthenticated()) return next();
	res.render('adminHomePage.html');
}

async function updateMovies(db){
	try{
		const movieArr = await MongoDB.getAllMovies(db)
		let listMovies = ''
		movieArr.forEach(movie => {
		listMovies += `<li>${movie.name} - <a>${movie.Genre}</a> <input type="submit" id="orderMovieButton" onclick="loadPage(this.id)" value="Order"/></li>\n`
		});
	content = `<script src="../js/userFunctions.js"></script>
	<link rel="stylesheet" href="../css/allMovies.css">
	<h1>All Movies</h1>
	<input type="text" id="movieSearch" onkeyup="searchMovie()" placeholder="Search for Movie..">
	<ul id="myUL">
	${listMovies}
	</ul>`
	fs.writeFile(__dirname + '/public/html/allMovies.html', content, err => {
		if (err) {
			console.error(err);
		}
	});
		return movieArr
	}
	catch(e){
		throw e 
	}
  }
  async function updateUsers(db){
	try{
		const userArr = await MongoDB.getAllUsers(db)
		let listUsers = ''
		userArr.forEach(user => {
			listUsers += `<li>${user}</li>\n`
		})
	content = `<h1>All Users</h1>
	${listUsers}`
	fs.writeFile(__dirname + '/public/html/allUsers.html', content, err => {
		if (err) {
			console.error(err);
		}
	});
		return userArr
	}
	catch(e){
		throw e 
	}
  }

  async function updateOrders(db){
	try{
		const userArr = await MongoDB.getAllUsers(db)
		let listUsers = ''
		userArr.forEach(user => {
			listUsers += `<li>${user}</li>\n`
		})
	content = `<h1>All Users</h1>
	${listUsers}`
	fs.writeFile(__dirname + '/public/html/allUsers.html', content, err => {
		if (err) {
			console.error(err);
		}
	});
		return userArr
	}
	catch(e){
		throw e 
	}
  }

  var userInfo = function LoggedUserInfo(res){
	let sessionId = res.socket.parser.incoming.sessionID
	let sessionInfo = res.socket.parser.incoming.sessionStore.sessions[sessionId]
	let passportUserInfo = JSON.parse(sessionInfo).passport.user
	return passportUserInfo
  }

// ROUTES
app.get('/', isLoggedIn, (req, res) => {
	
	if(userInfo(res).role == 'admin'){
		res.render('adminHomePage.html')
	}
	else{
		res.render('userHomePage.html')
	}	
});

app.get('/login', isLoggedOut, (req, res) => {
	res.render('login');
});

app.get('/homePage',isLoggedIn, (req, res) => {
	if(userInfo(res).role == 'admin'){
		res.render('adminHomePage.html')
	}
	else{
		res.render('userHomePage.html')
	}	
});

app.get('/addUser',isLoggedIn, (req, res) => {
	if(uuserInfo(res).role == 'admin'){
		res.render('adminHomePage.html')
	}
	else{
		res.render('userHomePage.html')
	}	
});

app.get('/removeUser',isLoggedIn, (req, res) => {
	if(userInfo(res).role == 'admin'){
		res.render('adminHomePage.html')
	}
	else{
		res.render('userHomePage.html')
	}	
});

app.get('/addMovie',isLoggedIn, (req, res) => {
	if(userInfo(res).role == 'admin'){
		res.render('adminHomePage.html')
	}
	else{
		res.render('userHomePage.html')
	}	
});

app.get('/pickMovie',isLoggedIn, (req, res) => {
	if(userInfo(res).role == 'admin'){
		res.render('adminHomePage.html')
	}
	else{
		res.render('userHomePage.html')
	}	
});

app.get('/successfulLogin', isLoggedIn, (req, res) => {
	var passportUserInfo = userInfo(res)
	//console.log(passportUserInfo.movies)
	let list = ''
	passportUserInfo.movies.forEach(movie => {
		list += `<li>${movie.MovieName} - ${movie.OrderDate}</li>\n`
	});
	let content = `<h1>${passportUserInfo.username}'s Movies </h1>
	${list}`
	fs.writeFile(__dirname + '/public/html/userMovies.html', content, err => {
		if (err) {
			console.error(err);
		}
	});
	if(passportUserInfo.role == 'admin'){
		res.render('adminSuccessfulLogin.html')
	}
	else{
		res.render('userSuccessfulLogin.html')
	}	
	
});

app.post('/addUser', isLoggedIn, (req, res) => {
	(async () => {
		try{
			username = req.body.username
			password = req.body.password
			role = 'user'
			movies = []
			const createUser = await MongoDB.createUser(username, password,role, movies,db)
			updateUsers(db)
			//if user was added 'createUser' is set to true
			if(createUser){
				//ALERT
			}
		}
		catch(e){
			throw e 
		}
	  })();
});

app.post('/removeUser', isLoggedIn, (req, res) => {
	(async () => {
		try{
			username = req.body.username
			const removeUser = await MongoDB.removeUser(username, db)
			updateUsers(db)
			//if user was added 'removeUser' is set to true
			if(removeUser){
				//ALERT
			}
		}
		catch(e){
			throw e 
		}
	  })();
});

app.post('/addMovie', isLoggedIn, (req, res) => {
	(async () => {
		try{
			movie = req.body["Movie Name"]
			genre = req.body["Genre"]
			const addMovie = await MongoDB.addMovie(movie,genre, db)
			updateMovies(db)
			//if user was added 'addMovie' is set to true
			if(addMovie){
				//ALERT
			}
		}
		catch(e){
			throw e 
		}
	  })();
});

app.post('/pickMovie', isLoggedIn, (req, res) => {
	(async () => {
		try{
			let user = userInfo(res).username
			movie = req.body["Movie Name"]
			const insertMovie = await MongoDB.InsertOrder(movie, user, db)
			//if user was added 'addMovie' is set to true
			if(insertMovie){
				//ALERT
			}
		}
		catch(e){
			throw e 
		}
	})()
});


app.post('/login', passport.authenticate('local', {
	successRedirect: 'successfulLogin',
	failureRedirect: 'login?error=true',
}));

app.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

		

// const getCircularReplacer = () => {
//     const seen = new WeakSet();
//     return (key, value) => {
//       if (typeof value === 'object' && value !== null) {
//         if (seen.has(value)) {
//           return;
//         }
//         seen.add(value);
//       }
//       return value;
//     };
//   };
//   const result = JSON.stringify(req, getCircularReplacer());
//   console.log(result);