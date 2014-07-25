/*
 * DOMpteur
 *
 * Copyright 2013, Simon Waldherr - http://simon.waldherr.eu/
 * Released under the MIT Licence - http://simon.waldherr.eu/license/mit/
 *
 * Github:  https://github.com/simonwaldherr/DOMpteur/
 * Version: 0.2.4
 */

/*jslint browser: true, indent: 2 */
/*global Object, Element, NodeList */
/*

var about = {
  "dompteur.domready"       : ["var",      "true if dom is ready"],
  "dompteur.htmldecode"     : ["function", "decode html"],
  "dompteur.htmlencode"     : ["function", "encode html"],
  "dompteur.toJSON"         : ["function", "convert html/xml to json"],
  "dompteur.addElement"     : ["function", "add style/link/script to head"],
  "dompteur.addCSS"         : ["function", "see above (but only for style/link)"],
  "dompteur.addJS"          : ["function", "see above (but only for script)"],
  "dompteur.setDOMReady"    : ["function", "set dompteur.domready to true"],
  "dompteur.workOnCSS"      : ["function", "calls a callback function for each style or for a stylelist"],
  "dompteur.getXbyX"        : ["function", "get Element(s) by id/name/class/tag/..."],
  "dompteur.onDOMReady"     : ["function", "calls setDOMReady and a definable callback on DOM ready"],
  "$"                       : ["function", "short version of dompteur.getXbyX if $ is undefined"],
  "onDOMReady"              : ["function", "short version of dompteur.onDOMReady"],
  "Object.$"                : ["function", "same as $ but as function of an Object"],
  "Object.getData"          : ["function", "get Data-Attribute of an Element"],
  "Object.setData"          : ["function", "set Data-Attribute of an Element"],
  "Object.addHTML"          : ["function", "add HTML to an Element"],
  "Object.setHTML"          : ["function", "replace HTML of an Element"],
  "Object.addViaJSON"       : ["function", "build HTML via JSON and a build-callback function"],
  "Object.addViaXML"        : ["function", "build HTML via XML and a build-callback function"],
  "Object.addAsFirst"       : ["function", "add Element as first Node of Object"],
  "Object.addAsLast"        : ["function", "add Element as last Node of Object"],
  "Object.encodeHTML"       : ["function", "returns the encoded version of an Object or String"],
  "String.decodeHTML"       : ["function", "returns the decoded version of a String"],
  "NodeList.first"          : ["function", "returns the first Node"],
  "NodeList.last"           : ["function", "returns the last Node"],
  "NodeList.forEach"        : ["function", "calls a callback function for each Node"],
  "Element.find"            : ["function", "find and returns a Node from an Element"],
  "Element.innerTEXT"       : ["function", "returns the inner text of an Element"],
};

*/

