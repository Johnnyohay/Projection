const passport = require('passport')
const localStrategy = require('passport-local').Strategy
// const dotenv = require('dotenv')
// dotenv.config({ path: './public/config/config.env'})
// const bcrypt = require('bcrypt');
var MongoDB = require( './db.js')
var validPassword = require( './passwordUtils.js').validPassword

const passportFields = {
	usernameField: "username",
	passwordField: "password"
}
const verifyCallBack = (username, password, done) => {
	console.log("###########wqdqwd#### ")
	var user = await (async (username, password, done) => {
		const result = await MongoDB.findUserByName(username, password, done)
		return result
	  })(username, password, done)
	  return user
};

const strategy = new localStrategy(function (username, password, done) {
	console.log("###########wqdqwd#### ")
	var user = (async (username, password, done) => {
		const result = await MongoDB.findUserByName(username, password, done)
		return result
	  })(username, password, done)
	  return user

}) 
passport.use(passportFields, strategy);