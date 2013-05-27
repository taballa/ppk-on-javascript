1.	var W3CDOM = document.createElement && document.getElementsByTagName;
2.	
3.	window.onload = setMaxLength;
4.	
5.	function setMaxLength() {
6.		if (!W3CDOM) return;
7.		var textareas = document.getElementsByTagName('textarea');
8.		var counter = document.createElement('div');
9.		counter.className = 'counter';
10.		for (var i=0;i<textareas.length;i++) {
11.			if (textareas[i].getAttribute('maxlength')) {
12.				var counterClone = counter.cloneNode(true);
13.				counterClone.innerHTML = '<span>0</span>/'+textareas[i].getAttribute('maxlength');
14.				textareas[i].parentNode.insertBefore(counterClone,textareas[i].nextSibling);
15.				textareas[i].relatedElement = counterClone.getElementsByTagName('span')[0];
16.				textareas[i].onkeyup = textareas[i].onchange = checkMaxLength;
17.				textareas[i].onkeyup();
18.			}
19.		}
20.	}
21.	
22.	function checkMaxLength() {
23.		var maxLength = this.getAttribute('maxlength');
24.		var currentLength = this.value.length;
25.		if (currentLength > maxLength)
26.			this.relatedElement.className = 'toomuch';
27.		else
28.			this.relatedElement.className = '';	
29.		this.relatedElement.firstChild.nodeValue = currentLength;
30.	}