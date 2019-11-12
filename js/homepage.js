function login() {
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	loginApi(username, password);
}

function loginApi(username, password) {
	var request = new XMLHttpRequest();
	request.open('POST', 'https://localhost:5001/api/Users/login', true);
	var json = JSON.stringify({
		username: username,
		password: password
	});
	request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	console.log(json);
	request.send(json);
	request.onload = function () {
		// Begin accessing JSON data here
		var data = JSON.parse(this.response);

		if (request.status >= 200 && request.status < 400) {
			localStorage.setItem("token", data.token);

			console.log(data.token);
		} else {
			console.log('error');
		}
	}
	loginValue();
}


function loginValue() {
	var request = new XMLHttpRequest();
	request.open('GET', 'https://localhost:5001/api/Values', true);
	var json = JSON.stringify({
		username: username,
		password: password
	});
	request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	request.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("token"));
	console.log(json);
	request.send();
	request.onload = function () {
		// Begin accessing JSON data here
		var data = JSON.parse(this.response);

		if (request.status >= 200 && request.status < 400) {
			alert(data);
			console.log(data);
			window.location.replace("dashboard.html");
		} else {
			console.log('error');
		}
	}
}