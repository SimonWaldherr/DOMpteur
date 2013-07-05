#
# DOMpteur
#
# Copyright 2013, Simon Waldherr - http://simon.waldherr.eu/
# Released under the MIT Licence
# http://simon.waldherr.eu/license/mit/
#
# Github:  https://github.com/simonwaldherr/DOMpteur/
# Version: 0.1.0
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
