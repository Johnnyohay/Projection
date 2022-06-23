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


// module.exports = loadPage
