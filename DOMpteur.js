/*
 * DOMpteur
 *
 * Copyright 2013, Simon Waldherr - http://simon.waldherr.eu/
 * Released under the MIT Licence
 * http://simon.waldherr.eu/license/mit/
 *
 * Github:  https://github.com/simonwaldherr/DOMpteur/
 * Version: 0.2.1
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
    addHeadElement: function (content, id, mode) {
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
          }
        } else {
          newid = 'dompteur' + parseInt(Date.now() / 1000, 10);
          if (content.indexOf('{') !== -1) {
            ele = document.createElement(mode);
            ele.innerHTML = content;
          } else {
            if (mode === 'style') {
              ele = document.createElement('link');
              ele.href = content;
              ele.rel = "stylesheet";
              ele.type = "text/css";
            } else {
              ele = document.createElement('script');
              ele.src = content;
              ele.type = "text/javascript";
            }
          }
          ele.id = newid;
          document.getElementsByTagName('head')[0].appendChild(ele);
        }
        if (newid !== undefined) {
          return newid;
        }
        return id;
      }
    },
    addCSS : function (content, id) {
      "use strict";
      return dompteur.addHeadElement(content, id, 'style');
    },
    addJS : function (content, id) {
      "use strict";
      return dompteur.addHeadElement(content, id, 'script');
    },
    setDOMReady : function () {
      "use strict";
      dompteur.domready = true;
    },
    getXbyX : function (arg) {
      "use strict";
      var mode = arg.charAt(0),
        matches = dompteur.matches[mode];
      return (document[matches](arg.substr(1)));
    }
  },
  $,
  onDOMReady;

$ = ($ !== undefined) ? $ : dompteur.getXbyX;

onDOMReady = (onDOMReady !== undefined) ? onDOMReady : function (callback) {
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

Object.prototype.encodeHTML = Object.prototype.encodeIt !== undefined ? Object.prototype.encodeIt : function () {
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
    --i;
  }
};

NodeList.prototype.forEach = NodeList.prototype.forEach !== undefined ? NodeList.prototype.forEach : Array.prototype.forEach;

Element.prototype.find = Element.prototype.find !== undefined ? Element.prototype.find : Element.prototype.querySelectorAll;

Element.prototype.innerTEXT = Element.prototype.innerTEXT !== undefined ? Element.prototype.innerTEXT : Element.prototype.textContent;

