# Project - Movie Picker

Movie Picker is an application based on Node.js integrated with MongoDB, as well as html and css to display the frontend.

## User Types

### admin - the admin has it own interface to do several functionalities which we will expend later on.
### user = the user interface is has less functionality and can display the movies that he ordered. 


## Functionality

### High Level Functionality

The is a user admin that is precreted and he can add movies, users (also remove) and orders movies for his user.
After an admin create a normal user or and admin the user can log in to his own user and order movies from the movies list,
later on he can see what movies and when he ordered them.

### Backend Functionality 

#### Login section

The server runs on express which is a backend web application framework for Node.js. 
Along with that the login-in functionality is based on 'passport' locay strategy (Username and password authentication)
which allows us to serialize the raw user's data that comes 
fron the log-in action and deserialize it to actual JSON data that we using across the application.

every page has a GET method implemented by express which allows use to always check whether the user is logged in and
therefore redirect him the the relevent pages (logged user can go back to the login page by using /login)

![image](https://user-images.githubusercontent.com/72068418/176535678-6d3bb6f4-432b-4d90-b443-97ae5f67836a.png)

is LoggedOut is a function that check if the user is logged out, if so only then he can go back to the log-in page.

Same fuctionality to other paths where we won't allow a user to get to a path by using '/path name', it always redirects 
to home page if the user is logged in.
        
![image](https://user-images.githubusercontent.com/72068418/176536175-172ddb72-77ca-4cae-b8e5-677e78cc9bd3.png)

##### First Login page:

![image](https://user-images.githubusercontent.com/72068418/176542895-dbed900e-8eb2-4d6f-8beb-42ba41a75719.png)


####  HTTP Request and Routing section

For every page there is a route the defines when to redirect or send the user to in response to the HTTP request
he made by using the UI.

##### The GET routes:

* app.get('/', isLoggedIn, (req, res) => { ... }

* app.get('/login', isLoggedOut, (req, res) => { ... }

* app.get('/homePage',isLoggedIn, (req, res) => { ... }

* app.get('/addUser',isLoggedIn, (req, res) => { ... }

* app.get('/removeUser',isLoggedIn, (req, res) => { ... }

* app.get('/addMovie',isLoggedIn, (req, res) => { ... }

* app.get('/pickMovie',isLoggedIn, (req, res) => { ... }

* app.get('/successfulLogin', isLoggedIn, (req, res) => {

* app.get('/userMoviesList', isLoggedIn, (req, res) => { ... }

* app.get('/orderList', isLoggedIn, (req, res) => { ... }

* app.get('/movieList', isLoggedIn, (req, res) => { ... }

* app.get('/userList', isLoggedIn, (req, res) => { ... }

* app.get('/pickaMovie', isLoggedIn, (req, res) => { ... }

##### The POST routes:

* app.post('/addUser', isLoggedIn, (req, res) => { ... }

* app.post('/removeUser', isLoggedIn, (req, res) => { ... }

* app.post('/addMovie', isLoggedIn, (req, res) => { ... }

* app.post('/login', passport.authenticate('local',{..}) { ... }

* app.get('/logout', function (req, res) { ... }

##### Every action has a print to the console method so that the backend can be monitored from the console:
##### Example for trying to order a movie that you already have

![image](https://user-images.githubusercontent.com/72068418/176543355-80d7769e-20e2-42e4-992b-3f24e6a1baa5.png)

### Database Functionality 

The DB is MongoDB which is managed via the 'mongodb" native driver for integration with the API of the MongoDB for Node.js.

#### Database Collections

![image](https://user-images.githubusercontent.com/72068418/176543566-1600fa08-e8e9-431b-a409-40e734e8248b.png)

##### Users

![image](https://user-images.githubusercontent.com/72068418/176538294-f6ec21f1-5d61-4c87-8eb9-3af1dcfa74a9.png)

##### Movies

![image](https://user-images.githubusercontent.com/72068418/176538419-b897e067-c57d-436c-af73-dff295c83247.png)

##### Orders

![image](https://user-images.githubusercontent.com/72068418/176538532-737292ec-6083-47c7-a04c-f59257a0d970.png)

##### DB Functions

All the DB functions resides in the 'db.js' which we use form the main 'server.js' to integrate with it.

Each function is saved in a variable which is a function that can be used in the main "sever.js"

* var db = function connectDB (){ ... }                                            - Opens connection to the DB

* const createUser = async function (username, password,role, movies,db) { ... }   - Creates a user

* const removeUser = async function (username, db) { ... }                         - Removes an existing user

* const addMovie = async function (movie, genre, image, db) { ... }                - Add and new movie

* const findUserByName = async function (username, password, done, db) { ... }     - Return a user object by it name

* const getAllMovies = async function (db) { ... }                                 - Retrives an array of all the movies

* const getAllUsers = async function (db) { ... }                                  - Retrives an array of all the user

* const getAllOrders = async function (db) { ... }                                 - Retrives an array of all the orders

* const getAllUserMovies = async function (user, db) { ... }                       - Retrives an object that contains the user's name and movies

* const InsertOrder = async function (movie, user, db) { ... }                     - Add a movie to a user and add and order to the orders list

### Frontend Functionality 

The frontend functionality is every request that is send by the user that displays changes on the UI.
All the functions the respond to the clicks and types of the user resides in Functions.js.

##### Frontend Functions

function loadPage(clicked_id) { ... }                                              - Loads the pages from the main home page bar

function searchMovie() { ... }                                                     - search for a movie from the search bar based on Genre

function searchUser() { ... }                                                      - search for a user from the search bar based on role (user or admin)

function searchOrder() { ... }                                                     - search for an order from the search bar based on username 

const showOrders = async function ()  { ... }                                      - Displays the page that holds all the orders list

const showMovies = async function ()  { ... }                                      - Displays the page that holds all the movies list

const showUsers = async function ()  { ... }                                       - Displays the page that holds all the users list

const showUserMovies = async function ()  { ... }                                  - Displays the page that holds all the movies of the logged-in user list

const orderMovie = function (movieName)  { ... }                                   - Displays the page that informs the user whether the movie has been ordered or not

##### The Home page:

![image](https://user-images.githubusercontent.com/72068418/176543768-49fcd510-4d11-4cb8-9c22-2f0b431a0dc8.png)

##### Add a user page:

![image](https://user-images.githubusercontent.com/72068418/176543875-1d5d1333-8db1-4064-a382-79957f309602.png)

##### List of movies page:

![image](https://user-images.githubusercontent.com/72068418/176543971-5d078b0b-c2e8-4a7a-9b69-ae5eb5b24ec6.png)

## Editors

### Tom Rozenwaks
### Jonathan Ohayon
### Yoav Ben-Horin
