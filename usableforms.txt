1.	var containerTag = 'TR'; // can be any tag name
2.	
3.	var compatible = (
4.		document.getElementById && document.getElementsByTagName && document.createElement
5.		&&
6.		!(navigator.userAgent.indexOf('MSIE 5') != -1 && navigator.userAgent.indexOf('Mac') != -1)
7.		);
8.	
9.	if (compatible) {
10.		document.write('<style>.accessibility{display: none}</style>');
11.		var waitingRoom = document.createElement('div');
12.	}
13.	
14.	var hiddenFormFieldsPointers = new Object();
15.	
16.	function prepareForm() {
17.		if (!compatible) return;
18.		var marker = document.createElement(containerTag);
19.		marker.style.display = 'none';
20.	
21.		var selects = document.getElementsByTagName('select');
22.		for (var i=0;i<selects.length;i++)
23.			addEventSimple(selects[i],'change',showHideFields)
24.	
25.		var containers = document.getElementsByTagName(containerTag);
26.		var hiddenFields = new Array;
27.		for (var i=0;i<containers.length;i++) {
28.			if (containers[i].getAttribute('rel')) {
29.				var y = getAllFormFields(containers[i]);
30.				containers[i].nestedRels = new Array();
31.				for (var j=0;j<y.length;j++) {
32.					var rel = y[j].getAttribute('rel');
33.					if (!rel || rel == 'none') continue;
34.					containers[i].nestedRels.push(rel);
35.				}
36.				if (!containers[i].nestedRels.length) containers[i].nestedRels = null;
37.				hiddenFields.push(containers[i]);
38.			}
39.		}
40.	
41.		while (hiddenFields.length) {
42.			var rel = hiddenFields[0].getAttribute('rel');
43.			if (!hiddenFormFieldsPointers[rel])
44.				hiddenFormFieldsPointers[rel] = new Array();
45.			var relIndex = hiddenFormFieldsPointers[rel].length;
46.			hiddenFormFieldsPointers[rel][relIndex] = hiddenFields[0];
47.			var newMarker = marker.cloneNode(true);
48.			newMarker.id = rel + relIndex;
49.			hiddenFields[0].parentNode.replaceChild(newMarker,hiddenFields[0]);
50.			waitingRoom.appendChild(hiddenFields.shift());
51.		}
52.		setDefaults();
53.		addEventSimple(document,'click',showHideFields);
54.	}
55.	
56.	function setDefaults() {
57.		var inputs = document.getElementsByTagName('input');
58.		for (var i=0;i<inputs.length;i++) {
59.			if (inputs[i].checked && inputs[i].getAttribute('rel'))
60.				intoMainForm(inputs[i].getAttribute('rel'))
61.		}
62.		var selects = document.getElementsByTagName('select');
63.		for (var i=0;i<selects.length;i++) {
64.			if (selects[i].options[selects[i].selectedIndex].getAttribute('rel'))
65.				intoMainForm(selects[i].options[selects[i].selectedIndex].getAttribute('rel'))
66.		}
67.	}
68.	
69.	function showHideFields(e) {
70.		var evt = e || window.event;
71.		var evtTarget = evt.target || evt.srcElement;
72.		if (evtTarget.nodeName == 'LABEL') {
73.			var relatedFieldName = evtTarget.getAttribute('for') || evtTarget.getAttribute('htmlFor');
74.			evtTarget = document.getElementById(relatedFieldName);
75.		}
76.			
77.		if (!(
78.			(evtTarget.nodeName == 'SELECT' && e.type == 'change')
79.			||
80.			(evtTarget.nodeName == 'INPUT' && evtTarget.getAttribute('rel'))
81.		   )) return;
82.	
83.		var fieldsToBeInserted = evtTarget.getAttribute('rel');
84.	
85.		if (evtTarget.type == 'checkbox') {
86.			if (evtTarget.checked)
87.				intoMainForm(fieldsToBeInserted);
88.			else
89.				intoWaitingRoom(fieldsToBeInserted);
90.		}
91.		else if (evtTarget.type == 'radio') {
92.			removeOthers(evtTarget.form[evtTarget.name],fieldsToBeInserted)
93.			intoMainForm(fieldsToBeInserted);
94.		}
95.		else if (evtTarget.type == 'select-one') {
96.			fieldsToBeInserted = evtTarget.options[evtTarget.selectedIndex].getAttribute('rel');
97.			removeOthers(evtTarget.options,fieldsToBeInserted);
98.			intoMainForm(fieldsToBeInserted);
99.		}
100.	}
101.	
102.	function removeOthers(others,fieldsToBeInserted) {
103.		for (var i=0;i<others.length;i++) {
104.			var show = others[i].getAttribute('rel');
105.			if (show == fieldsToBeInserted) continue;
106.			intoWaitingRoom(show);
107.		}
108.	}
109.	
110.	function intoWaitingRoom(relation) {
111.		if (relation == 'none') return;
112.		var Elements = hiddenFormFieldsPointers[relation];
113.		for (var i=0;i<Elements.length;i++) {
114.			waitingRoom.appendChild(Elements[i]);
115.			if (Elements[i].nestedRels)
116.				for (var j=0;j<Elements[i].nestedRels.length;j++)
117.					intoWaitingRoom(Elements[i].nestedRels[j]);
118.		}
119.	}
120.	
121.	function intoMainForm(relation) {
122.		if (relation == 'none') return;
123.		var Elements = hiddenFormFieldsPointers[relation];
124.		for (var i=0;i<Elements.length;i++) {
125.			var insertPoint = document.getElementById(relation+i);
126.			insertPoint.parentNode.insertBefore(Elements[i],insertPoint);
127.			if (Elements[i].nestedRels) {
128.				var fields = getAllFormFields(Elements[i]);
129.				for (var j=0;j<fields.length;j++) {
130.					if (!fields[j].getAttribute('rel')) continue;
131.					if (fields[j].checked || fields[j].selected) 
132.						intoMainForm(fields[j].getAttribute('rel'));
133.				}
134.			}
135.		}
136.	}
137.	
138.	function getAllFormFields(node) {
139.		var allFormFields = new Array;
140.		var x = node.getElementsByTagName('input');
141.		for (var i=0;i<x.length;i++)
142.			allFormFields.push(x[i]);
143.		var y = node.getElementsByTagName('option');
144.		for (var i=0;i<y.length;i++)
145.			allFormFields.push(y[i]);
146.		return allFormFields;
147.	}
148.	
149.	/** ULTRA-SIMPLE EVENT ADDING **/
150.	
151.	function addEventSimple(obj,evt,fn) {
152.		if (obj.addEventListener)
153.			obj.addEventListener(evt,fn,false);
154.		else if (obj.attachEvent)
155.			obj.attachEvent('on'+evt,fn);
156.	}
157.	
158.	function removeEventSimple(obj,evt,fn) {
159.		if (obj.removeEventListener)
160.			obj.removeEventListener(evt,fn,false);
161.		else if (obj.detachEvent)
162.			obj.detachEvent('on'+evt,fn);
163.	}
164.	
165.	addEventSimple(window,"load",prepareForm);
166.	
167.	/** PUSH AND SHIFT FOR IE5 **/
168.	
169.	function Array_push() {
170.		var A_p = 0
171.		for (A_p = 0; A_p < arguments.length; A_p++) {
172.			this[this.length] = arguments[A_p]
173.		}
174.		return this.length
175.	}
176.	
177.	if (typeof Array.prototype.push == "undefined") {
178.		Array.prototype.push = Array_push
179.	}
180.	
181.	function Array_shift() {
182.		var A_s = 0
183.		var response = this[0]
184.		for (A_s = 0; A_s < this.length-1; A_s++) {
185.			this[A_s] = this[A_s + 1]
186.		}
187.		this.length--
188.		return response
189.	}
190.	
191.	if (typeof Array.prototype.shift == "undefined") {
192.		Array.prototype.shift = Array_shift
193.	}
194.	