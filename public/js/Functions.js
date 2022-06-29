function loadPage(clicked_id) {
	let fetchStr = '../html/'
	if (clicked_id == 'Home') {
		fetchStr += 'about.html'
	} else if (clicked_id == 'MyMovies') {
		fetchStr += 'userMovies.html'
	} else if (clicked_id == 'AllMovies') {
		fetchStr += 'allMovies.html'
	}
	else if (clicked_id == 'AddUser') {
		fetchStr += 'AddUser.html'
	}
	else if (clicked_id == 'RemoveUser') {
		fetchStr += 'RemoveUser.html'
	}
	else if (clicked_id == 'AddMovie') {
		fetchStr += 'addMovie.html'
	}
	else if (clicked_id == 'AllUsers') {
		fetchStr += 'AllUsers.html'
	}
	else if (clicked_id == 'AllOrders') {
		fetchStr += 'AllOrders.html'
	}
	else if (clicked_id == 'addUserButton') {
		fetchStr += 'AddUser.html'
	}
	else if (clicked_id == 'removeUserButton') {
		fetchStr += 'removeUser.html'
	}
	else if (clicked_id == 'addMovieButton') {
		fetchStr += 'addMovie.html'
	}

	fetch(fetchStr)
		.then(function (response) {
			return response.text()
		})
		.then(function (html) {
			document.getElementById('renderPage').innerHTML = html
		})
}


function searchMovie() {
  // Declare variables
  var input, filter, ul, li,a, i, txtValue;
  input = document.getElementById('movieSearch');
  filter = input.value.toUpperCase();
  ul = document.getElementById("myUL");
  li = ul.getElementsByTagName('li');

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

function searchUser() {
    // Declare variables
    var input, filter, ul, li,a, i, txtValue;
    input = document.getElementById('userSearch');
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName('li');
  
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("a")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }

  function searchOrder() {
    // Declare variables
    var input, filter, ul, li,a, i, txtValue;
    input = document.getElementById('orderSearch');
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName('li');
  
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("a")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }

const showOrders = async function ()  {
	fetch('/orderList')
		.then(response => response.text())
		.then(data => {
			var orderArr = JSON.parse(data);
			let listOrders = ''
		orderArr.forEach(order => {
			let orderdate = order.OrderDate.split("T")[0]
			listOrders += `<li><a>${order.user}</a> - ${order.MovieName} - ${orderdate}</li>\n`
		})
	content = `<h1>All Orders</h1>
	<script src="../js/Functions.js"></script>
		<link rel="stylesheet" href="../css/allOrders.css">
		<input type="text" id="orderSearch" onkeyup="searchOrder()" placeholder="Search for Order..">
		<ul id="myUL"> \n
	${listOrders}
	</ul>`

	return content
}).then(function (html) {
	document.getElementById('renderPage').innerHTML = html
})

}

const showMovies = async function ()  {
	await fetch('/movieList')
		.then(response => response.text())
		.then(data => {
			var movieArr = JSON.parse(data);
			let listMovies = '';
		movieArr.forEach(movie => {
			listMovies += `<li><input type="text" id="movie" name=movie value='${movie.name}'/> - <a>${movie.Genre}</a> <a name=orderId onclick="orderMovie('${movie.name}','${movie.image}')">Order</a><br><img id="image" value="${movie.image}" src="${movie.image}" style="width:100px;height:100px;"></br></li>\n`
		});
	content = `<script src="../js/Functions.js"></script>
	<link rel="stylesheet" href="../css/allMovies.css">
	<h1>All Movies</h1>
	<input type="text" id="movieSearch" onkeyup="searchMovie()" placeholder="Search for Genre..">
	<ul id="myUL">
	${listMovies} 
	</ul>`;

	return content
}).then(function (html) {
	document.getElementById('renderPage').innerHTML = html
})

}

const showUsers = async function ()  {
	fetch('/userList')
		.then(response => response.text())
		.then(data => {
			var userArr = JSON.parse(data);
			let listUsers = ''
		userArr.forEach(user => {
			listUsers += `<li>${user.username} - <a>${user.role}</a></li>\n`
		})
	content = `<h1>All Users</h1>
	<script src="../js/userFunctions.js"></script>
	<link rel="stylesheet" href="../css/allUsers.css">
	<input type="text" id="userSearch" onkeyup="searchUser()" placeholder="Show list by role name..">
	<ul id="myUL">\n
	${listUsers}
	</ul>`

	return content
}).then(function (html) {
	document.getElementById('renderPage').innerHTML = html
})

}

const showUserMovies = async function ()  {
	fetch('/userMoviesList')
		.then(response => response.text())
		.then(data => {
			let userMovies = JSON.parse(data)
			let userMoviesArr = userMovies.movies
			var movieDate
			let list = ''
			userMoviesArr.forEach(movie => {
				movieDate = movie.OrderDate.split("T")[0]
				list += `<li>${movie.MovieName} - ${movieDate}</li>
				<img src="${movie.image}" style="width:100px;height:100px;">\n`
	});
	let content = `<link rel="stylesheet" href="../css/userMovies.css">
					<h1>${userMovies.username}'s Movies </h1>
	${list}`

	return content
}).then(function (html) {
	document.getElementById('renderPage').innerHTML = html
})

}

const orderMovie = function (movieName)  {
	let fetchReq = encodeURI("/pickaMovie?movie=" + movieName)
	fetch(fetchReq).then(response => response.text())
	.then(data => {
			let didOrder = JSON.parse(data);
			let content;
			if(didOrder){
				content = `<link rel="stylesheet" href="/css/about.css" />
				<p> You Have ordered a movie!</p>
				<p> go check it out </p>
				<p> in 'My Movies' section</p>
				<input type="submit" id="showUserMovies" onclick="showUserMovies()" value="My Movies"/>`;
				
			}
			else{
				content = `<link rel="stylesheet" href="/css/about.css" />
				<p> You already ordered</p>
				<p> that movie please </p>
				<p> pick another one</p>`;
			}
	return content
}).then(function (html) {
	document.getElementById('renderPage').innerHTML = html
})

}

// module.exports = loadPage
