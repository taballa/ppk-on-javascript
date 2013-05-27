/* CLIENT-ALTERABLE VARIABLES */

var ST_startDate = new Date(2005, 10, 5);
var ST_endDate = new Date(2008, 12, 6);
var ST_sample = 1;
var ST_pageText = 'At the moment we\'re conducting a survey about the use of our site. For this reason a <strong>popup</strong> will be opened shortly.'

/* DON'T CHANGE BELOW THIS LINE */

var ST_cookiesSupported = false;
createCookie('ST_test', 'supported', 1);

if (readCookie('ST_test')) {
    ST_cookiesSupported = true;
    eraseCookie('ST_test');
}

ST_startDate.setMonth(ST_startDate.getMonth() - 1);
ST_endDate.setMonth(ST_endDate.getMonth() - 1);

var ST_arrivalTime = new Date();
var ST_surveyPeriod = parseInt((ST_endDate.getTime() - ST_arrivalTime.getTime()) / 86400000); // in days
var ST_surveyStarted = (ST_startDate.getTime() < ST_arrivalTime.getTime());

/* Initialisation main script */

var W3CDOM = document.createElement && document.getElementsByTagName;

addEventSimple(window, "load", ST_init);
var ST_newWindow;
var ST_loaded = false;

function ST_init() {
    if (!W3CDOM) return;
    if (!ST_cookiesSupported) return;
    var text = document.getElementById('sitetrekText');
    if (text) text.style.display = 'none';
    if (!ST_surveyStarted) return;
    if (ST_surveyPeriod < 0) return;
    var currentStatus = readCookie('ST_status');
    if (currentStatus == 'no') return;
    ST_loaded = true;
    addEventSimple(window, "unload", ST_exit);
    eraseCookie('ST_temp_store');
    if (currentStatus == 'yes') return;
    var ST_selectedForSurvey = (Math.random() * ST_sample < 1)
    if (!ST_selectedForSurvey) {
        createCookie('ST_status', 'no', 1);
        return;
    }
    if (text) {
        text.innerHTML = ST_pageText;
        text.style.display = 'block';
    }
    createCookie('ST_status', 'yes', ST_surveyPeriod);
    addEventSimple(document, "click", ST_openPopup);
    createCookie('ST_referrer', top.document.referrer, 1);
}

function ST_openPopup() {
    if (readCookie('ST_popup')) return;
    ST_newWindow = window.open('survey/popup.html', 'ST_window', 'width=300,height=300,resizable=yes,scrollbars=yes');
    ST_newWindow.blur();
    removeEventSimple(document, "click", ST_openPopup);
}

function ST_exit() {
    ST_loaded = false;
    if (readCookie('ST_popup') == 'opened' && ST_newWindow)
        ST_newWindow.trackMain(location.href);
    else
        createCookie('ST_temp_store', location.href, 1);
}

function removeCookie() {
    eraseCookie('ST_status');
    location.reload();
}

/********************
	
	      UTILITIES
	      
	********************/

function addEventSimple(obj, evt, fn) {
    if (obj.addEventListener)
        obj.addEventListener(evt, fn, false);
    else if (obj.attachEvent)
        obj.attachEvent('on' + evt, fn);
}

function removeEventSimple(obj, evt, fn) {
    if (obj.removeEventListener)
        obj.removeEventListener(evt, fn, false);
    else if (obj.detachEvent)
        obj.detachEvent('on' + evt, fn);
}

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