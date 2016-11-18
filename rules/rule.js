module.exports = function(extensionUrl, fbProjectId, fbClientEmail, privateKey, fbDbUrl) {
  return '    function(user, context, callback) {\n' +
    '    var EXTENSION_URL =\'' + extensionUrl + '\';\n' +
    '    var FB_PROJECT_ID =\'' + fbProjectId + '\';\n' +
    '    var FB_CLIENT_EMAIL =\'' + fbClientEmail + '\';\n' +
    '    var FB_PRIVATE_KEY =\'' + privateKey + '\';\n' +
    '    var FB_DB_URL =\'' + fbDbUrl + '\';\n' +
    '    var min = 100000;\n' +
    '    var max = 999999;\n' +
    '    var num = Math.floor(Math.random() * (max - min + 1)) + min;\n' +
    '    if (context.protocol !== \'redirect-callback\') {\n' +
    '      var firebase = require(\'firebase@3.1.0\');\n' +
    '      var uuid = require(\'uuid\');\n' +
    '      var FBApp = firebase.initializeApp({\n' +
    '        serviceAccount: {\n' +
    '          projectId: FB_PROJECT_ID,\n' +
    '          clientEmail: FB_CLIENT_EMAIL,\n' +
    '          privateKey: FB_PRIVATE_KEY.replace(/\\n/g, \'\n\')\n' +
    '        },\n' +
    '        databaseURL: FB_DB_URL\n' +
    '      }, \'"\' + uuid.v4() + \'"\');\n' +
    '      var userData = {\n' +
    '        \'code\': num,\n' +
    '        \'created_at\': (new Date()).getTime(),\n' +
    '        \'email\': user.email || user.nickname || user.name,\n' +
    '        \'incorrect_response\': false,\n' +
    '        \'name\': user.name,\n' +
    '        \'status\': \'call_pending\',\n' +
    '        \'tries\': 0\n' +
    '      };\n' +
    '      var db = FBApp.database();\n' +
    '      var id = require(\'crypto\').createHmac(\'sha1\', \'This is how we do it girl\').update(user.user_id).digest(\'hex\');\n' +
    '      var redirectUrl = EXTENSION_URL + \'?id=\' + encodeURIComponent(id);\n' +
    '      db.ref(encodeURIComponent(id)).transaction(function(currentUserData) {\n' +
    '        return userData;\n' +
    '      }, function(error, committed) {\n' +
    '        context.redirect = {\n' +
    '          url: redirectUrl\n' +
    '        };        callback(null, user, context);\n' +
    '      });\n' +
    '    } else {\n' +
    '      return callback(null, user, context);\n' +
    '    }\n' +
    '    };';
};
