1.	var sheetRules; // all rules in stylesheet Set by initStyleChange()
2.	var currentRule; // which rule are we editing? Set by assignRule()
3.	var defaultStyles = new Array();
4.	
5.	function initStyleChange() {
6.		if (!document.styleSheets) return;
7.		var sheets = document.styleSheets;
8.		for (var i=0;i<sheets.length;i++) {
9.			var ssName = sheets[i].href.substring(sheets[i].href.lastIndexOf('/')+1);
10.			if (ssName == 'colors.css')
11.			var currentSheet = sheets[i];
12.		}
13.		if (!currentSheet) return;
14.		if (currentSheet.cssRules)
15.			sheetRules = currentSheet.cssRules
16.		else if (currentSheet.rules)
17.			sheetRules = currentSheet.rules;
18.		else return;
19.		var selectorSelect = document.forms[0].selectors;
20.		var previousSelector = readCookie('selector') || null;
21.		for (var i=0;i<sheetRules.length;i++) {
22.			var value = sheetRules[i].selectorText;
23.			var text = sheetRules[i].style.description || value;
24.			selectorSelect.options[selectorSelect.options.length] = new Option(text,value);
25.			if (previousSelector == value) {
26.				selectorSelect.options[selectorSelect.options.length-1].selected = true;
27.				currentRule = sheetRules[i];
28.			}
29.		}
30.		document.getElementById('selectors').onchange = assignRule;
31.		document.getElementById('restoreDefaults').onclick = restoreDefaults;
32.	
33.		var els = document.forms[1].elements;
34.		for (var i=0;i<els.length;i++) {	
35.			els[i].onchange = assignStyles;
36.			els[i].onchange();
37.		}
38.		
39.		var links = document.getElementsByTagName('a');
40.		for (var i=0;i<links.length;i++) {
41.			if (links[i].className != 'colorPicker') continue;
42.			links[i].onclick = placeColorPicker;
43.			var targeted = links[i].parentNode.getAttribute('for') || links[i].parentNode.getAttribute('htmlFor');
44.			links[i].targetElement = document.forms[1].elements[targeted];
45.		}	
46.	}
47.	
48.	function assignRule() {
49.		var selector = this.value;
50.		if (!selector) return;
51.		for (var i=0;i<sheetRules.length;i++)
52.			if (sheetRules[i].selectorText.toLowerCase() == selector.toLowerCase())
53.				currentRule = sheetRules[i];
54.		setFormValues();
55.	}
56.	
57.	function assignStyles() {
58.		if (!currentRule) return;
59.		var styleName = this.name;
60.		var styleValue = this.value;
61.		if (this.type == 'checkbox' && !this.checked)
62.			styleValue = '';
63.		currentRule.style[styleName] = styleValue;    
64.	}
65.	
66.	function setFormValues() {
67.		document.forms[1].reset();
68.		var styles = currentRule.style;
69.		for (var i in styles) {
70.			if (styles[i] && isNaN(i) && typeof styles[i] == 'string') { // Moz needs thorough check
71.				defaultStyles[i] = styles[i];
72.				var relatedField = document.forms[1].elements[i];
73.				if (relatedField && relatedField.style) {
74.					switch (relatedField.type) {
75.						case "text":
76.							relatedField.value = styles[i];
77.							break;
78.						case "checkbox":
79.							if (relatedField.value == styles[i])
80.								relatedField.checked = true;
81.							break;
82.						case "select-one":
83.							for (var j=0;j<relatedField.options.length;j++)
84.								if (relatedField.options[j].value == styles[i])
85.									relatedField.options[j].selected = true;
86.					}
87.				}
88.			}
89.		}
90.	}
91.	
92.	function restoreDefaults() {
93.		for (var i in defaultStyles) 
94.			if (defaultStyles[i] && isNaN(i) && typeof defaultStyles[i] == 'string') // all exceptions for ModefaultStyles
95.					currentRule.style[i] = defaultStyles[i];
96.		setFormValues();
97.	}
98.	
99.	function saveSelector() {
100.		if (!currentRule) return;
101.		createCookie('selector',currentRule.selectorText,1);
102.	}
103.	
104.	addEventSimple(window,"load",initStyleChange);
105.	addEventSimple(window,"unload",saveSelector);
106.	
107.	var colorPicker;
108.	
109.	function createColorPicker() {
110.		var container = document.createElement('div');
111.		container.className = 'colorPicker';
112.		var data = ['00','33','66','99','cc','ff'];
113.		for (var blue=0;blue<data.length;blue++) {
114.			for (var green=0;green<data.length;green++) {
115.				for (var red=0;red<data.length;red++) {
116.					var colorHolder = document.createElement('div');
117.					var color = '#' + data[red] + data[green] + data[blue];
118.					colorHolder.style.backgroundColor = color;
119.					colorHolder.onclick = enterColor;
120.					colorHolder.onmouseover = function () {
121.						this.style.borderWidth = '3px';
122.						this.style.width = '6px';
123.						this.style.height = '6px';
124.					}
125.					colorHolder.onmouseout = function () {
126.						this.style.borderWidth = '';
127.						this.style.width = '';
128.						this.style.height = '';
129.					}
130.					container.appendChild(colorHolder);
131.				}
132.			}
133.		}
134.		document.getElementById('sitecontainer').appendChild(container);
135.		return container;
136.	}
137.	
138.	function placeColorPicker() {
139.		if (!colorPicker) colorPicker = createColorPicker();
140.		var coors = findPos(this);
141.		colorPicker.style.top = coors[1] - 20 + 'px';
142.		colorPicker.style.left = 0;
143.		colorPicker.style.visibility = 'visible';
144.		colorPicker.targetElement = this.targetElement;
145.		return false;
146.	}
147.	
148.	function enterColor() {
149.		var color = this.style.backgroundColor;
150.		colorPicker.targetElement.value = color;
151.		colorPicker.targetElement.onchange();
152.		colorPicker.style.visibility = 'hidden';
153.	}
154.	
155.	function createCookie(name,value,days) {
156.		if (days) {
157.			var date = new Date();
158.			date.setTime(date.getTime()+(days*24*60*60*1000));
159.			var expires = "; expires="+date.toGMTString();
160.		}
161.		else var expires = "";
162.		document.cookie = name+"="+value+expires+"; path=/";
163.	}
164.	
165.	function readCookie(name) {
166.		var nameEQ = name + "=";
167.		var ca = document.cookie.split(';');
168.		for(var i=0;i < ca.length;i++)
169.		{
170.			var c = ca[i];
171.			while (c.charAt(0)==' ') c = c.substring(1,c.length);
172.			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
173.		}
174.		return null;
175.	}
176.	
177.	function eraseCookie(name) {
178.		createCookie(name,"",-1);
179.	}
180.	
181.	function findPos(obj) {
182.		var curleft = curtop = 0;
183.		if (obj.offsetParent) {
184.			while (obj.offsetParent) {
185.				curleft += obj.offsetLeft;
186.				curtop += obj.offsetTop;
187.				obj = obj.offsetParent;
188.			}
189.		}
190.		return [curleft,curtop];
191.	}