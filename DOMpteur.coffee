# DOMpteur
#
# Copyright 2013, Simon Waldherr - http://simon.waldherr.eu/
# Released under the MIT Licence - http://simon.waldherr.eu/license/mit/
#
# Github:  https://github.com/simonwaldherr/DOMpteur/
# Version: 0.2.2

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

  addHeadElement: (content, id, mode) ->
    "use strict"
    newid = undefined
    ele = undefined
    selid = document.getElementById(id)
    if typeof content isnt "Object"
      if id isnt `undefined`
        if selid isnt null
          if selid.parentNode.tagName is "head"
            if content.indexOf("{") isnt -1
              ele = document.getElementById(id)  if (selid.getAttribute("href") is `undefined`) and (selid.getAttribute("src") is `undefined`) and (selid.tagName is mode)
              return false
      else
        newid = "dompteur" + parseInt(Date.now() / 1000, 10)
        if content.indexOf("{") isnt -1
          ele = document.createElement(mode)
          ele.innerHTML = content
        else
          if mode is "style"
            ele = document.createElement("link")
            ele.href = content
            ele.rel = "stylesheet"
            ele.type = "text/css"
          else
            ele = document.createElement("script")
            ele.src = content
            ele.type = "text/javascript"
        ele.id = newid
        document.getElementsByTagName("head")[0].appendChild ele
      return newid  if newid isnt `undefined`
      id

  addCSS: (content, id) ->
    "use strict"
    dompteur.addHeadElement content, id, "style"

  addJS: (content, id) ->
    "use strict"
    dompteur.addHeadElement content, id, "script"

  setDOMReady: ->
    "use strict"
    dompteur.domready = true

  workOnCSS: (ele, callbackele, callbacklist, replaceobject) ->
    "use strict"
    style = undefined
    replObj = {}
    cblist = false
    cbele = false
    i = undefined
    l = undefined
    prop = undefined
    val = undefined
    returnO = {}
    cbele = callbackele  if callbackele isnt null  if callbackele isnt `undefined`
    cblist = callbacklist  if callbacklist isnt null  if callbacklist isnt `undefined`
    replObj = replaceobject  if replaceobject isnt null  if replaceobject isnt `undefined`

    #ff and webkit
    if window.getComputedStyle
      style = window.getComputedStyle(ele, null)
      i = 0
      l = style.length

      while i < l
        prop = style[i]
        val = style.getPropertyValue(prop)
        cbele prop, style.getPropertyValue(prop)  if cbele isnt false
        if replObj[prop] isnt `undefined`
          ele.style[prop] = replObj[prop]
        else ele.style[prop] = ""  if replObj.all isnt `undefined`
        returnO[prop] = val
        i += 1
      cblist returnO  if cblist isnt false
      return returnO

    #ie and old opera
    if ele.currentStyle
      style = ele.currentStyle
      for prop of style
        if style[prop] isnt `undefined`
          if style[prop].length > 3
            cbele prop, style[prop]  if cbele isnt false
            if replObj[prop] isnt `undefined`
              ele.style[prop] = replObj[prop]
            else ele.style[prop] = ""  if replObj.all isnt `undefined`
            returnO[prop] = style[prop]
      cblist returnO  if cblist isnt false
      return returnO

    #fallback
    style = ele.style
    if typeof style is "object"
      for prop of style
        if typeof style[prop] isnt "function"
          cbele prop, style[prop]  if cbele isnt false
          if replObj[prop] isnt `undefined`
            ele.style[prop] = replObj[prop]
          else ele.style[prop] = ""  if replObj.all isnt `undefined`
          returnO[prop] = style[prop]
      cblist returnO  if cblist isnt false
      return returnO
    false

  getXbyX: (arg) ->
    "use strict"
    mode = arg.charAt(0)
    matches = dompteur.matches[mode]
    document[matches] arg.substr(1)

  onDOMReady: (callback) ->
    "use strict"
    if dompteur.domready is false
      if window.addEventListener
        window.addEventListener "DOMContentLoaded", dompteur.setDOMReady, false
        window.addEventListener "DOMContentLoaded", callback, false
      else
        window.attachEvent "onload", dompteur.setDOMReady
        window.attachEvent "onload", callback
    else
      callback()

$ = undefined
onDOMReady = undefined
$ = (if ($ isnt `undefined`) then $ else dompteur.getXbyX)
onDOMReady = (if (onDOMReady isnt `undefined`) then onDOMReady else dompteur.onDOMReady)
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
Object::setData = (if Object::setData isnt `undefined` then Object::setData else (arg, data) ->
  "use strict"
  @setAttribute "data-" + arg, data
)
Object::addHTML = (if Object::addHTML isnt `undefined` then Object::addHTML else (arg) ->
  "use strict"
  @innerHTML += arg
)
Object::setHTML = (if Object::setHTML isnt `undefined` then Object::setHTML else (arg) ->
  "use strict"
  @innerHTML = arg
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
Object::encodeHTML = (if Object::encodeHTML isnt `undefined` then Object::encodeHTML else ->
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
    i -= 1
)
NodeList::forEach = (if NodeList::forEach isnt `undefined` then NodeList::forEach else Array::forEach)
Element::find = (if Element::find isnt `undefined` then Element::find else Element::querySelectorAll)
Element::innerTEXT = (if Element::innerTEXT isnt `undefined` then Element::innerTEXT else Element::textContent)
Element::getCSS = (if Element::getCSS isnt `undefined` then Element::getCSS else ->
  "use strict"
  dompteur.workOnCSS this, null, null
)
Element::clearCSS = (if Element::clearCSS isnt `undefined` then Element::clearCSS else ->
  "use strict"
  dompteur.workOnCSS this, null, null,
    all: true

)
Element::setCSS = (if Element::setCSS isnt `undefined` then Element::setCSS else (cssobject) ->
  "use strict"
  dompteur.workOnCSS this, null, null, cssobject
)