var dompteur = {
    matches : {
      '#': 'getElementById',
      '@': 'getElementsByName',
      ' ': 'getElementsByTagName',
      '=': 'getElementsByTagName',
      '.': 'getElementsByClassName',
      '*': 'querySelectorAll'
    },
    elementcount : {
      i: 1
    },
    timeoutReference : false,
    domready : false,
    defaultTagName : 'p',
    htmldecode: function (string) {
      "use strict";
      var div = document.createElement('div');
      div.innerHTML = string;
      string = div.innerText || div.textContent;
      div = undefined;
      return string;
    },
    htmlencode: function (string) {
      "use strict";
      var div = document.createElement('div');
      div.appendChild(document.createTextNode(string));
      string = div.innerHTML;
      div = undefined;
      return string;
    },
    toJSON: function (xml) {
      "use strict";
      var isObject = true,
        json = {},
        parseNode,
        xmlroot;

      if (typeof xml === 'string') {
        xmlroot = document.createElement('div');
        xmlroot.innerHTML = xml;
        xml = xmlroot;
        isObject = false;
      }
      parseNode = function (node, obj) {
        var nodeName,
          lname,
          value,
          attr,
          i,
          j,
          k,
          p;

        if (node.nodeType === 3) {
          if (!node.nodeValue.match(/[\S]{2,}/)) {
            return;
          }
          obj.$ = node.nodeValue;
        } else if (node.nodeType === 1) {
          p = {};
          nodeName = node.nodeName;
          for (i = 0; node.attributes && i < node.attributes.length; i += 1) {
            attr = node.attributes[i];
            lname = attr.localName;
            value = attr.nodeValue;
            p["@" + lname] = value;
          }
          if (obj[nodeName] instanceof Array) {
            obj[nodeName].push(p);
          } else if (obj[nodeName] instanceof Object) {
            obj[nodeName] = [obj[nodeName], p];
          } else {
            obj[nodeName] = p;
          }
          for (j = 0; j < node.childNodes.length; j += 1) {
            parseNode(node.childNodes[j], p);
          }
        } else if (node.nodeType === 9) {
          for (k = 0; k < node.childNodes.length; k += 1) {
            parseNode(node.childNodes[k], obj);
          }
        }
      };

      parseNode(xml, json);
      if (!isObject) {
        json = json.DIV;
      }

      return json;
    },
    addElement: function (content, id, mode) {
      "use strict";
      var newid,
        ele,
        selid = document.getElementById(id);

      if (typeof content !== 'Object') {
        if (id !== undefined) {
          if (selid !== null) {
            if (selid.parentNode.tagName === 'head') {
              if (content.indexOf('{') !== -1) {
                if ((selid.getAttribute('href') === undefined) && (selid.getAttribute('src') === undefined) && (selid.tagName === mode)) {
                  ele = document.getElementById(id);
                }
                return false;
              }
            }
          } else if (mode === 'div') {
            ele = document.getElementById(id);
          }
        } else {
          newid = 'dompteur_' + dompteur.elementcount.i;
          dompteur.elementcount.i += 1;
          if (content.indexOf('{') !== -1) {
            ele = document.createElement(mode);
            ele.innerHTML = content;
          } else {
            if (mode === 'style') {
              ele = document.createElement('link');
              ele.href = content;
              ele.rel = "stylesheet";
              ele.type = "text/css";
            } else if (mode === 'script') {
              ele = document.createElement('script');
              ele.src = content;
              ele.type = "text/javascript";
            } else {
              ele = document.createElement('div');
            }
          }
          ele.id = newid;
          if (mode === 'div') {
            document.getElementsByTagName('body')[0].appendChild(ele);
          } else {
            document.getElementsByTagName('head')[0].appendChild(ele);
          }
        }
        if (newid !== undefined) {
          return newid;
        }
        return id;
      }
    },
    addCSS : function (content, id) {
      "use strict";
      return dompteur.addElement(content, id, 'style');
    },
    addJS : function (content, id) {
      "use strict";
      return dompteur.addElement(content, id, 'script');
    },
    addDiv : function (content, id) {
      "use strict";
      return dompteur.addElement(content, id, 'div');
    },
    setDOMReady : function () {
      "use strict";
      dompteur.domready = true;
    },
    workOnCSS : function (ele, callbackele, callbacklist, replaceobject) {
      "use strict";
      var style,
        replObj = {},
        cblist = false,
        cbele = false,
        i,
        l,
        prop,
        val,
        returnO = {};

      if (callbackele !== undefined) {
        if (callbackele !== null) {
          cbele = callbackele;
        }
      }
      if (callbacklist !== undefined) {
        if (callbacklist !== null) {
          cblist = callbacklist;
        }
      }
      if (replaceobject !== undefined) {
        if (replaceobject !== null) {
          replObj = replaceobject;
        }
      }
      //ff and webkit
      if (window.getComputedStyle) {
        style = window.getComputedStyle(ele, null);
        for (i = 0, l = style.length; i < l; i += 1) {
          prop = style[i];
          val = style.getPropertyValue(prop);
          if (cbele !== false) {
            cbele(prop, style.getPropertyValue(prop));
          }
          if (replObj[prop] !== undefined) {
            ele.style[prop] = replObj[prop];
          } else if (replObj.all !== undefined) {
            ele.style[prop] = '';
          }
          returnO[prop] = val;
        }
        if (cblist !== false) {
          cblist(returnO);
        }
        return returnO;
      }
      //ie and old opera
      if (ele.currentStyle) {
        style = ele.currentStyle;
        for (prop in style) {
          if (style[prop] !== undefined) {
            if (style[prop].length > 3) {
              if (cbele !== false) {
                cbele(prop, style[prop]);
              }
              if (replObj[prop] !== undefined) {
                ele.style[prop] = replObj[prop];
              } else if (replObj.all !== undefined) {
                ele.style[prop] = '';
              }
              returnO[prop] = style[prop];
            }
          }
        }
        if (cblist !== false) {
          cblist(returnO);
        }
        return returnO;
      }
      //fallback
      style = ele.style;
      if (typeof style === 'object') {
        for (prop in style) {
          if (typeof style[prop] !== 'function') {
            if (cbele !== false) {
              cbele(prop, style[prop]);
            }
            if (replObj[prop] !== undefined) {
              ele.style[prop] = replObj[prop];
            } else if (replObj.all !== undefined) {
              ele.style[prop] = '';
            }
            returnO[prop] = style[prop];
          }
        }
        if (cblist !== false) {
          cblist(returnO);
        }
        return returnO;
      }
      return false;
    },
    getXbyX : function (arg) {
      "use strict";
      var mode = arg.charAt(0),
        matches = dompteur.matches[mode];

      if (matches !== undefined) {
        return (document[matches](arg.substr(1)));
      }
      return document.querySelectorAll(arg);
    },
    onDOMReady : function (callback) {
      "use strict";
      if (dompteur.domready === false) {
        if (window.addEventListener) {
          window.addEventListener('DOMContentLoaded', dompteur.setDOMReady, false);
          window.addEventListener('DOMContentLoaded', callback, false);
        } else {
          window.attachEvent('onload', dompteur.setDOMReady);
          window.attachEvent('onload', callback);
        }
      } else {
        callback();
      }
    },
    debouncedEventListener : function (element, event, callback) {
      "use strict";
      if (element.addEventListener !== undefined) {
        element.addEventListener(event, function (evt) {
          if (dompteur.timeoutReference) {
            clearTimeout(dompteur.timeoutReference);
          }
          dompteur.timeoutReference = setTimeout(function () {
            callback(evt);
          }, 200);
        }, false);
      } else if (element.attachEvent !== undefined) {
        element.attachEvent("on" + event, function (evt) {
          if (dompteur.timeoutReference) {
            clearTimeout(dompteur.timeoutReference);
          }
          dompteur.timeoutReference = setTimeout(function () {
            callback(evt);
          }, 200);
        });
      } else {
        return false;
      }
    }
  },
  $,
  onDOMReady;

