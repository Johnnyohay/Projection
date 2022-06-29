const express			= require('express');
const session			= require('express-session');
const MongoDB 			= require('./public/js/db')
const passport			= require('passport');
const localStrategy		= require('passport-local').Strategy;
const path 				= require("path");
const app				= express();




var db = (() => {
	try{
		var dbo = MongoDB.db()
		app.listen(3000, () => {
			console.log('http://localhost:3000');
		});
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
	done(null, user);
  });


passport.use(new localStrategy(function (username, password, done) {
	console.log("initiate passport's localStrategy")
	let isDone = (async (username, password, done) => {
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
		res.render('userSuccessfulLogin.html')
});


app.get('/userMoviesList', isLoggedIn, (req, res) => {
	var passportUserInfo = userInfo(res)
	var currentUser = passportUserInfo.username;
	(() => {
		try{
			MongoDB.getAllUserMovies(currentUser, db).then((userMoviesArr) => {
				res.send(userMoviesArr)});
		}
		catch(e){
			throw e 
		}
	})()
})



app.get('/orderList', isLoggedIn, (req, res) => {
	(() => {
		try{
			MongoDB.getAllOrders(db).then((orderArr) => {
				res.send(orderArr)});
		}
		catch(e){
			throw e 
		}
	})()
});

app.get('/movieList', isLoggedIn, (req, res) => {
	(() => {
		try{
			MongoDB.getAllMovies(db).then((movieArr) => {
				res.send(movieArr)});
		}
		catch(e){
			throw e 
		}
	})()
});

app.get('/userList', isLoggedIn, (req, res) => {
	(() => {
		try{
			MongoDB.getAllUsers(db).then((userArr) => {
				res.send(userArr)});
		}
		catch(e){
			throw e 
		}
	})()
});

app.get('/pickaMovie', isLoggedIn, (req, res) => {
	(() => {
		try{
			let user = userInfo(res).username
			movie = req.query.movie
			MongoDB.InsertOrder(movie, user, db).then((didOrder) => {
				res.send(didOrder)});
		} 
		catch(e){
			throw e 
		}
	})()
});


app.post('/addUser', isLoggedIn, (req, res) => {
	(async () => {
		try{
			username = req.body.username
			password = req.body.password
			if(req.body.role == "on"){
				role = 'admin'
			}
			else{
				role = 'user'
			}
			movies = []
			const createUser = await MongoDB.createUser(username, password,role, movies,db)
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
			image = req.body["image"]
			const addMovie = await MongoDB.addMovie(movie, genre, image, db)
			if(addMovie){
				//ALERT
			}
		}
		catch(e){
			throw e 
		}
	  })();
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