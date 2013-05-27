1.	var compatible = (document.getElementsByTagName && document.createElement);
2.	
3.	if (compatible)
4.		document.write('<link rel="stylesheet" href="navstyles.css" />')
5.	
6.	function initNavigation() {
7.		var lists = document.getElementsByTagName('ul');
8.		for (var i=0;i<lists.length;i++) {
9.			if (lists[i].className != 'menutree') continue;
10.			lists[i].onmouseover = navMouseOver;
11.			lists[i].onmouseout = navMouseOut;
12.			var listItems = lists[i].getElementsByTagName('li');
13.			for (var j=0;j<listItems.length;j++) {
14.				var test = listItems[j].getElementsByTagName('ul')[0];
15.				if (test) {
16.					listItems[j].firstChild.onfocus = navMouseOver;
17.					listItems[j].relatedItem = test;
18.				}
19.			}
20.		}
21.	}
22.	
23.	var currentlyOpenedMenus = new Array();
24.	var currentlyFocusedItem;
25.	
26.	function navMouseOver(e) {
27.		var evt = e || window.event;
28.		var evtTarget = evt.target || evt.srcElement;
29.		if (evtTarget.nodeName == 'UL') return;
30.		while (evtTarget.nodeName != 'LI')
31.			evtTarget = evtTarget.parentNode;
32.		foldMenuIn(evtTarget);
33.		if (evtTarget.relatedItem && !evtTarget.relatedItem.opened) {
34.			evtTarget.className = 'highlight';
35.			evtTarget.relatedItem.className = 'foldOut';
36.			evtTarget.relatedItem.opened = true;
37.			currentlyOpenedMenus.push(evtTarget.relatedItem);
38.		}
39.	}
40.	
41.	function navMouseOut(e) {
42.		var evt = e || window.event;
43.		var relatedNode = evt.relatedTarget || evt.toElement;
44.		foldMenuIn(relatedNode);
45.	}
46.	
47.	function foldMenuIn(targetNode) {
48.		if (!targetNode) return;
49.		var newCurrentlyOpenedMenus = new Array();
50.		for (var i=0;i<currentlyOpenedMenus.length;i++) {
51.			if (!containsElement(currentlyOpenedMenus[i],targetNode)) {
52.				currentlyOpenedMenus[i].className = '';
53.				currentlyOpenedMenus[i].parentNode.className = '';
54.				currentlyOpenedMenus[i].opened = false;
55.			}
56.			else
57.				newCurrentlyOpenedMenus.push(currentlyOpenedMenus[i]);
58.		}
59.		currentlyOpenedMenus = newCurrentlyOpenedMenus;
60.	}
61.	
62.	function containsElement(obj1,obj2) {
63.		while (obj2.nodeName != 'HTML') {
64.			if (obj2 == obj1) return true;
65.			obj2 = obj2.parentNode;
66.		}
67.		return false;
68.	}
69.	
70.	addEventSimple(window,"load",initNavigation);
71.	
72.	function addEventSimple(obj,evt,fn) {
73.		if (obj.addEventListener)
74.			obj.addEventListener(evt,fn,false);
75.		else if (obj.attachEvent)
76.			obj.attachEvent('on'+evt,fn);
77.	}
78.	
79.	function removeEventSimple(obj,evt,fn) {
80.		if (obj.removeEventListener)
81.			obj.removeEventListener(evt,fn,false);
82.		else if (obj.detachEvent)
83.			obj.detachEvent('on'+evt,fn);
84.	}
85.	
86.	/** PUSH AND SHIFT FOR IE5 **/
87.	
88.	function Array_push() {
89.		var A_p = 0
90.		for (A_p = 0; A_p < arguments.length; A_p++) {
91.			this[this.length] = arguments[A_p]
92.		}
93.		return this.length
94.	}
95.	
96.	if (typeof Array.prototype.push == "undefined") {
97.		Array.prototype.push = Array_push
98.	}
99.	
100.	function Array_shift() {
101.		var A_s = 0
102.		var response = this[0]
103.		for (A_s = 0; A_s < this.length-1; A_s++) {
104.			this[A_s] = this[A_s + 1]
105.		}
106.		this.length--
107.		return response
108.	}
109.	
110.	if (typeof Array.prototype.shift == "undefined") {
111.		Array.prototype.shift = Array_shift
112.	}	