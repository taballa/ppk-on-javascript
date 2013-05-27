1.	var nrOfAttempts = 20;
2.	var waitingTime = 250; // in milliseconds
3.	
4.	window.onload = function () {
5.		createCookie('ST_popup','opened',1);
6.		getStatus();
7.		if (readCookie('ST_temp_store')) {
8.			trackMain(readCookie('ST_temp_store'));
9.			eraseCookie('ST_temp_store');
10.		}
11.	}
12.	
13.	window.onunload = function () {
14.		eraseCookie('ST_popup');
15.		if (checkCommunication()) 
16.			opener.ST_newWindow = null;
17.	}
18.	
19.	var tryCounter = 0;
20.	var pageCounter = 0;
21.	
22.	function trackMain(url) {
23.		if (url)
24.			addPage(url);
25.	
26.		if (!opener || opener.closed || !checkCommunication()) 
27.			startSurvey();
28.	
29.		else if (checkCommunication() && opener.ST_loaded) {
30.			opener.ST_newWindow = window;
31.			tryCounter = 0;
32.		}
33.		
34.		else if (tryCounter < nrOfAttempts) {
35.			setTimeout('trackMain()',waitingTime); 
36.			tryCounter++;
37.		}
38.		
39.		else
40.			startSurvey();
41.	}
42.	
43.	function addPage(url) {
44.		pageCounter++;
45.		if (pageCounter > 99) return;
46.		addInput('p' + pageCounter,url);
47.	}
48.	
49.	function addInput(name,value) {
50.		var mainForm = document.forms[0];
51.		var newInput = document.createElement('input');
52.	//	newInput.type = 'hidden';
53.		newInput.name = name;
54.		newInput.value = value;
55.		mainForm.appendChild(newInput);
56.	}
57.	
58.	
59.	function startSurvey() {
60.		self.resizeTo(800,600);
61.	        self.focus();
62.		document.forms[0].submit();
63.	}
64.	
65.	function getStatus() {
66.		addInput('sx',self.screen.width);
67.		addInput('sy',self.screen.height);
68.		addInput('os',navigator.platform);
69.		addInput('br',detectBrowser());
70.		if (readCookie('ST_referrer')) {
71.			addInput('ref',readCookie('ST_referrer'));
72.			eraseCookie('ST_referrer');
73.		}
74.	}
75.	
76.	
77.	function checkCommunication() {
78.		if (!opener) return false;
79.		try {
80.			opener.testVar = true;
81.		}
82.		catch (e) {
83.			return false;
84.		}
85.		opener.testVar = null;
86.		return true;	
87.	}
88.	
89.	/********************
90.	
91.	      UTILITIES
92.	      
93.	********************/
94.	
95.	
96.	function createCookie(name,value,days) {
97.		if (days)
98.		{
99.			var date = new Date();
100.			date.setTime(date.getTime()+(days*24*60*60*1000));
101.			var expires = "; expires="+date.toGMTString();
102.		}
103.		else var expires = "";
104.		document.cookie = name+"="+value+expires+"; path=/";
105.	}
106.	
107.	function readCookie(name) {
108.		var nameEQ = name + "=";
109.		var ca = document.cookie.split(';');
110.		for(var i=0;i < ca.length;i++)
111.		{
112.			var c = ca[i];
113.			while (c.charAt(0)==' ') c = c.substring(1,c.length);
114.			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
115.		}
116.		return null;
117.	}
118.	
119.	function eraseCookie(name) {
120.		createCookie(name,"",-1);
121.	}
122.	
123.	var browserString;
124.	var detect = navigator.userAgent.toLowerCase();
125.	
126.	function detectBrowser() {
127.		var browser,version;
128.	
129.		if (checkBrowserString('konqueror')) browser = "Konqueror";
130.		else if (checkBrowserString('safari')) browser = "Safari"
131.		else if (checkBrowserString('omniweb')) browser = "OmniWeb"
132.		else if (checkBrowserString('opera')) browser = "Opera"
133.		else if (checkBrowserString('webtv')) browser = "WebTV";
134.		else if (checkBrowserString('icab')) browser = "iCab"
135.		else if (checkBrowserString('msie')) browser = "Internet Explorer"
136.		else if (!checkBrowserString('compatible')) {
137.			browser = "Mozilla"
138.			version = detect.charAt(8);
139.		}
140.		else browser = "Unknown";
141.	
142.		if (!version) version = detect.charAt(place + browserString.length);
143.		return browser + " " + version;
144.	}
145.	
146.	function checkBrowserString(string) {
147.		place = detect.indexOf(string) + 1;
148.		browserString = string;
149.		return place;
150.	}
151.	
152.	function createReadableDate(dateObj) {
153.		var day = dateObj.getDate();
154.		var month = dateObj.getMonth() + 1;
155.		var year = dateObj.getFullYear();
156.		return day + '-' + month + '-' + year;
157.	}
158.	