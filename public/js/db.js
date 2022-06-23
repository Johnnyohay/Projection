const dotenv = require('dotenv')
dotenv.config({ path: './public/config/config.env' })
const { MONGO_DB_NAME, MONGO_URL_CON_DB } = process.env
const { MongoClient } = require('mongodb')
const client = new MongoClient(MONGO_URL_CON_DB, { useNewUrlParser: true, useUnifiedTopology: true})
const bcrypt = require('bcrypt');

//Generic function for DB connection


var db = function connectDB (){
	console.log("Connecting to DB...")
	client.connect()
	var dbo = client.db(MONGO_DB_NAME)
		if (!dbo) {
			console.error(`DB Not Found! Failed to Connect`)
			process.exit(2)
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

const addMovie = async function (movie, db) {
	console.log("Trying to add a movie...")
	var myobj = { name: movie }
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

const findUserById = async function (id) {
	console.log("Trying to Find user by Id...")
	try{
		const collectionUsers = db.collection("Users")
		collectionUsers.findOne({_id: id}, function (err, user) {
			return user
		  })
	}
	catch(e){
		console.log(`Failed to Find user with the following id : ${id}`)
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
			// bcrypt.compare(password, user.password, function (err, res) {
			// 	if (err) throw "Error"
			// 	console.log("Passwords don't match" + res)
			// 	if (res === false){
			// 		disconnectDB()
			// 		console.log("Passwords don't match")
			// 		return user
			// 	} 
		});
		//   })
	}
	catch(e){
		console.log("Catched an Error")
		throw e;
	}
}

const doesUserExist = async function (username, password,db) {
	console.log("Trying to find if user exists...")
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
				return exist
			}
		})
		// Add the user if doesn't exist
		if(!exist){
			return exist
		}
	}
	catch(e){
		console.log('Failed to add user')
		throw e
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
			movieArr.push(movie.name)
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
			usersArr.push(user.username)
		})
		// Add the user if doesn't exist
		return usersArr
	}
	catch(e){
		console.log('Failed to get users')
		throw e
	}
}
module.exports = {db, createUser, removeUser, addMovie, findUserById, findUserByName , doesUserExist, getAllMovies, getAllUsers}
