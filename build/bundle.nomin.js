module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Webtask = __webpack_require__(2);
	module.exports = Webtask.fromExpress(__webpack_require__(3));


/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports) {

	module.exports = require("webtask-tools");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var logger = __webpack_require__(4);
	var cookieParser = __webpack_require__(5);
	var errorpage = __webpack_require__(6);
	var landingpage = __webpack_require__(9);
	var inputcode = __webpack_require__(10);
	var twilio = __webpack_require__(11);
	var Firebase = __webpack_require__(12);
	var app = __webpack_require__(15)();
	var bodyParser = __webpack_require__(16);
	var vars = __webpack_require__(17);
	var metadata = __webpack_require__(19);
	var min = 100000;
	var max = 999999;
	
	app.use(bodyParser.urlencoded({
	  extended: true
	}));
	
	app.use(function(req, res, next) {
	  vars.setVars(req);
	  next();
	});
	
	app.use('/.extensions', __webpack_require__(20));
	
	
	
	
	app.use(logger('dev'));
	
	app.use(cookieParser());
	
	
	
	app.get('/meta', function(req, res) {
	  res.status(200).send(metadata);
	});
	
	app.get('/', function(req, res) {
	  console.log(JSON.stringify(vars));
	  if (req.query.id && req.query.id !== null) {
	    console.log(req.query.id);
	    Firebase(vars).ref(req.query.id).once("value", function(snapshot) {
	      if (snapshot.val() != null) {
	        if ((new Date()).getTime() - snapshot.val().created_at <= 300000) {
	          var data = snapshot.val();
	          data.state = req.query.state;
	          Firebase(vars).ref(req.query.id).set(data);
	          console.log('updated data');
	          res.header("Content-Type", 'text/html');
	          res.status(200).send(landingpage({
	            title: 'Verify code by Phone',
	            id: req.query.id
	          }));
	        } else {
	          var data = snapshot.val();
	          data.created_at = (new Date()).getTime();
	          data.code = Math.floor(Math.random() * (max - min + 1)) + min;
	          data.state = req.query.state;
	          Firebase(vars).ref(req.query.id).set(data);
	          console.log('updated code 2');
	          res.header("Content-Type", 'text/html');
	          res.status(200).send(landingpage({
	            title: 'Verify code by Phone',
	            id: req.query.id
	          }));
	
	        }
	      } else {
	        res.header("Content-Type", 'text/html');
	        res.status(200).send(errorpage({
	          message: 'Error while getting user data.',
	          error: {
	            'code': 'USER_NOT_FOUND'
	          }
	        }));
	      }
	
	    }, function(errorObject) {
	      if (typeof (errorObject) != 'undefined' && errorObject != null) {
	        console.log('here1');
	        res.header("Content-Type", 'text/html');
	        res.status(200).send(errorpage({
	          message: 'Error while getting user data.',
	          error: {
	            'code': errorObject.code
	          }
	        }));
	      }
	    });
	
	
	  } else {
	    res.header("Content-Type", 'text/html');
	    res.status(200).send(errorpage({
	      message: 'Error while getting user data.',
	      error: {
	        'code': 'User not provided'
	      }
	    }));
	  }
	});
	
	
	app.post('/codefromprovider/*', function(req, res) {
	  console.log('codefromprovider');
	  var pathname = __webpack_require__(28).parse(req.url, true).pathname;
	  var pathparts = pathname.split("/");
	  var data = decodeURIComponent(pathparts[pathparts.length - 1]);
	  console.log(data);
	  Firebase(vars).ref(encodeURIComponent(data)).once("value", function(snapshot) {
	    var twiml = new twilio.TwimlResponse();
	    twiml.say('Hello, ' + snapshot.val().name + ', ' + snapshot.val().code.toString().split('').join(',') + ' is your verification code!', {
	      voice: 'alice',
	      loop: 2
	    });
	
	    // Render the response as XML in reply to the webhook request
	    res.type('text/xml');
	    res.status(200).send(twiml.toString());
	  }, function(errorObject) {
	    if (typeof (errorObject) != 'undefined' && errorObject != null) {
	      console.log('Error');
	
	      var twiml = new twilio.TwimlResponse();
	      twiml.say('Error while getting user data. Code: ' + errorObject.code, {
	        voice: 'alice'
	      });
	
	      // Render the response as XML in reply to the webhook request
	      res.type('text/xml');
	      res.status(200).send(twiml.toString());
	
	    }
	  });
	
	
	
	});
	
	app.post('/', function(req, res) {
	  console.log('In Post');
	  console.log(req);
	  if (req.body.type == 'call') {
	    console.log('call');
	    if (req.body.phone !== '') {
	      Firebase(vars).ref(encodeURIComponent(req.body.id)).once("value", function(snapshot) {
	        var client = __webpack_require__(11)(vars.TWILIO_ID, vars.TWILIO_SECRET);
	        console.log('before call, code: ' + snapshot.val().code);
	        //Place a phone call, and respond with TwiML instructions from the given URL
	        console.log("vars" + vars);
	
	        var client = __webpack_require__(11)(vars.TWILIO_ID, vars.TWILIO_SECRET);
	        var _ = __webpack_require__(29);
	
	        client.incomingPhoneNumbers.list().then(function(data) {
	          client.makeCall({
	            to: req.body.phone, // Any number Twilio can call
	            from: data.incoming_phone_numbers[0].phone_number, // A number you bought from Twilio and can use for outbound communication
	            url: vars.WT_URL + '/codefromprovider/' + encodeURIComponent(req.body.id) // A URL that produces an XML document (TwiML) which contains instructions for the call
	
	          }, function(err, responseData) {
	            if (err) {
	              console.log(err);
	              res.header("Content-Type", 'text/html');
	              res.status(200).send(errorpage({
	                message: 'Error while making the call',
	                error: err
	              }));
	            } else {
	              console.log('after call no error');
	              console.log(snapshot.val().name);
	              res.header("Content-Type", 'text/html');
	              console.log('here1');
	              console.log(vars.WT_URL.split('/')[vars.WT_URL.split('/').length - 1]);
	              res.status(200).send(inputcode({
	                user: {
	                  'name': snapshot.val().name,
	                  'id': req.body.id,
	                  'path': vars.WT_URL.split('/')[vars.WT_URL.split('/').length - 1]
	                }
	              }));
	            }
	
	          });
	        }, function(err) {
	          res.header("Content-Type", 'text/html');
	          res.status(200).send(errorpage({
	            message: 'Error while fetching Phone number from your twilio account',
	            error: err
	          }));
	        });
	
	
	
	
	      }, function(errorObject) {
	        if (typeof (errorObject) != 'undefined' && errorObject != null) {
	          res.header("Content-Type", 'text/html');
	          res.status(200).send(errorpage({
	            message: 'Error while getting user data.',
	            error: {
	              'code': errorObject.code
	            }
	          }));
	        }
	      });
	
	
	
	
	    }
	  }
	
	  if (req.body.type == 'verifycode') {
	
	    console.log('here-verify');
	    console.log(req.body.id);
	    console.log(req.body.code);
	
	    Firebase(vars).ref(encodeURIComponent(req.body.id)).once("value", function(snapshot) {
	      if (req.body.code == snapshot.val().code) {
	        var state = snapshot.val().state;
	
	        res.writeHead(301, {
	          Location: 'https://' + vars.AUTH0_DOMAIN + '/continue?state=' + (state || '')
	        });
	        res.end();
	
	
	      } else {
	        res.status(401);
	        res.render('error', {
	          message: 'The code validation failed',
	          error: {
	            'code': 'failed'
	          }
	        });
	      }
	    }, function(errorObject) {
	      if (typeof (errorObject) != 'undefined' && errorObject != null) {
	        console.log('here1');
	        res.header("Content-Type", 'text/html');
	        res.status(200).send(errorpage({
	          message: 'Error while getting user data.',
	          error: {
	            'code': errorObject.code
	          }
	        }));
	      }
	    });
	
	  }
	
	});
	
	
	
	module.exports = app;


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("morgan");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("cookie-parser");

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(7);
	
	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function (error, message, title) {
	buf.push("<!DOCTYPE html><html><head><title>" + (jade.escape(null == (jade_interp = title) ? "" : jade_interp)) + "</title><link href=\"https://cdn.auth0.com/styleguide/4.8.13/index.min.css\" rel=\"stylesheet\"></head><body><div class=\"logo-branding\"><img src=\"https://styleguide.auth0.com/lib/logos/img/logo-blue.png\" width=\"100px\"></div><div class=\"main container\"><div class=\"row\"><div class=\"col-md-6 col-md-offset-3\"></div><h1>" + (jade.escape(null == (jade_interp = message) ? "" : jade_interp)) + "</h1><h2>" + (jade.escape(null == (jade_interp = error.status) ? "" : jade_interp)) + "</h2><pre>" + (jade.escape((jade_interp = error.code) == null ? '' : jade_interp)) + "</pre></div></div></body></html>");}.call(this,"error" in locals_for_with?locals_for_with.error:typeof error!=="undefined"?error:undefined,"message" in locals_for_with?locals_for_with.message:typeof message!=="undefined"?message:undefined,"title" in locals_for_with?locals_for_with.title:typeof title!=="undefined"?title:undefined));;return buf.join("");
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Merge two attribute objects giving precedence
	 * to values in object `b`. Classes are special-cased
	 * allowing for arrays and merging/joining appropriately
	 * resulting in a string.
	 *
	 * @param {Object} a
	 * @param {Object} b
	 * @return {Object} a
	 * @api private
	 */
	
	exports.merge = function merge(a, b) {
	  if (arguments.length === 1) {
	    var attrs = a[0];
	    for (var i = 1; i < a.length; i++) {
	      attrs = merge(attrs, a[i]);
	    }
	    return attrs;
	  }
	  var ac = a['class'];
	  var bc = b['class'];
	
	  if (ac || bc) {
	    ac = ac || [];
	    bc = bc || [];
	    if (!Array.isArray(ac)) ac = [ac];
	    if (!Array.isArray(bc)) bc = [bc];
	    a['class'] = ac.concat(bc).filter(nulls);
	  }
	
	  for (var key in b) {
	    if (key != 'class') {
	      a[key] = b[key];
	    }
	  }
	
	  return a;
	};
	
	/**
	 * Filter null `val`s.
	 *
	 * @param {*} val
	 * @return {Boolean}
	 * @api private
	 */
	
	function nulls(val) {
	  return val != null && val !== '';
	}
	
	/**
	 * join array as classes.
	 *
	 * @param {*} val
	 * @return {String}
	 */
	exports.joinClasses = joinClasses;
	function joinClasses(val) {
	  return (Array.isArray(val) ? val.map(joinClasses) :
	    (val && typeof val === 'object') ? Object.keys(val).filter(function (key) { return val[key]; }) :
	    [val]).filter(nulls).join(' ');
	}
	
	/**
	 * Render the given classes.
	 *
	 * @param {Array} classes
	 * @param {Array.<Boolean>} escaped
	 * @return {String}
	 */
	exports.cls = function cls(classes, escaped) {
	  var buf = [];
	  for (var i = 0; i < classes.length; i++) {
	    if (escaped && escaped[i]) {
	      buf.push(exports.escape(joinClasses([classes[i]])));
	    } else {
	      buf.push(joinClasses(classes[i]));
	    }
	  }
	  var text = joinClasses(buf);
	  if (text.length) {
	    return ' class="' + text + '"';
	  } else {
	    return '';
	  }
	};
	
	
	exports.style = function (val) {
	  if (val && typeof val === 'object') {
	    return Object.keys(val).map(function (style) {
	      return style + ':' + val[style];
	    }).join(';');
	  } else {
	    return val;
	  }
	};
	/**
	 * Render the given attribute.
	 *
	 * @param {String} key
	 * @param {String} val
	 * @param {Boolean} escaped
	 * @param {Boolean} terse
	 * @return {String}
	 */
	exports.attr = function attr(key, val, escaped, terse) {
	  if (key === 'style') {
	    val = exports.style(val);
	  }
	  if ('boolean' == typeof val || null == val) {
	    if (val) {
	      return ' ' + (terse ? key : key + '="' + key + '"');
	    } else {
	      return '';
	    }
	  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
	    if (JSON.stringify(val).indexOf('&') !== -1) {
	      console.warn('Since Jade 2.0.0, ampersands (`&`) in data attributes ' +
	                   'will be escaped to `&amp;`');
	    };
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will eliminate the double quotes around dates in ' +
	                   'ISO form after 2.0.0');
	    }
	    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
	  } else if (escaped) {
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will stringify dates in ISO form after 2.0.0');
	    }
	    return ' ' + key + '="' + exports.escape(val) + '"';
	  } else {
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will stringify dates in ISO form after 2.0.0');
	    }
	    return ' ' + key + '="' + val + '"';
	  }
	};
	
	/**
	 * Render the given attributes object.
	 *
	 * @param {Object} obj
	 * @param {Object} escaped
	 * @return {String}
	 */
	exports.attrs = function attrs(obj, terse){
	  var buf = [];
	
	  var keys = Object.keys(obj);
	
	  if (keys.length) {
	    for (var i = 0; i < keys.length; ++i) {
	      var key = keys[i]
	        , val = obj[key];
	
	      if ('class' == key) {
	        if (val = joinClasses(val)) {
	          buf.push(' ' + key + '="' + val + '"');
	        }
	      } else {
	        buf.push(exports.attr(key, val, false, terse));
	      }
	    }
	  }
	
	  return buf.join('');
	};
	
	/**
	 * Escape the given string of `html`.
	 *
	 * @param {String} html
	 * @return {String}
	 * @api private
	 */
	
	var jade_encode_html_rules = {
	  '&': '&amp;',
	  '<': '&lt;',
	  '>': '&gt;',
	  '"': '&quot;'
	};
	var jade_match_html = /[&<>"]/g;
	
	function jade_encode_char(c) {
	  return jade_encode_html_rules[c] || c;
	}
	
	exports.escape = jade_escape;
	function jade_escape(html){
	  var result = String(html).replace(jade_match_html, jade_encode_char);
	  if (result === '' + html) return html;
	  else return result;
	};
	
	/**
	 * Re-throw the given `err` in context to the
	 * the jade in `filename` at the given `lineno`.
	 *
	 * @param {Error} err
	 * @param {String} filename
	 * @param {String} lineno
	 * @api private
	 */
	
	exports.rethrow = function rethrow(err, filename, lineno, str){
	  if (!(err instanceof Error)) throw err;
	  if ((typeof window != 'undefined' || !filename) && !str) {
	    err.message += ' on line ' + lineno;
	    throw err;
	  }
	  try {
	    str = str || __webpack_require__(8).readFileSync(filename, 'utf8')
	  } catch (ex) {
	    rethrow(err, null, lineno)
	  }
	  var context = 3
	    , lines = str.split('\n')
	    , start = Math.max(lineno - context, 0)
	    , end = Math.min(lines.length, lineno + context);
	
	  // Error context
	  var context = lines.slice(start, end).map(function(line, i){
	    var curr = i + start + 1;
	    return (curr == lineno ? '  > ' : '    ')
	      + curr
	      + '| '
	      + line;
	  }).join('\n');
	
	  // Alter exception message
	  err.path = filename;
	  err.message = (filename || 'Jade') + ':' + lineno
	    + '\n' + context + '\n\n' + err.message;
	  throw err;
	};
	
	exports.DebugItem = function DebugItem(lineno, filename) {
	  this.lineno = lineno;
	  this.filename = filename;
	}


/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(7);
	
	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function (id, title) {
	buf.push("<!DOCTYPE html><html><head><title>" + (jade.escape(null == (jade_interp = title) ? "" : jade_interp)) + "</title><link href=\"https://cdn.auth0.com/styleguide/4.8.13/index.min.css\" rel=\"stylesheet\"></head><body><div class=\"logo-branding\"><img src=\"https://styleguide.auth0.com/lib/logos/img/logo-blue.png\" width=\"100px\"></div><div class=\"main container\"><div class=\"row\"><div class=\"col-md-6 col-md-offset-3\"><h1 class=\"display-4 m-b-2\">Call to Verify</h1><p>Please enter your phone number</p><!-- phone form--><form method=\"POST\" action=\"/7c53f537927a4c2f3be8690e07505954\"><div class=\"form-group\"><label for=\"phone\">Phone Number:</label><input id=\"phone\" name=\"phone\" type=\"tel\" placeholder=\"+1777-777-7777\" required class=\"form-control\"><input id=\"type\" name=\"type\" type=\"hidden\" value=\"call\" class=\"form-control\"><input id=\"id\" name=\"id\" type=\"hidden\"" + (jade.attr("value", '' + (id) + '', true, true)) + " class=\"form-control\"></div><button type=\"submit\" class=\"btn btn-primary\">Call me</button></form></div></div></div></body></html>");}.call(this,"id" in locals_for_with?locals_for_with.id:typeof id!=="undefined"?id:undefined,"title" in locals_for_with?locals_for_with.title:typeof title!=="undefined"?title:undefined));;return buf.join("");
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(7);
	
	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function (title, user) {
	buf.push("<!DOCTYPE html><html><head><title>" + (jade.escape(null == (jade_interp = title) ? "" : jade_interp)) + "</title><link href=\"https://cdn.auth0.com/styleguide/4.8.13/index.min.css\" rel=\"stylesheet\"></head><body><div class=\"logo-branding\"><img src=\"https://styleguide.auth0.com/lib/logos/img/logo-blue.png\" width=\"100px\"></div><div class=\"main container\"><div class=\"row\"><div class=\"col-md-6 col-md-offset-3\"><h1 class=\"display-4 m-b-2\">Enter the code</h1><p>Hi " + (jade.escape((jade_interp = user.name) == null ? '' : jade_interp)) + "</p><p>Enter your voice call verification code</p><form method=\"POST\" action=\"/7c53f537927a4c2f3be8690e07505954\"><div class=\"form-group\"><label for=\"code\">Code:</label><input id=\"code\" name=\"code\" type=\"text\" placeholder=\"Enter your code\" required class=\"form-control\"><input id=\"type\" name=\"type\" type=\"hidden\" value=\"verifycode\" class=\"form-control\"><input id=\"id\" name=\"id\" type=\"hidden\"" + (jade.attr("value", '' + (user.id) + '', true, true)) + " class=\"form-control\"></div><button type=\"submit\" class=\"btn btn-primary\">Verify</button></form></div></div></div></body></html>");}.call(this,"title" in locals_for_with?locals_for_with.title:typeof title!=="undefined"?title:undefined,"user" in locals_for_with?locals_for_with.user:typeof user!=="undefined"?user:undefined));;return buf.join("");
	}

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("twilio");

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	
	function FirebaseDatabase(vars) {
	
	  var firebase = __webpack_require__(13);
	  var uuid = __webpack_require__(14);
	  console.log("firebase");
	  console.log(vars.FB_PRIVATE_KEY);
	  var svcAccount = {
	    projectId: vars.FB_PROJECT_ID,
	    clientEmail: vars.FB_CLIENT_EMAIL,
	    privateKey: vars.FB_PRIVATE_KEY.toString('utf8').replace(/\\n/g, '\n')
	  }
	
	  console.log(svcAccount);
	
	  var FbApp = firebase.initializeApp({
	    serviceAccount: svcAccount,
	    databaseURL: vars.FB_DB_URL
	  }, '"' + uuid.v4() + '"');
	  return FbApp.database();
	}
	module.exports = FirebaseDatabase;


