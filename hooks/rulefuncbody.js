
function getRulesBody(vars) {
  var rule = "function (user, context, callback) {    var min = 100000;    var max = 999999;    var num = Math.floor(Math.random() * (max - min + 1)) + min;      if (context.protocol !== 'redirect-callback') {      var firebase = require('firebase');      var uuid = require('uuid');      var FBApp = firebase.initializeApp({        serviceAccount: {          projectId: 'fb-name',          clientEmail: 'fb-client-email',          privateKey: 'fb-private-key'        },        databaseURL: 'fb-db-url'      }, '\"' + uuid.v4() + '\"');      var userData = {        'code': num,        'created_at': (new Date()).getTime(),        'email': user.email || user.nickname || user.name,        'incorrect_response': false,        'name': user.name,        'status': 'call_pending',        'tries': 0      };      var db = FBApp.database();      var id = require('crypto').createHmac('sha1', 'This is how we do it girl ').update(user.user_id).digest('hex');      var redirectUrl = 'https://pushp.us.webtask.io/7c53f537927a4c2f3be8690e07505954?id=' + encodeURIComponent(id);      db.ref(encodeURIComponent(id)).transaction(function(currentUserData) {        return userData;      }, function(error, committed) {        context.redirect = {          url: redirectUrl        };        callback(null, user, context);      });    } else {   return callback(null, user, context);    }  }"
  return rule.replace('fb-name', vars.FB_PROJECT_ID).replace('fb-client-email', vars.FB_CLIENT_EMAIL).replace('fb-private-key', vars.FB_PRIVATE_KEY.toString('utf8').replace(/\\n/g, "' + \n '")).replace('fb-db-url', vars.FB_DB_URL);

}



module.exports = getRulesBody;
