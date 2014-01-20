1.	var IEMAC = (navigator.userAgent.indexOf('Mac') != -1 && navigator.userAgent.indexOf('MSIE') != -1);
2.	var W3CDOM = (document.createElement && document.getElementsByTagName && !IEMAC);
3.	
4.	if (W3CDOM) {
5.		var extraTD = document.createElement('td');
6.		extraTD.className = 'empty';
7.		document.write('<style>#searchTable{display: block} .noscript{display: none} #orderHeader div {display: block}</style>');
8.		var extraButton = document.createElement('button');
9.		extraButton.className = 'extraButton';
10.		extraButton.appendChild(document.createTextNode('Collect all orders'));
11.		extraButton.onclick = moveAllToOrderTable;
12.	}
13.	
14.	window.onload = function () {
15.		if (!W3CDOM) return;
16.		var field = document.getElementById('searchField');
17.		if (!field) return;
18.		
19.		var marker = document.createElement('tr');
20.		marker.className = 'marker';
21.		var trashLink = document.createElement('a');
22.		trashLink.href = '#';
23.		trashLink.innerHTML = 'trash&nbsp;';
24.		trashLink.className = 'trash';
25.		var orderLink = document.createElement('a');
26.		orderLink.href = '#';
27.		orderLink.innerHTML = 'order&nbsp;';
28.		orderLink.className = 'order';
29.		
30.		var currentPrice = 0;
31.	
32.		var containers = document.getElementById('startTable').getElementsByTagName('tr'); 
33.		for (var i=0;i<containers.length;i++) {
34.			if (containers[i].getAttribute('price'))
35.				currentPrice = containers[i].getAttribute('price');
36.			var y = containers[i].getElementsByTagName('td');
37.			if (y.length != 4) continue;
38.			containers[i].ordered = false;
39.			containers[i].productName = y[1].firstChild.nodeValue.toLowerCase();
40.			containers[i].price = currentPrice;
41.			var tmp = marker.cloneNode(true);
42.			tmp.id = 'marker' + containers[i].productName;
43.			containers[i].parentNode.insertBefore(tmp,containers[i].nextSibling);
44.			var searchField = containers[i].getElementsByTagName('input')[0];
45.			searchField.onkeyup = orderSandwich;
46.			searchField.value = '';
47.			var extraLink = trashLink.cloneNode(true);
48.			extraLink.onclick = removeSandwich;
49.			var extraLink2 = orderLink.cloneNode(true);
50.			extraLink2.onclick = moveToOrderTable;
51.			searchField.parentNode.appendChild(extraLink2);
52.			searchField.parentNode.appendChild(extraLink);
53.		}
54.		document.getElementById('searchField').onkeyup = searchSandwich;
55.	}
56.	
57.	var toSearchResults = new Array();
58.	var toOrderTable =  new Array();
59.	var toStartTable = new Array();
60.	
61.	/* SEARCH */
62.	
63.	function searchSandwich() {
64.		this.value = this.value.replace(/\\/,'');
65.		if (this.value.length < 2) return;
66.		if (this.remember && this.remember == this.value) return;
67.		var containers = document.getElementById('startTable').getElementsByTagName('tr');
68.		for (var i=0;i<containers.length;i++) {
69.			var cells = containers[i].getElementsByTagName('td');
70.			if (cells.length != 4) continue;		
71.			if (containers[i].productName.match(this.value.toLowerCase()))
72.				toSearchResults.push(containers[i]);
73.		}	
74.		var containersSearch = document.getElementById('searchResults').getElementsByTagName('tr');
75.		for (var i=0;i<containersSearch.length;i++) {
76.			if (!containersSearch[i].productName.match(this.value.toLowerCase()))
77.				toStartTable.push(containersSearch[i]);
78.		}
79.		moveToSearchResults();
80.		moveToStartTable();
81.		this.remember = this.value;
82.	}
83.	
84.	function moveToSearchResults() {
85.		while (toSearchResults.length) 	{
86.			var node = toSearchResults.shift();
87.			if (!node.parentNode || node.parentNode.nodeName != 'TBODY') continue;
88.			checkAmountOfCells(node,4);
89.			document.getElementById('searchResults').appendChild(node);
90.		}
91.	}
92.	
93.	function moveToStartTable() {
94.		while (toStartTable.length) {
95.			var node = toStartTable.shift();
96.			if (!node.parentNode || node.parentNode.nodeName != 'TBODY') continue;
97.			checkAmountOfCells(node,4);
98.			var location = document.getElementById('marker'+node.productName);
99.			document.getElementById('startTable').insertBefore(node,location);
100.		}
101.	
102.	}
103.	
104.	/* ORDER */
105.	
106.	function orderSandwich() {
107.		if (!this.remember)
108.			this.remember = '';
109.		if (this.value == this.remember) return;	
110.		this.value = this.value.replace(/ /,'');
111.		var amount = this.value * 1;
112.		if (isNaN(amount) || amount == 0)
113.			removeFromOrder(this);
114.		else
115.			moveToOrder(this);
116.		this.remember = this.value;
117.	}
118.	
119.	function moveToOrder(obj) {
120.		obj = obj.parentNode.parentNode;
121.		obj.className = 'highlight';
122.		obj.ordered = true;
123.		if (obj.parentNode.id != 'ordered')
124.			toOrderTable.push(obj);
125.		calculateTotalPrice();
126.		addExtraButton();
127.	}
128.	
129.	function removeSandwich() {
130.		removeFromOrder(this)
131.		if (this.parentNode.parentNode.parentNode.id == 'ordered')
132.			moveToStartTable();
133.	}
134.	
135.	function removeFromOrder(obj) {
136.		obj = obj.parentNode.parentNode;
137.		obj.className = '';
138.		obj.ordered = false;
139.		obj.getElementsByTagName('input')[0].value = '';
140.		toStartTable.push(obj);
141.		calculateTotalPrice();
142.		return false;
143.	}
144.	
145.	function moveToOrderTable() {
146.		var node = this.parentNode.parentNode;
147.		checkAmountOfCells(node,3);
148.		document.getElementById('ordered').appendChild(node);
149.		calculateTotalPrice();
150.		window.scrollTo(0,0);
151.		return false;
152.	}
153.	
154.	function moveAllToOrderTable() {
155.		while (toOrderTable.length) {
156.			var node = toOrderTable.shift();
157.			if (!node.ordered) continue;
158.			if (!node.parentNode || node.parentNode.nodeName != 'TBODY') continue;
159.			checkAmountOfCells(node,3);
160.			document.getElementById('ordered').appendChild(node);
161.		}
162.		calculateTotalPrice();
163.		removeButton();
164.		window.scrollTo(0,0);
165.	}
166.	
167.	function checkAmountOfCells(obj,required) {
168.		var cells = obj.getElementsByTagName('td');
169.		var current = cells.length;
170.		if (required == 4 && current == 3) {
171.			var newCell = extraTD.cloneNode(true);
172.			if (obj.description)
173.				newCell.innerHTML = obj.description;
174.			obj.appendChild(newCell);
175.		}
176.		else if (required == 3 && current == 4) {
177.			var tmp = cells[current-1];
178.			if (tmp.hasChildNodes() && tmp.firstChild.nodeValue)
179.				obj.description = tmp.firstChild.nodeValue;
180.			obj.removeChild(cells[current - 1]);
181.		}
182.	}
183.	
184.	function addExtraButton() {
185.		document.getElementById('extraButtonTarget').appendChild(extraButton);
186.	}
187.	
188.	function removeButton() {
189.		if (extraButton.parentNode)
190.			extraButton.parentNode.removeChild(extraButton);
191.	}
192.	
193.	function calculateTotalPrice() {
194.		var price = 0;
195.		var containers = document.getElementById('ordered').getElementsByTagName('tr');
196.		for (var i=1;i<containers.length;i++) {
197.			var searchFields = containers[i].getElementsByTagName('input');
198.			var amount = searchFields[0].value;
199.			price += containers[i].price * amount;
200.		}
201.		document.getElementById('priceDisplay').innerHTML = createReadablePrice(price);
202.	}
203.	
204.	function createReadablePrice(price) {
205.		price = price.toFixed(2);
206.		price = price.replace(/\./,',');
207.		return price;
208.	}
209.	
210.	/** PUSH AND SHIFT FOR IE5 **/
211.	
212.	function Array_push() {
213.		var A_p = 0
214.		for (A_p = 0; A_p < arguments.length; A_p++) {
215.			this[this.length] = arguments[A_p]
216.		}
217.		return this.length
218.	}
219.	
220.	if (typeof Array.prototype.push == "undefined") {
221.		Array.prototype.push = Array_push
222.	}
223.	
224.	function Array_shift() {
225.		var A_s = 0
226.		var response = this[0]
227.		for (A_s = 0; A_s < this.length-1; A_s++) {
228.			this[A_s] = this[A_s + 1]
229.		}
230.		this.length--
231.		return response
232.	}
233.	
234.	if (typeof Array.prototype.shift == "undefined") {
235.		Array.prototype.shift = Array_shift
236.	}
237.	