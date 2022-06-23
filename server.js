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
	console.log("deserializing the user")
	console.log("deserializing user: " + user.username)
	done(null, user);
  });


passport.use(new localStrategy(function (username, password, done) {
	console.log("initiate passport's localStrategy")
	var isDone = (async (username, password, done) => {
		try{
		const result = await MongoDB.findUserByName(username, password, done)
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
	if (req.isAuthenticated()) return next();
	res.render('login');
}

function isLoggedOut(req, res, next) {
	if (!req.isAuthenticated()) return next();
	res.render('homePage.html');
}

app.use('/userMovies', function(req, res, next){
    
    var options = {
        root: path.join(__dirname)
    };
     
    var fileName = '/public/html/userMovies.html'
    res.sendFile(fileName, options, function (err) {
        if (err) {
            next(err)
        } else {
            console.log('Sent:', fileName)
            next()
        }
    })
})

app.use('/allMovies', function(req, res, next){
    
    var options = {
        root: path.join(__dirname)
    };
     
    var fileName = '/public/html/allMovies.html'
    res.sendFile(fileName, options, function (err) {
        if (err) {
            next(err)
        } else {
            console.log('Sent:', fileName)
            next()
        }
    })
})

// ROUTES
app.get('/', isLoggedIn, (req, res) => {
	res.render('homePage.html');
});

app.get('/login', isLoggedOut, (req, res) => {
	res.render('login');
});

app.get('/about', isLoggedIn, (req, res) => {
	res.render('/index.html');
});
app.get('/successfulLogin', isLoggedIn, (req, res) => {
	let sessionId = res.socket.parser.incoming.sessionID
	let sessionInfo = res.socket.parser.incoming.sessionStore.sessions[sessionId]
	let passportUserInfo = JSON.parse(sessionInfo).passport.user
	//console.log(passportUserInfo.movies)
	let listUserMovie = ''
	passportUserInfo.movies.forEach(movie => {
		listUserMovie += `<li>${movie}</li>\n`
	});
	let content = `<h1>${passportUserInfo.username}'s Movies </h1>
	${listUserMovie}`
	fs.writeFile(__dirname + '/public/html/userMovies.html', content, err => {
		if (err) {
			console.error(err);
		}
	});

	(async () => {
		try{
			const result = await MongoDB.getAllMovies()
			let listMovies = ''
			result.forEach(movie => {
			listMovies += `<li>${movie}</li>\n`
			});
		content = `<h1>All Movies</h1>
		${listMovies}`
		fs.writeFile(__dirname + '/public/html/allMovies.html', content, err => {
			if (err) {
				console.error(err);
			}
		});
			return result
		}
		catch(e){
			throw e 
		}
	  })()

	res.render('successfulLogin.html')
//	res.render('homePage.html', JSON.stringify(passportUserInfo))
	//res.render('homePage.html')
});

app.get('/homepage',isLoggedIn, (req, res) => {
	res.render('homePage.html')
});



app.post('/login', passport.authenticate('local', {
	successRedirect: 'successfulLogin',
	failureRedirect: 'login?error=true',
}));

app.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

app.listen(3000, () => {
	console.log("http://localhost:3000 istening on port 3000");
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