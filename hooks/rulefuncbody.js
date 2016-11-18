
function getRulesBody(vars) {
  var rule = "function (user, context, callback) {" +
    "  var min = 100000;" +
    "  var max = 999999;" +
    "  var num = Math.floor(Math.random() * (max - min + 1)) + min;" +
    "  if (context.protocol !== 'redirect-callback') {" +
    "    var firebase = require('firebase@3.1.0');" +
    "    var uuid = require('uuid');" +
    "    var FBApp = firebase.initializeApp({" +
    "      serviceAccount: {" +
    "        projectId: configuration.FB_PROJECT_ID," +
    "        clientEmail: configuration.FB_CLIENT_EMAIL," +
    "        privateKey: configuration.FB_PRIVATE_KEY.replace(/\\n/g, '\n')" +
    "      }," +
    "      databaseURL: configuration.FB_DB_URL" +
    "    }, '\"' + uuid.v4() + '\"');" +
    "    var userData = {" +
    "      'code': num," +
    "      'created_at': (new Date()).getTime()," +
    "      'email': user.email || user.nickname || user.name," +
    "      'incorrect_response': false," +
    "      'name': user.name," +
    "      'status': 'call_pending'," +
    "      'tries': 0" +
    "    };" +
    "    var db = FBApp.database();" +
    "    var id = require('crypto').createHmac('sha1', 'This is how we do it girl ').update(user.user_id).digest('hex');" +
    "    var redirectUrl = configuration.WT_URL  + '?id=' + encodeURIComponent(id);" +
    "    db.ref(encodeURIComponent(id)).transaction(function(currentUserData) {" +
    "      return userData;" +
    "    }, function(error, committed) {" +
    "      context.redirect = {" +
    "        url: redirectUrl" +
    "      };        callback(null, user, context);" +
    "    });" +
    "  } else {" +
    "    return callback(null, user, context);" +
    "  }";
  return rule;
}
;
module.exports = getRulesBody;
