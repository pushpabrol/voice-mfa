
function FirebaseDatabase(vars) {

  var firebase = require("firebase");
  var uuid = require('uuid');
  var pk = vars.FB_PRIVATE_KEY;
  console.log("firebase");
  console.log(pk);
  var svcAccount = {
    projectId: vars.FB_PROJECT_ID,
    clientEmail: vars.FB_CLIENT_EMAIL,
    privateKey: vars.FB_PRIVATE_KEY.replaceAll('\\n', '\n')
  }

  console.log(svcAccount);

  var FbApp = firebase.initializeApp({
    serviceAccount: svcAccount,
    databaseURL: vars.FB_DB_URL
  }, '"' + uuid.v4() + '"');
  return FbApp.database();
}
module.exports = FirebaseDatabase;
