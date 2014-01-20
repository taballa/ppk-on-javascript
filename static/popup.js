var nrOfAttempts = 20;
var waitingTime = 250; // in milliseconds

window.onload = function() {
	createCookie('ST_popup', 'opened', 1);
	getStatus();
	if (readCookie('ST_temp_store')) {
		trackMain(readCookie('ST_temp_store'));
		eraseCookie('ST_temp_store');
	}
}

window.onunload = function() {
	eraseCookie('ST_popup');
	if (checkCommunication())
		opener.ST_newWindow = null;
}

var tryCounter = 0;
var pageCounter = 0;

function trackMain(url) {
	if (url)
		addPage(url);

	if (!opener || opener.closed || !checkCommunication())
		startSurvey();

	else if (checkCommunication() && opener.ST_loaded) {
		opener.ST_newWindow = window;
		tryCounter = 0;
	} else if (tryCounter < nrOfAttempts) {
		setTimeout('trackMain()', waitingTime);
		tryCounter++;
	} else
		startSurvey();
}

function addPage(url) {
	pageCounter++;
	if (pageCounter > 99) return;
	addInput('p' + pageCounter, url);
}

function addInput(name, value) {
	var mainForm = document.forms[0];
	var newInput = document.createElement('input');
	//	newInput.type = 'hidden';
	newInput.name = name;
	newInput.value = value;
	mainForm.appendChild(newInput);
}


function startSurvey() {
	self.resizeTo(800, 600);
	self.focus();
	document.forms[0].submit();
}

function getStatus() {
	addInput('sx', self.screen.width);
	addInput('sy', self.screen.height);
	addInput('os', navigator.platform);
	addInput('br', detectBrowser());
	if (readCookie('ST_referrer')) {
		addInput('ref', readCookie('ST_referrer'));
		eraseCookie('ST_referrer');
	}
}


function checkCommunication() {
	if (!opener) return false;
	try {
		opener.testVar = true;
	} catch (e) {
		return false;
	}
	opener.testVar = null;
	return true;
}

/********************
	
	      UTILITIES
	      
	********************/


function createCookie(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	} else var expires = "";
	document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name, "", -1);
}

var browserString;
var detect = navigator.userAgent.toLowerCase();

function detectBrowser() {
	var browser, version;

	if (checkBrowserString('konqueror')) browser = "Konqueror";
	else if (checkBrowserString('safari')) browser = "Safari"
	else if (checkBrowserString('omniweb')) browser = "OmniWeb"
	else if (checkBrowserString('opera')) browser = "Opera"
	else if (checkBrowserString('webtv')) browser = "WebTV";
	else if (checkBrowserString('icab')) browser = "iCab"
	else if (checkBrowserString('msie')) browser = "Internet Explorer"
	else if (!checkBrowserString('compatible')) {
		browser = "Mozilla"
		version = detect.charAt(8);
	} else browser = "Unknown";

	if (!version) version = detect.charAt(place + browserString.length);
	return browser + " " + version;
}

function checkBrowserString(string) {
	place = detect.indexOf(string) + 1;
	browserString = string;
	return place;
}

function createReadableDate(dateObj) {
	var day = dateObj.getDate();
	var month = dateObj.getMonth() + 1;
	var year = dateObj.getFullYear();
	return day + '-' + month + '-' + year;
}