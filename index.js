var logger = require('morgan');
var cookieParser = require('cookie-parser');
var errorpage = require('./views/error.jade');
var landingpage = require('./views/index.jade');
var inputcode = require('./views/inputcode.jade');
var twilio = require('twilio');
var Firebase = require("./firebase");
var app = require('express')();
var bodyParser = require('body-parser');
var vars = require('./vars');
var metadata = require('./webtask.json');
var min = 100000;
var max = 999999;

//*****DO NOT REMOVE THE COMMENT SECTION BELOW****
/*~~~~~~*/

app.use(bodyParser.urlencoded({
  extended: true
}));



app.use('/.extensions', require('./hooks'));

app.use(function(req, res, next) {
  vars.setVars(req);
  next();
});


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
            id: req.query.id,
            path: 'api/run/pushp/7c53f537927a4c2f3be8690e07505954'
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
            id: req.query.id,
            path: 'api/run/pushp/7c53f537927a4c2f3be8690e07505954'
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
  var pathname = require('url').parse(req.url, true).pathname;
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
  console.log(req.body);

  console.log('In Post');

  if (req.webtaskContext.data.type == 'call') {
    console.log('call');
    if (req.webtaskContext.data.phone !== '') {
      Firebase(vars).ref(encodeURIComponent(req.webtaskContext.data.id)).once("value", function(snapshot) {
        var client = require('twilio')(vars.TWILIO_ID, vars.TWILIO_SECRET);
        console.log('before call, code: ' + snapshot.val().code);
        //Place a phone call, and respond with TwiML instructions from the given URL
        console.log("vars" + vars);
        client.makeCall({
          to: req.webtaskContext.data.phone, // Any number Twilio can call
          from: '+18638692482', // A number you bought from Twilio and can use for outbound communication
          url: vars.WT_URL + '/codefromprovider/' + encodeURIComponent(req.webtaskContext.data.id) // A URL that produces an XML document (TwiML) which contains instructions for the call

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
            res.status(200).send(inputcode({
              user: {
                'name': snapshot.val().name,
                'id': req.webtaskContext.data.id
              }
            }));
          }

        });


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
  }

  if (req.webtaskContext.data.type == 'verifycode') {

    console.log('here-verify');
    console.log(req.webtaskContext.data.id);
    console.log(req.webtaskContext.data.code);

    Firebase(vars).ref(encodeURIComponent(req.webtaskContext.data.id)).once("value", function(snapshot) {
      if (req.webtaskContext.data.code == snapshot.val().code) {
        var state = snapshot.val().state;
        // Firebase(vars).ref(encodeURIComponent(req.webtaskContext.data.id)).off();
        // Firebase(vars).ref(encodeURIComponent(req.webtaskContext.data.id)).remove(function(error) {
        //   console.log(error ? "Uh oh!" : "Success!");
        // });

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
