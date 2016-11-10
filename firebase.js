
function FirebaseDatabase(vars) {

  var firebase = require("firebase");
  var uuid = require('uuid');
  var pk = vars.FB_PRIVATE_KEY;
  console.log("firebase");
  console.log(pk);
  var FbApp = firebase.initializeApp({
    serviceAccount: {
      projectId: vars.FB_PROJECT_ID,
      clientEmail: vars.FB_CLIENT_EMAIL,
      privateKey: pk
    },
    databaseURL: vars.FB_DB_URL
  }, '"' + uuid.v4() + '"');
  return FbApp.database();
}
module.exports = FirebaseDatabase;
