function loadHiRes() {
	const image = new Image();

	// Swap blurred background on load.
	image.onload = function () {
		this.style.objectFit = "cover";
		this.style.width = "100%";
		this.style.height = "100%";
		document.getElementById("background").appendChild(this);
		document.getElementById("background").style.removeProperty("filter");
	};
	image.src = "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw=&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80";
}

// Displays a notification to the user
function displayNotification(title, desc, type) {
	let alertType = "alert-" + type;
	let notificationLanding = document.getElementById("notificationLanding");

	if (document.getElementById("notiDiv") != null) {
		let curNoti = document.getElementById("notiDiv");
		curNoti.parentNode.removeChild(curNoti);
	}

	let notiDiv = document.createElement("div");
	notiDiv.className = "alert " + alertType;
	notiDiv.style.width = "75%";
	notiDiv.id = "notiDiv";

	let notiHeader = document.createElement("h5");
	notiHeader.style.textAlign = "left";
	notiHeader.innerHTML = title;
	notiDiv.appendChild(notiHeader);

	let notiDesc = document.createElement("p");
	notiDesc.style.textAlign = "left";
	notiDesc.innerHTML = desc;
	notiDesc.style.marginBottom = "0px";
	notiDiv.appendChild(notiDesc);

	notificationLanding.prepend(notiDiv);

	setTimeout(removeNotification, 8000);
}

// Fades and removes a notification
function removeNotification() {
	if (document.getElementById("notiDiv") != null) {
		let curNoti = document.getElementById("notiDiv");
		let fade = setInterval(function () {
			if (!curNoti.style.opacity)
				curNoti.style.opacity = 1;
			if (curNoti.style.opacity > 0)
				curNoti.style.opacity -= 0.01;
			else
				clearInterval(fade);
		}, 5);
		setTimeout(function () {curNoti.parentNode.removeChild(curNoti)}, 500);
	}
}

