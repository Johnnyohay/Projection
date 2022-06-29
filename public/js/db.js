const dotenv = require('dotenv')
dotenv.config({ path: './public/config/config.env' })
const { MONGO_DB_NAME, MONGO_URL_CON_DB } = process.env
const { MongoClient } = require('mongodb')
const client = new MongoClient(MONGO_URL_CON_DB, { useNewUrlParser: true, useUnifiedTopology: true})

//Generic function for DB connection

function getDate() {

	var now = new Date();
  
	var year = now.getFullYear();
	var month = now.getMonth() + 1;
	var date = now.getDate();
  
	return year + "-" + month + "-" + date + "T00:00:00.000+00:00";
}

var db = function connectDB (){
	console.log("Connecting to DB...")
	client.connect()
	let dbo = client.db(MONGO_DB_NAME)
		if (!dbo) {
			console.error(`DB Not Found! Failed to Connect`)
		}
		console.log("Connected Successfully to DB!")
		return dbo;
}

//Generic function for DB disconnect
async function disconnectDB (){
	
	try{
		await client.close()
		console.log("Disconnected from DB!")
	}
	catch(e){
		console.log("Error has occurred: Failed closing DB connection")
		throw e
	}
}

//----------------------------------------
//-------------- DB Actions --------------
//----------------------------------------
//Add a user to the Database
const createUser = async function (username, password,role, movies,db) {
	console.log("Trying to add a user...")
	var myobj = { username: username, password: password, role: role, movies: movies }
	try{
		const collectionUsers = db.collection("Users")

		const allUsers = collectionUsers.find();
		let exist = false
		// Execute the each command, triggers for each document
		await allUsers.forEach(function(user) {
			
			// If the user already exist then do nothing else add
			if(user.username == username && !exist) {
				console.log("User already exists ")
				exist = true
				return false
			}
		})
		// Add the user if doesn't exist
		if(!exist){
			const result = await collectionUsers.insertOne(myobj)
			console.log(`User: ${username} added`)
			return true
		}
	}
	catch(e){
		console.log('Failed to add user')
		throw e
	}
}

const removeUser = async function (username, db) {
	console.log("Trying to remove a user...")
	var myobj = { username: username }
	try{
		const collectionUsers = db.collection("Users")
		const allUsers = collectionUsers.find();
		// Execute the each command, triggers for each document
		await allUsers.forEach(function(user) {
			// If the user already exist then do nothing else add
			if(user.username == username) {
				const result = collectionUsers.deleteOne(myobj)
				console.log(`User: ${username} deleted`)
				return true
			}
		})
		return false
	}
	catch(e){
		console.log('Failed to add user')
		throw e
	}
}

const addMovie = async function (movie, genre, image, db) {
	console.log("Trying to add a movie...")
	var myobj = { name: movie, Genre: genre, image: image}
	try{
		const collectionMovies = db.collection("Movies")
		const allMovies = collectionMovies.find();
		let exist = false
		// Execute the each command, triggers for each document
		await allMovies.forEach(function(movie) {
			
			// If the user already exist then do nothing else add
			if(movie.name == movie && !exist) {
				console.log("Movie already exists ")
				exist = true
				return false
			}
		})
		// Add the user if doesn't exist
		if(!exist){
			const result = await collectionMovies.insertOne(myobj)
			console.log(`Movie: ${movie} added`)
			return true
		}
	}
	catch(e){
		console.log('Failed to add user')
		throw e
	}
}

const findUserByName = async function (username, password, done, db) {
	console.log("Trying to Find user by name...")
	try{
		const collectionUsers = db.collection("Users")
		collectionUsers.findOne({username: username}, function (err, user) {
			if (err) throw "Error"
			if (!user) {
				console.log(`Failed to Find user with the following username : ${username}`)
				return done(null, false, { message: 'Incorrect username.' })
			}
			//console.log(`Comparing input "${user.password}" and DB user "${password}" passwords `)
			if(password == user.password){
				return done(null, user)
			}
			else{
				return done(null, false, { message: 'Incorrect Password.' })
			}
		});
	}
	catch(e){
		console.log("Catched an Error")
		throw e;
	}
}

