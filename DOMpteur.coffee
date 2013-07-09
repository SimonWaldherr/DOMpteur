#
# DOMpteur
#
# Copyright 2013, Simon Waldherr - http://simon.waldherr.eu/
# Released under the MIT Licence
# http://simon.waldherr.eu/license/mit/
#
# Github:  https://github.com/simonwaldherr/DOMpteur/
# Version: 0.2.0
#

dompteur =
  matches:
    "#": "getElementById"
    "@": "getElementsByName"
    " ": "getElementsByTagName"
    "=": "getElementsByTagName"
    ".": "getElementsByClassName"
    "*": "querySelectorAll"

  domready: false
  defaultTagName: "p"
  htmldecode: (string) ->
    "use strict"
    div = document.createElement("div")
    div.innerHTML = string
    string = div.innerText or div.textContent
    div = `undefined`
    string

  htmlencode: (string) ->
    "use strict"
    div = document.createElement("div")
    div.appendChild document.createTextNode(string)
    string = div.innerHTML
    div = `undefined`
    string

  toJSON: (xml) ->
    "use strict"
    isObject = true
    json = {}
    parseNode = undefined
    xmlroot = undefined
    if typeof xml is "string"
      xmlroot = document.createElement("div")
      xmlroot.innerHTML = xml
      xml = xmlroot
      isObject = false
    parseNode = (node, obj) ->
      nodeName = undefined
      lname = undefined
      value = undefined
      attr = undefined
      i = undefined
      j = undefined
      k = undefined
      p = undefined
      if node.nodeType is 3
        return  unless node.nodeValue.match(/[\S]{2,}/)
        obj.$ = node.nodeValue
      else if node.nodeType is 1
        p = {}
        nodeName = node.nodeName
        i = 0
        while node.attributes and i < node.attributes.length
          attr = node.attributes[i]
          lname = attr.localName
          value = attr.nodeValue
          p["@" + lname] = value
          i += 1
        if obj[nodeName] instanceof Array
          obj[nodeName].push p
        else if obj[nodeName] instanceof Object
          obj[nodeName] = [obj[nodeName], p]
        else
          obj[nodeName] = p
        j = 0
        while j < node.childNodes.length
          parseNode node.childNodes[j], p
          j += 1
      else if node.nodeType is 9
        k = 0
        while k < node.childNodes.length
          parseNode node.childNodes[k], obj
          k += 1

    parseNode xml, json
    json = json.DIV  unless isObject
    json

$ = undefined
onDOMReady = undefined
setDOMReady = undefined
$ = (if ($ isnt `undefined`) then $ else (arg) ->
  "use strict"
  mode = arg.charAt(0)
  matches = dompteur.matches[mode]
  document[matches] arg.substr(1)
)
onDOMReady = (if (onDOMReady isnt `undefined`) then onDOMReady else (callback) ->
  "use strict"
  if dompteur.domready is false
    if window.addEventListener
      window.addEventListener "DOMContentLoaded", setDOMReady, false
      window.addEventListener "DOMContentLoaded", callback, false
    else
      window.attachEvent "onload", setDOMReady
      window.attachEvent "onload", callback
  else
    callback()
)
setDOMReady = (if (setDOMReady isnt `undefined`) then setDOMReady else ->
  "use strict"
  dompteur.domready = true
)
Object::$ = (if Object::$ isnt `undefined` then Object::$ else (arg) ->
  "use strict"
  mode = arg.charAt(0)
  matches = dompteur.matches[mode]
  this[matches] arg.substr(1)
)
Object::getData = (if Object::getData isnt `undefined` then Object::getData else (arg) ->
  "use strict"
  @getAttribute "data-" + arg
)
Object::setData = (if Object::setData isnt `undefined` then Object::setData else (arg) ->
  "use strict"
  @setAttribute "data-" + arg
)
Object::addHTML = (if Object::addHTML isnt `undefined` then Object::addHTML else (arg) ->
  "use strict"
  @innerHTML += arg
)
Object::addViaJSON = (if Object::addViaJSON isnt `undefined` then Object::addViaJSON else (json, buildfunction) ->
  "use strict"
  @innerHTML += buildfunction(json)
)
Object::addViaXML = (if Object::addViaXML isnt `undefined` then Object::addViaXML else (xml, buildfunction) ->
  "use strict"
  @innerHTML += buildfunction(dompteur.toJSON(xml))
)
Object::addAsFirst = (if Object::addAsFirst isnt `undefined` then Object::addAsFirst else (arg) ->
  "use strict"
  ele = undefined
  if arg.innerHTML is `undefined`
    ele = (if arg.tag is `undefined` then document.createElement(dompteur.defaultTagName) else document.createElement(arg.tag))
    if arg.html isnt `undefined`
      ele.innerHTML = arg.html
    else if arg.text isnt `undefined`
      ele.innerText = arg.text
    else
      ele.innerHTML = ""
  else
    ele = arg
  @insertBefore ele, @firstChild
  ele
)
Object::addAsLast = (if Object::addAsLast isnt `undefined` then Object::addAsLast else (arg) ->
  "use strict"
  ele = undefined
  if arg.innerHTML is `undefined`
    ele = (if arg.tag is `undefined` then document.createElement(dompteur.defaultTagName) else document.createElement(arg.tag))
    if arg.html isnt `undefined`
      ele.innerHTML = arg.html
    else if arg.text isnt `undefined`
      ele.innerText = arg.text
    else
      ele.innerHTML = ""
  else
    ele = arg
  @appendChild ele
  ele
)
Object::encodeHTML = (if Object::encodeIt isnt `undefined` then Object::encodeIt else ->
  "use strict"
  return dompteur.htmlencode(@outerHTML)  if typeof this is "object"
  dompteur.htmlencode this
)
String::decodeHTML = (if String::decodeHTML isnt `undefined` then String::decodeHTML else ->
  "use strict"
  dompteur.htmldecode this
)
NodeList::first = (if NodeList::first isnt `undefined` then NodeList::first else ->
  "use strict"
  this[0]
)
NodeList::last = (if NodeList::last isnt `undefined` then NodeList::last else ->
  "use strict"
  i = @length
  while i > 0
    return this[i]  if this[i].hasChildNodes()  if this[i] isnt `undefined`
    --i
)
NodeList::forEach = (if NodeList::forEach isnt `undefined` then NodeList::forEach else Array::forEach)
Element::find = (if Element::find isnt `undefined` then Element::find else Element::querySelectorAll)
Element::innerTEXT = (if Element::innerTEXT isnt `undefined` then Element::innerTEXT else Element::textContent)
