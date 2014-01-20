1.	var validationErrorMessage = new Object();
2.	validationErrorMessage['required'] = 'This field is required';
3.	validationErrorMessage['numeric'] = 'This field requires a number';
4.	validationErrorMessage['postcode'] = 'This field must hold a Dutch postal code';
5.	validationErrorMessage['pattern'] = 'Pattern incorrect';
6.	validationErrorMessage['email'] = 'Incorrect email address';
7.	
8.	var validationFunctions = new Object();
9.	validationFunctions["required"] = isRequired;
10.	validationFunctions["pattern"] = isPattern;
11.	validationFunctions["postcode"] = isPostCode;
12.	validationFunctions["numeric"] = isnumeric;
13.	validationFunctions["email"] = isEmail;
14.	
15.	function isRequired(formField) {
16.		switch (formField.type) {
17.			case 'text':
18.			case 'textarea':
19.			case 'select-one':
20.				if (formField.value)
21.					return true;
22.				return false;
23.			case 'radio':
24.				var radios = formField.form[formField.name];
25.				for (var i=0;i<radios.length;i++) {
26.					if (radios[i].checked) return true;
27.				}
28.				return false;
29.			case 'checkbox':
30.				return formField.checked;
31.		}	
32.	}
33.	
34.	function isPattern(formField,pattern) {
35.		var pattern = pattern || formField.getAttribute('pattern');
36.		var regExp = new RegExp("^"+pattern+"$","");
37.		var correct = regExp.test(formField.value);
38.		if (!correct && formField.getAttribute('patternDesc'))
39.			correct = formField.getAttribute('patternDesc');
40.		return correct;
41.	}
42.	
43.	function isPostCode(formField) {
44.		return isPattern(formField,"\\d{4}\\s*\\D{2}");
45.	}
46.	
47.	function isnumeric(formField) {
48.		return isPattern(formField,"\\d+");
49.	}
50.	
51.	function isEmail(formField) {
52.		return isPattern(formField,"\\w*@\\w*\.\\w{2,4}")
53.	}
54.	
55.	function emptyFunction() {
56.		return true;
57.	}
58.	
59.	/*********************************/
60.	
61.	var W3CDOM = document.createElement && document.getElementsByTagName;
62.	
63.	function validateForms() {
64.		if (!W3CDOM) return;
65.		var forms = document.forms;
66.		for (var i=0;i<forms.length;i++) {
67.			forms[i].onsubmit = validate;
68.		}
69.	}
70.	
71.	addEventSimple(window,'load',validateForms);
72.	
73.	function validate() {
74.		var els = this.elements;
75.		var validForm = true;
76.		var firstError = null;
77.		for (var i=0;i<els.length;i++) {
78.			if (els[i].removeError)
79.				els[i].removeError();
80.			var req = els[i].getAttribute('validation');
81.			if (!req) continue;
82.			var reqs = req.split(' ');
83.			if (els[i].getAttribute('pattern'))
84.				reqs[reqs.length] = 'pattern';
85.			for (var j=0;j<reqs.length;j++) {
86.				if (!validationFunctions[reqs[j]])
87.					validationFunctions[reqs[j]] = emptyFunction;
88.				var OK = validationFunctions[reqs[j]](els[i]);
89.				if (OK != true) {
90.					var errorMessage = OK || validationErrorMessage[reqs[j]];
91.					writeError(els[i],errorMessage)
92.					validForm = false;
93.					if (!firstError)
94.						firstError = els[i];
95.					break;
96.				}
97.			}
98.		}
99.	
100.		if (!validForm) {
101.			alert("Errors have been found");
102.			location.hash = '#startOfForm';
103.		}
104.		return validForm;
105.		
106.	}
107.	
108.	function writeError(obj,message) {
109.		obj.className += ' errorMessage';
110.		obj.onchange = removeError;
111.		if (obj.errorMessage || obj.parentNode.errorMessage) return;
112.		var errorMessage = document.createElement('label');
113.		errorMessage.className = 'errorMessage';
114.		errorMessage.setAttribute('for',obj.id);
115.		errorMessage.setAttribute('htmlFor',obj.id);
116.		errorMessage.appendChild(document.createTextNode(message));
117.		obj.parentNode.appendChild(errorMessage);
118.		obj.errorMessage = errorMessage;
119.		obj.parentNode.errorMessage = errorMessage;
120.	}
121.	
122.	function removeError() {
123.		this.className = this.className.replace(/errorMessage/,'');
124.		if (this.errorMessage) {
125.			this.parentNode.removeChild(this.errorMessage);
126.			this.errorMessage = null;
127.			this.parentNode.errorMessage = null;
128.		}
129.		this.onchange = null;
130.	}