const getAllMovies = async function (db) {
	console.log("Getting All Movies...")
	try{
		const collectionMovies = db.collection("Movies")

		const allMovies = collectionMovies.find();
		let movieArr = []
		// Execute the each command, triggers for each document
		await allMovies.forEach(function(movie) {
			movieArr.push(movie)
		})
		// Add the user if doesn't exist
		return movieArr
	}
	catch(e){
		console.log('Failed to get movies')
		throw e
	}
}

const getAllUsers = async function (db) {
	console.log("Getting All Users...")
	try{
		const collectionUsers = db.collection("Users")

		const allUsers = collectionUsers.find();
		let usersArr = []
		// Execute the each command, triggers for each document
		await allUsers.forEach(function(user) {
			usersArr.push(user)
		})
		// Add the user if doesn't exist
		return usersArr
	}
	catch(e){
		console.log('Failed to get users')
		throw e
	}
}

const getAllOrders = async function (db) {
	console.log("Getting All Orders...")
	try{
		const collectionOrders = db.collection("Orders")

		const allOrders = collectionOrders.find();
		let ordersArr = []
		// Execute the each command, triggers for each document
		await allOrders.forEach(function(order) {
			ordersArr.push(order)
		})
		// Add the user if doesn't exist
		return ordersArr
	}
	catch(e){
		console.log('Failed to get Orders')
		throw e
	}
}

const getAllUserMovies = async function (user, db) {
	console.log("Getting All User Movies...")
	try{
		const collectionUserMovies = db.collection("Users")

		const currentUser = await collectionUserMovies.findOne({username: user});
		let movieList = []
		let movieVar
		currentUser.movies.forEach(movie => {
			movieVar = {"MovieName": movie.MovieName,
						"OrderDate": movie.OrderDate,
						"image": movie.image }
			movieList.push(movieVar)
		});
		const userMovies = {"username": currentUser.username,
			 					"movies": movieList
							}
		
		// Add the user if doesn't exist
		return userMovies
	}
	catch(e){
		console.log('Failed to get Orders')
		throw e
	}
}

const InsertOrder = async function (movie, user, db) {
	console.log("Inserting Order...")
	orderDate = getDate()
	myobjOrders = { MovieName: movie, OrderDate: orderDate, user: user}
	let didOrder = false
	try{
		//-------------------------Check if Movie Exists-------------------------------
		const collectionMovies = db.collection("Movies")
		const allMovies = collectionMovies.find();
		let exist = false
		let movieImage
		// Execute the each command, triggers for each document
		await allMovies.forEach(function(eachMovie) {
			
			// If the Movie already exist then do nothing else add
			if(eachMovie.name == movie) {
				console.log(`Found: ${movie}..`)
				movieImage = eachMovie.image
				exist = true
			}
			
		})
		//--------------------------------------------------------------
		if(exist){

			const collectionUsers = db.collection("Users")
			let currentUser = await collectionUsers.findOne({username: user})
			const collectionOrders = db.collection("Orders")
			let hasMovie = false
			currentUser.movies.forEach(function(myMovie){
				if(myMovie.MovieName == movie){
					hasMovie = true
					console.log("You Aleady have that Movie")
				}
			})
			if(!hasMovie){
				const orders = await collectionOrders.insertOne(myobjOrders);
				myobjMovie = { MovieName: movie, OrderDate: orderDate, image: movieImage}
				const users = await collectionUsers.updateOne({ _id: currentUser._id },
					{ $push: {movies: myobjMovie} });
				didOrder = true	
				console.log(`Movie: ${movie} Ordered`)
				return didOrder
			}
			return didOrder
		}
		else{
			console.log("Movie doesn't exist, Can't order")
			return didOrder
		}
	}
	catch(e){
		console.log('Failed to insert order')
		throw e
	}
}

module.exports = {db, createUser, removeUser, addMovie, InsertOrder, findUserByName , getAllUserMovies, getAllMovies, getAllUsers, getAllOrders}
