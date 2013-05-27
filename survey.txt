1.	/* CLIENT-ALTERABLE VARIABLES */
2.	
3.	var ST_startDate = new Date(2005,10,5);
4.	var ST_endDate = new Date(2008,12,6);
5.	var ST_sample = 1;
6.	var ST_pageText = 'At the moment we\'re conducting a survey about the use of our site. For this reason a <strong>popup</strong> will be opened shortly.'
7.	
8.	/* DON'T CHANGE BELOW THIS LINE */
9.	
10.	var ST_cookiesSupported = false;
11.	createCookie('ST_test','supported',1);
12.	
13.	if (readCookie('ST_test')) {
14.		ST_cookiesSupported = true;
15.		eraseCookie('ST_test');
16.	}
17.	
18.	ST_startDate.setMonth(ST_startDate.getMonth() - 1);
19.	ST_endDate.setMonth(ST_endDate.getMonth() - 1);
20.	
21.	var ST_arrivalTime = new Date();
22.	var ST_surveyPeriod = parseInt((ST_endDate.getTime() - ST_arrivalTime.getTime())/86400000); // in days
23.	var ST_surveyStarted = (ST_startDate.getTime() < ST_arrivalTime.getTime());
24.	
25.	/* Initialisation main script */
26.	
27.	var W3CDOM = document.createElement && document.getElementsByTagName;
28.	
29.	addEventSimple(window,"load",ST_init);
30.	var ST_newWindow;
31.	var ST_loaded = false;
32.	
33.	function ST_init() {
34.		if (!W3CDOM) return;
35.		if (!ST_cookiesSupported) return;
36.		var text = document.getElementById('sitetrekText');
37.		if (text) text.style.display = 'none';
38.		if (!ST_surveyStarted) return;
39.		if (ST_surveyPeriod < 0 ) return;
40.		var currentStatus = readCookie('ST_status');
41.		if (currentStatus == 'no') return;
42.		ST_loaded = true;
43.		addEventSimple(window,"unload",ST_exit); 
44.		eraseCookie('ST_temp_store');
45.		if (currentStatus == 'yes') return;
46.		var ST_selectedForSurvey = (Math.random()*ST_sample < 1)
47.		if (!ST_selectedForSurvey) {
48.			createCookie('ST_status','no',1);
49.			return;
50.		}
51.		if (text) {
52.			text.innerHTML = ST_pageText;
53.			text.style.display = 'block';
54.		}
55.		createCookie('ST_status','yes',ST_surveyPeriod);
56.		addEventSimple(document,"click",ST_openPopup);
57.		createCookie('ST_referrer',top.document.referrer,1);
58.	}
59.	
60.	function ST_openPopup() {
61.		if (readCookie('ST_popup')) return;
62.		ST_newWindow = window.open('survey/popup.html','ST_window','width=300,height=300,resizable=yes,scrollbars=yes');
63.		ST_newWindow.blur();
64.		removeEventSimple(document,"click",ST_openPopup);
65.	}
66.	
67.	function ST_exit() {
68.		ST_loaded = false;
69.		if (readCookie('ST_popup') == 'opened' && ST_newWindow)
70.			ST_newWindow.trackMain(location.href);
71.		else
72.			createCookie('ST_temp_store',location.href,1);
73.	}
74.	
75.	function removeCookie() {
76.		eraseCookie('ST_status'); 
77.		location.reload();
78.	}
79.	
80.	/********************
81.	
82.	      UTILITIES
83.	      
84.	********************/
85.	
86.	function addEventSimple(obj,evt,fn) {
87.		if (obj.addEventListener)
88.			obj.addEventListener(evt,fn,false);
89.		else if (obj.attachEvent)
90.			obj.attachEvent('on'+evt,fn);
91.	}
92.	
93.	function removeEventSimple(obj,evt,fn) {
94.		if (obj.removeEventListener)
95.			obj.removeEventListener(evt,fn,false);
96.		else if (obj.detachEvent)
97.			obj.detachEvent('on'+evt,fn);
98.	}
99.	
100.	function createCookie(name,value,days) {
101.		if (days) {
102.			var date = new Date();
103.			date.setTime(date.getTime()+(days*24*60*60*1000));
104.			var expires = "; expires="+date.toGMTString();
105.		}
106.		else var expires = "";
107.		document.cookie = name+"="+value+expires+"; path=/";
108.	}
109.	
110.	function readCookie(name) {
111.		var nameEQ = name + "=";
112.		var ca = document.cookie.split(';');
113.		for(var i=0;i < ca.length;i++)
114.		{
115.			var c = ca[i];
116.			while (c.charAt(0)==' ') c = c.substring(1,c.length);
117.			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
118.		}
119.		return null;
120.	}
121.	
122.	function eraseCookie(name) {
123.		createCookie(name,"",-1);
124.	}