/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = require("firebase");

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = require("uuid");

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = require("body-parser");

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	
	var env = {
	  setVars: setEnvironment
	};
	
	function setEnvironment(req) {
	  if (req.webtaskContext != null) {
	
	    env.TWILIO_ID = req.webtaskContext.data.TWILIO_ID;
	    env.TWILIO_SECRET = req.webtaskContext.data.TWILIO_SECRET;
	    env.AUTH0_DOMAIN = req.webtaskContext.data.AUTH0_DOMAIN;
	    env.WT_URL = req.webtaskContext.data.WT_URL;
	    env.FB_PROJECT_ID = req.webtaskContext.data.FB_PROJECT_ID;
	    env.FB_CLIENT_EMAIL = req.webtaskContext.data.FB_CLIENT_EMAIL;
	    env.FB_PRIVATE_KEY = req.webtaskContext.data.FB_PRIVATE_KEY;
	    env.FB_DB_URL = req.webtaskContext.data.FB_DB_URL;
	
	  } else {
	    __webpack_require__(18).config();
	    env.TWILIO_ID = process.env.TWILIO_ID;
	    env.TWILIO_SECRET = process.env.TWILIO_SECRET;
	    env.AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
	    env.WT_URL = process.env.WT_URL;
	    env.FB_PROJECT_ID = process.env.FB_PROJECT_ID
	    env.FB_CLIENT_EMAIL = process.env.FB_CLIENT_EMAIL
	    env.FB_PRIVATE_KEY = process.env.FB_PRIVATE_KEY
	    env.FB_DB_URL = process.env.data.FB_DB_URL;
	
	
	  }
	}
	
	
	module.exports = env;