$ = ($ !== undefined) ? $ : dompteur.getXbyX;

onDOMReady = (onDOMReady !== undefined) ? onDOMReady : dompteur.onDOMReady;

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

Object.prototype.setData = Object.prototype.setData !== undefined ? Object.prototype.setData : function (arg, data) {
  "use strict";
  this.setAttribute('data-' + arg, data);
};

Object.prototype.addHTML = Object.prototype.addHTML !== undefined ? Object.prototype.addHTML : function (arg) {
  "use strict";
  this.innerHTML += arg;
};

Object.prototype.setHTML = Object.prototype.setHTML !== undefined ? Object.prototype.setHTML : function (arg) {
  "use strict";
  this.innerHTML = arg;
};

Object.prototype.addViaJSON = Object.prototype.addViaJSON !== undefined ? Object.prototype.addViaJSON : function (json, buildfunction) {
  "use strict";
  this.innerHTML += buildfunction(json);
};

Object.prototype.addViaXML = Object.prototype.addViaXML !== undefined ? Object.prototype.addViaXML : function (xml, buildfunction) {
  "use strict";
  this.innerHTML += buildfunction(dompteur.toJSON(xml));
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

Object.prototype.encodeHTML = Object.prototype.encodeHTML !== undefined ? Object.prototype.encodeHTML : function () {
  "use strict";
  if (typeof this === 'object') {
    return dompteur.htmlencode(this.outerHTML);
  }
  return dompteur.htmlencode(this);
};

String.prototype.decodeHTML = String.prototype.decodeHTML !== undefined ? String.prototype.decodeHTML : function () {
  "use strict";
  return dompteur.htmldecode(this);
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
    i -= 1;
  }
};

NodeList.prototype.forEach = NodeList.prototype.forEach !== undefined ? NodeList.prototype.forEach : Array.prototype.forEach;

Element.prototype.find = Element.prototype.find !== undefined ? Element.prototype.find : Element.prototype.querySelectorAll;

Element.prototype.innerTEXT = Element.prototype.innerTEXT !== undefined ? Element.prototype.innerTEXT : Element.prototype.textContent;

Element.prototype.getCSS = Element.prototype.getCSS !== undefined ? Element.prototype.getCSS : function () {
  "use strict";
  return dompteur.workOnCSS(this, null, null);
};

Element.prototype.clearCSS = Element.prototype.clearCSS !== undefined ? Element.prototype.clearCSS : function () {
  "use strict";
  dompteur.workOnCSS(this, null, null, {'all': true});
  return this;
};

Element.prototype.setCSS = Element.prototype.setCSS !== undefined ? Element.prototype.setCSS : function (cssobject) {
  "use strict";
  dompteur.workOnCSS(this, null, null, cssobject);
  return this;
};

Element.prototype.getPosition = Element.prototype.getPosition !== undefined ? Element.prototype.getPosition : function () {
  "use strict";
  var position = this.getBoundingClientRect(),
    ele = this;

  position.position = this.style.position;
  position.left2 = 0;
  position.top2 = 0;
  while (ele.tagName !== "BODY") {
    position.left2 += ele.offsetLeft + ele.scrollLeft;
    position.top2 += ele.offsetTop + ele.scrollTop;
    ele = ele.offsetParent;
  }

  return position;
};
