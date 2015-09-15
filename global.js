
var reactMixin = require('./index.js')

let globalRef = this // whatever 'this' is in case there's no browser or Node.js global.
if (window) globalRef = window
else if (global) globalRef = global

global.reactMixin = reactMixin