/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = require("dotenv");

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = {
		"title": "Voice Based MFA",
		"name": "voice-mfa",
		"version": "2.0.0",
		"author": "pushp.abrol@auth0.com",
		"description": "Nothing",
		"type": "application",
		"logoUrl": "https://cdn.auth0.com/extensions/custom-social-connections/assets/logo.png",
		"keywords": [
			"auth0",
			"extension"
		],
		"auth0": {
			"createClient": true,
			"scopes": "create:rules read:rules delete:rules",
			"onInstallPath": "/.extensions/on-install",
			"onUninstallPath": "/.extensions/on-uninstall",
			"onUpdatePath": "/.extensions/on-update"
		},
		"secrets": {
			"TWILIO_ID": {
				"description": "Twilio Id to use for calling via Phone",
				"required": true
			},
			"TWILIO_SECRET": {
				"description": "Twilio Secret",
				"required": true
			},
			"FB_PROJECT_ID": {
				"description": "Firebase Service Account Project Id",
				"required": true
			},
			"FB_CLIENT_EMAIL": {
				"description": "Firebase Service Account Cleint Email",
				"required": true
			},
			"FB_PRIVATE_KEY": {
				"description": "Private Key",
				"required": true
			},
			"FB_DB_URL": {
				"description": "Firebase Database Url",
				"required": true
			}
		}
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var express = __webpack_require__(15);
	var Request = __webpack_require__(21);
	var ManagementClient = __webpack_require__(22).ManagementClient;
	var jwt = __webpack_require__(23);
	var hooks = express.Router();
	var URLJoin = __webpack_require__(24);
	var auth0 = __webpack_require__(25);
	var vars = __webpack_require__(17);
	var rulefuncbody = __webpack_require__(26);
	module.exports = hooks;
	
	function validateJwt(path) {
	  return function(req, res, next) {
	    console.log('jwt')
	    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
	      var token = req.headers.authorization.split(' ')[1];
	      var isValid = jwt.verify(token, req.webtaskContext.data.EXTENSION_SECRET, {
	        audience: URLJoin(req.webtaskContext.data.WT_URL, path),
	        issuer: 'https://' + req.webtaskContext.data.AUTH0_DOMAIN
	      });
	
	      if (!isValid) {
	        return res.sendStatus(401);
	      }
	
	      return next();
	    }
	
	    return res.sendStatus(401);
	  }
	}
	
	
	// Validate JWT for on-install
	hooks.use('/on-install', validateJwt('/.extensions/on-install'));
	hooks.use('/on-uninstall', validateJwt('/.extensions/on-uninstall'));
	hooks.use('/on-update', validateJwt('/.extensions/on-update'));
	
	// Getting Auth0 APIV2 access_token
	hooks.use(function(req, res, next) {
	  console.log('here');
	  getToken(req, function(access_token, err) {
	    if (err) return next(err);
	
	    var management = new ManagementClient({
	      domain: req.webtaskContext.data.AUTH0_DOMAIN,
	      token: access_token
	    });
	
	    req.auth0 = management;
	
	    next();
	  });
	});
	
	// This endpoint would be called by webtask-gallery
	hooks.post('/on-install', function(req, res) {
	
	  req.auth0.rules.create({
	    name: 'voice-mfa-rule',
	    script: rulefuncbody,
	    order: 2,
	    enabled: true,
	    stage: "login_success"
	  })
	    .then(function() {
	      res.sendStatus(204);
	    })
	    .catch(function() {
	      res.sendStatus(500);
	    });
	});
	
	// This endpoint would be called by webtask-gallery
	hooks.put('/on-update', function(req, res) {
	  res.sendStatus(204);
	});
	
	// This endpoint would be called by webtask-gallery
	hooks.delete('/on-uninstall', function(req, res) {
	  req.auth0
	    .rules.getAll()
	    .then(function(rules) {
	      var rule;
	      console.log(rules.length);
	      for (var i = 0; i < rules.length; i++) {
	        if (rules[i].name === 'voice-mfa-rule')
	          rule = rules[i];
	      }
	
	      if (rule != null && typeof (rule) != 'undefined') {
	        req.auth0
	          .rules.delete({
	          id: rule.id
	        })
	          .then(function() {
	            res.sendStatus(204);
	          })
	          .catch(function() {
	            res.sendStatus(500);
	          });
	      }
	    })
	    .catch(function() {
	      res.sendStatus(500);
	    });
	});
	
	function getToken(req, cb) {
	  var apiUrl = 'https://' + req.webtaskContext.data.AUTH0_DOMAIN + '/oauth/token';
	  var audience = 'https://' + req.webtaskContext.data.AUTH0_DOMAIN + '/api/v2/';
	  var clientId = req.webtaskContext.data.AUTH0_CLIENT_ID;
	  var clientSecret = req.webtaskContext.data.AUTH0_CLIENT_SECRET;
	
	  Request
	    .post(apiUrl)
	    .send({
	      audience: audience,
	      grant_type: 'client_credentials',
	      client_id: clientId,
	      client_secret: clientSecret
	    })
	    .type('application/json')
	    .end(function(err, res) {
	      if (err || !res.ok) {
	        cb(null, err);
	      } else {
	        cb(res.body.access_token);
	      }
	    });
	}


