
function FirebaseDatabase(vars) {

  var firebase = require("firebase");
  var uuid = require('uuid');
  console.log("firebase");
  console.log(vars.FB_PRIVATE_KEY);
  var svcAccount = {
    projectId: vars.FB_PROJECT_ID,
    clientEmail: vars.FB_CLIENT_EMAIL,
    privateKey: new Buffer(vars.FB_PRIVATE_KEY, 'base64').toString('utf8').replace(/\\n/g, '\n')
  }

  console.log(svcAccount);

  var FbApp = firebase.initializeApp({
    serviceAccount: svcAccount,
    databaseURL: vars.FB_DB_URL
  }, '"' + uuid.v4() + '"');
  return FbApp.database();
}
module.exports = FirebaseDatabase;
