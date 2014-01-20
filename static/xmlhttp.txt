1.	var moveTime = 70; // milliseconds
2.	var fluctuationTime = 400; // milliseconds
3.	
4.	var speedText = new Array();
5.	speedText[0] = '0'
6.	speedText[4] = 'till 4 Mbit/s';
7.	speedText[8] = '4-8 Mbit/s';
8.	speedText[15] = '8-15 Mbit/s';
9.	speedText[20] = '12-20 Mbit/s';
10.	
11.	var fluctuation = new Array();
12.	fluctuation[4] = 1;
13.	fluctuation[8] = 5;
14.	fluctuation[15] = 10;
15.	fluctuation[20] = 14;
16.	
17.	/* INITIALIZATION */
18.	
19.	window.onload = function () {
20.		var supportCheck = document.createElement && document.getElementsByTagName && createXMLHTTPObject();
21.		if (!supportCheck) return;
22.		document.getElementById('submitImage').style.display = 'none';
23.		var formFields = document.getElementsByTagName('input');
24.		for (var i=0;i<formFields.length;i++) {
25.			if (formFields[i].type != 'text') continue;
26.			formFields[i].onkeyup = initSendData;
27.		}
28.		document.forms[0].onsubmit = initSendData;
29.	}
30.	
31.	var oldQueryString,sending;
32.	
33.	function initSendData() {
34.		if (sending)
35.			clearTimeout(sending)
36.		sending = setTimeout('sendData()',500);
37.		return false;
38.	}
39.	
40.	function sendData() {
41.		var postCode = document.getElementById('postcode').value;
42.		var number = document.getElementById('huisnummer').value;
43.		if (postCode.length < 2) return;
44.		var queryString = '?postcode='+postCode+'&huisnummer='+number;
45.		if (queryString == oldQueryString) return;
46.		sendRequest('ajax_endpoint.php'+queryString, catchData);
47.		oldQueryString = queryString;
48.	}
49.	
50.	var currentSpeed = 0;
51.	
52.	function catchData(req) {
53.		var returnXML = req.responseXML;
54.		if (!returnXML) return;
55.		var speed = parseInt(returnXML.getElementsByTagName('speed')[0].firstChild.nodeValue);
56.		if (speed != currentSpeed)
57.			moveToNewSpeed(speed);
58.		currentSpeed = speed;
59.		var error = returnXML.getElementsByTagName('message')[0].firstChild;
60.		if (error) {
61.			document.getElementById('errorMessage').innerHTML = error.nodeValue;
62.			document.getElementById('errorMessage').style.visibility = 'visible';
63.		}
64.		else
65.			document.getElementById('errorMessage').style.visibility = 'hidden';
66.	}
67.	
68.	/* ANIMATION */
69.	
70.	function setWidth(width) {
71.		if (width < 0) width = 0;
72.		document.getElementById('meter').style.width = width + 'px';
73.	}
74.	
75.	var currentMbit = 0; // in Mbit; 1 Mbit = 14 pixels = 2 steps of 7 pixels
76.	var animationSteps = new Array();
77.	
78.	function moveToNewSpeed(Mbit) {
79.		for (var i=0;i<animationSteps.length;i++)
80.			clearTimeout(animationSteps[i]);
81.		animationSteps.length = 0;
82.		setWidth(currentMbit*14);
83.		var distance = Mbit - currentMbit;
84.		var direction = distance/Math.abs(distance);
85.		if (!direction) return;
86.		clearInterval(fluctuationInterval);
87.		document.getElementById('speed').innerHTML = speedText[Mbit];
88.		var timeoutCounter = 1;
89.		var pos = currentMbit*2;
90.		do {
91.			pos += direction;
92.			animationSteps[timeoutCounter] = setTimeout('setWidth(' + (pos*7) + ')',timeoutCounter*moveTime);
93.			timeoutCounter++;
94.		} while (pos != Mbit*2)
95.		currentMbit = parseInt(Mbit);
96.		setTimeout('initFluctuation()',timeoutCounter*moveTime);
97.	}
98.	
99.	var fluctuationBottom;
100.	var currentFluctuation;
101.	var fluctuationInterval;
102.	
103.	function initFluctuation() {
104.		currentFluctuation = currentMbit*2;
105.		fluctuationBottom = fluctuation[currentSpeed];
106.		fluctuationInterval = setInterval('fluctuate()',fluctuationTime);	
107.	}
108.	
109.	function fluctuate() {
110.		var fluctuationDirection = (Math.random() < .5) ? 1 : -1;
111.		var newPos = currentFluctuation + fluctuationDirection;
112.		if (newPos > currentMbit*2 || newPos < fluctuationBottom*2)
113.			fluctuationDirection = -fluctuationDirection;
114.		currentFluctuation += fluctuationDirection;
115.		setWidth(currentFluctuation*7);
116.	}
117.	
118.	/* XMLHTTP */
119.	
120.	function sendRequest(url,callback,postData) {
121.		var req = createXMLHTTPObject();
122.		if (!req) return;
123.		var method = (postData) ? "POST" : "GET";
124.		req.open(method,url,true);
125.		req.setRequestHeader('User-Agent','XMLHTTP/1.0');
126.		if (postData)
127.			req.setRequestHeader('Content-type','application/x-www-form-urlencoded');
128.		req.onreadystatechange = function () {
129.			if (req.readyState != 4) return;
130.			if (req.status != 200 && req.status != 304) {
131.				alert('HTTP error ' + req.status);
132.				return;
133.			}
134.			callback(req);
135.		}
136.		if (req.readyState == 4) return;
137.		req.send(postData);
138.	}
139.	
140.	var XMLHttpFactories = [
141.		function () {return new XMLHttpRequest()},
142.		function () {return new ActiveXObject("Msxml2.XMLHTTP")},
143.		function () {return new ActiveXObject("Msxml3.XMLHTTP")},
144.		function () {return new ActiveXObject("Microsoft.XMLHTTP")},
145.	];
146.	
147.	function createXMLHTTPObject() {
148.		var xmlhttp = false;
149.		for (var i=0;i<XMLHttpFactories.length;i++)
150.		{
151.			try {
152.				xmlhttp = XMLHttpFactories[i]();
153.			}
154.			catch (e) {
155.				continue;
156.			}
157.			break;
158.		}
159.		return xmlhttp;
160.	}