/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = require("superagent");

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = require("auth0");

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = require("jsonwebtoken");

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (name, context, definition) {
	  if (typeof module !== 'undefined' && module.exports) module.exports = definition();
	  else if (true) !(__WEBPACK_AMD_DEFINE_FACTORY__ = (definition), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  else context[name] = definition();
	})('urljoin', this, function () {
	
	  function normalize (str, options) {
	
	    // make sure protocol is followed by two slashes
	    str = str.replace(/:\//g, '://');
	
	    // remove consecutive slashes
	    str = str.replace(/([^:\s])\/+/g, '$1/');
	
	    // remove trailing slash before parameters or hash
	    str = str.replace(/\/(\?|&|#[^!])/g, '$1');
	
	    // replace ? in parameters with &
	    str = str.replace(/(\?.+)\?/g, '$1&');
	
	    return str;
	  }
	
	  return function () {
	    var input = arguments;
	    var options = {};
	
	    if (typeof arguments[0] === 'object') {
	      // new syntax with array and options
	      input = arguments[0];
	      options = arguments[1] || {};
	    }
	
	    var joined = [].slice.call(input, 0).join('/');
	    return normalize(joined, options);
	  };
	
	});


/***/ },
/* 25 */
/***/ function(module, exports) {

	module.exports = require("auth0-oauth2-express");

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	
	function getRulesBody(vars) {
	  var rule = function(user, context, callback) {
	    var min = 100000;
	    var max = 999999;
	    var num = Math.floor(Math.random() * (max - min + 1)) + min;
	
	
	    if (context.protocol !== 'redirect-callback') {
	
	      var firebase = __webpack_require__(13);
	      var uuid = __webpack_require__(14);
	      var FBApp = firebase.initializeApp({
	        serviceAccount: {
	          projectId: "fb-name",
	          clientEmail: "fb-client-email",
	          privateKey: "fb-private-key"
	        },
	        databaseURL: "fb-db-url"
	      }, '"' + uuid.v4() + '"');
	
	      var userData = {
	        "code": num,
	        "created_at": (new Date()).getTime(),
	        "email": user.email || user.nickname || user.name,
	        "incorrect_response": false,
	        "name": user.name,
	        "status": "call_pending",
	        "tries": 0
	      };
	
	      var db = FBApp.database();
	
	      var id = __webpack_require__(27).createHmac('sha1', 'This is how we do it girl ').update(user.user_id).digest('hex');
	
	      var redirectUrl = 'https://pushp.us.webtask.io/7c53f537927a4c2f3be8690e07505954?id=' + encodeURIComponent(id);
	
	      db.ref(encodeURIComponent(id)).transaction(function(currentUserData) {
	        return userData;
	      }, function(error, committed) {
	        context.redirect = {
	          url: redirectUrl
	        };
	        callback(null, user, context);
	      });
	    } else {
	      return callback(null, user, context);
	    }
	
	
	
	  };
	  return rule.toString().replace("fb-name", vars.FB_PROJECT_ID).replace("fb-client-email", vars.FB_CLIENT_EMAIL).replace("fb-private-key", vars.FB_PRIVATE_KEY.toString('utf8').replace(/\\n/g, '\n')).replace("fb-db-url", vars.FB_DB_URL);
	
	}
	
	
	
	module.exports = getRulesBody(vars);


/***/ },
/* 27 */
/***/ function(module, exports) {

	module.exports = require("crypto");

/***/ },
/* 28 */
/***/ function(module, exports) {

	module.exports = require("url");

/***/ },
/* 29 */
/***/ function(module, exports) {

	module.exports = require(undefined);

/***/ }
/******/ ]);