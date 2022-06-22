function loadPage(clicked_id) {
	let fetchStr = '../html/'
	if (clicked_id == 'Home') {
		fetchStr += 'about.html'
	} else if (clicked_id == 'MyMovies') {
		fetchStr += 'userMovies.html'
	} else if (clicked_id == 'AllMovies') {
		fetchStr += 'allMovies.html'
	}

	fetch(fetchStr)
		.then(function (response) {
			return response.text()
		})
		.then(function (html) {
			document.getElementById('renderPage').innerHTML = html
		})
}

function login() {
	let myForm = document.getElementById('login_Form')

	myForm.addEventListener('submit', function (e) {
		e.preventDefault()

		const formData = new FormData(this)

		fetch('homePage.html', {
			method: 'post',
			body: formData,
		})
			.then(function (response) {
				return response.text()
			})
			.then(function (text) {
				console.log(text)
			})
	})
}

// module.exports = loadPage
