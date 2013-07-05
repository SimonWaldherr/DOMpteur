/*
 * DOMpteur
 *
 * Copyright 2013, Simon Waldherr - http://simon.waldherr.eu/
 * Released under the MIT Licence
 * http://simon.waldherr.eu/license/mit/
 *
 * Github:  https://github.com/simonwaldherr/DOMpteur/
 * Version: 0.1.0
 */

/*jslint browser: true, plusplus: true, indent: 2 */
/*global Object, Element, NodeList */

var dompteur = {
    matches : {
      '#': 'getElementById',
      '@': 'getElementsByName',
      ' ': 'getElementsByTagName',
      '=': 'getElementsByTagName',
      '.': 'getElementsByClassName',
      '*': 'querySelectorAll'
    },
    domready : false,
    defaultTagName : 'p'
  },
  $,
  onDOMReady,
  setDOMReady;

$ = ($ !== undefined) ? $ : function (arg) {
  "use strict";
  var mode = arg.charAt(0),
    matches = dompteur.matches[mode];
  return (document[matches](arg.substr(1)));
};

onDOMReady = (onDOMReady !== undefined) ? onDOMReady : function (callback) {
  "use strict";
  if (dompteur.domready === false) {
    if (window.addEventListener) {
      window.addEventListener('DOMContentLoaded', setDOMReady, false);
      window.addEventListener('DOMContentLoaded', callback, false);
    } else {
      window.attachEvent('onload', setDOMReady);
      window.attachEvent('onload', callback);
    }
  } else {
    callback();
  }
};

setDOMReady = (setDOMReady !== undefined) ? setDOMReady : function () {
  "use strict";
  dompteur.domready = true;
};

Object.prototype.$ = Object.prototype.$ !== undefined ? Object.prototype.$ : function (arg) {
  "use strict";
  var mode = arg.charAt(0),
    matches = dompteur.matches[mode];
  return (this[matches](arg.substr(1)));
};

Object.prototype.getData = Object.prototype.getData !== undefined ? Object.prototype.getData : function (arg) {
  "use strict";
  this.getAttribute('data-' + arg);
};

Object.prototype.setData = Object.prototype.setData !== undefined ? Object.prototype.setData : function (arg) {
  "use strict";
  this.setAttribute('data-' + arg);
};

Object.prototype.addHTML = Object.prototype.addHTML !== undefined ? Object.prototype.addHTML : function (arg) {
  "use strict";
  this.innerHTML += arg;
};

Object.prototype.addAsFirst = Object.prototype.addAsFirst !== undefined ? Object.prototype.addAsFirst : function (arg) {
  "use strict";
  var ele;
  if (arg.innerHTML === undefined) {
    ele = arg.tag === undefined ? document.createElement(dompteur.defaultTagName) : document.createElement(arg.tag);
    if (arg.html !== undefined) {
      ele.innerHTML = arg.html;
    } else if (arg.text !== undefined) {
      ele.innerText = arg.text;
    } else {
      ele.innerHTML = '';
    }
  } else {
    ele = arg;
  }
  this.insertBefore(ele, this.firstChild);
  return ele;
};

Object.prototype.addAsLast = Object.prototype.addAsLast !== undefined ? Object.prototype.addAsLast : function (arg) {
  "use strict";
  var ele;
  if (arg.innerHTML === undefined) {
    ele = arg.tag === undefined ? document.createElement(dompteur.defaultTagName) : document.createElement(arg.tag);
    if (arg.html !== undefined) {
      ele.innerHTML = arg.html;
    } else if (arg.text !== undefined) {
      ele.innerText = arg.text;
    } else {
      ele.innerHTML = '';
    }
  } else {
    ele = arg;
  }
  this.appendChild(ele);
  return ele;
};

NodeList.prototype.first = NodeList.prototype.first !== undefined ? NodeList.prototype.first : function () {
  "use strict";
  return this[0];
};

NodeList.prototype.last = NodeList.prototype.last !== undefined ? NodeList.prototype.last : function () {
  "use strict";
  var i = this.length;
  while (i > 0) {
    if (this[i] !== undefined) {
      if (this[i].hasChildNodes()) {
        return this[i];
      }
    }
    --i;
  }
};

NodeList.prototype.forEach = NodeList.prototype.forEach !== undefined ? NodeList.prototype.forEach : Array.prototype.forEach;

Element.prototype.find = Element.prototype.find !== undefined ? Element.prototype.find : Element.prototype.querySelectorAll;

Element.prototype.innerTEXT = Element.prototype.innerTEXT !== undefined ? Element.prototype.innerTEXT : Element.prototype.textContent;

