const dotenv = require('dotenv')
dotenv.config({ path: './public/config/config.env' })
const { MONGO_DB_NAME, MONGO_URL_CON_DB } = process.env
const { MongoClient } = require('mongodb')
const client = new MongoClient(MONGO_URL_CON_DB, { useNewUrlParser: true, useUnifiedTopology: true})
const bcrypt = require('bcrypt');

//Generic function for DB connection


async function connectDB (){
	console.log("Connecting to DB...")
	await client.connect()
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
const createUser = async function (username, password,role, movies) {
	console.log("Trying to add a user...")
	const db = await connectDB()
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
				return
			}
		})
		// Add the user if doesn't exist
		if(!exist){
			const result = await collectionUsers.insertOne(myobj)
			console.log(`User: ${username} added`)
		}
	}
	catch(e){
		console.log('Failed to add user')
		disconnectDB()
		throw e
	}
}

const findUserById = async function (id) {
	console.log("Trying to Find user by Id...")
	const db = await connectDB()
	var myobj
	try{
		const collectionUsers = db.collection("Users")
		collectionUsers.findOne({_id: id}, function (err, user) {
			disconnectDB()
			return user
		  })
	}
	catch(e){
		console.log(`Failed to Find user with the following id : ${id}`)
		disconnectDB()
		throw e
	}
}

const findUserByName = async function (username, password, done) {
	console.log("Trying to Find user by name...")
	const db = await connectDB()
	try{
		const collectionUsers = db.collection("Users")
		collectionUsers.findOne({username: username}, function (err, user) {
			if (err) throw "Error"
			if (!user) {
				disconnectDB()
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
		disconnectDB()
		throw e;
	}
}

const doesUserExist = async function (username, password) {
	console.log("Trying to find if user exists...")
	const db = await connectDB()
	var myobj = { username: username, password: password }
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
				disconnectDB()
				return exist
			}
		})
		// Add the user if doesn't exist
		if(!exist){
			disconnectDB()
			return exist
		}
	}
	catch(e){
		console.log('Failed to add user')
		disconnectDB()
		throw e
	}
}
module.exports = { createUser, findUserById, findUserByName , doesUserExist}
