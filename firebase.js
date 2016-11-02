
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
      privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDPUkcOR6zLuxD+\n42+AkYO7rXHO/pcCBJ1PTdxOVrCbUroUFuFtEhttGYKY1H2np2wfebZSIcI2y2zf\n6DmVa6NNmucOw2RTe5Ixc1XZjs+dWdBmA05C8SggD+am6RIlTZkBR+YRC+SBeUnU\npStLBvI0JgYwlyVieiREfMZX3BFATqaBK/ZymgkyTUx+7FYoiDFXCZpZy+hzbxvz\nXRr8CZxCYWNsqfmLIqH9tFllH3d7GkO7X8zieNFjs6T8F5vLBlVbpqsLIPDJ+5q2\nX3a7N7+d0YXbrNsPCy259GagFr3qpcrIVES46ysjPfMqIjhC9ce4mWuzX598bnjV\nkkRe6rfPAgMBAAECggEAUXIPPAroVTjuGlQa77U6vTYMKbdWd5J8gjUiQRxJURuU\nwmOit4iPgbKt3YBMxNo+3bag628brw8HfIbsaEja5JfgAaq89RbsfcTDiy5RXY11\nEz5lNmMq0j2s7RFO8ZykaR5nwXaclEijuogQk+7so5P0ho46P4+gQ8+I0+c+V7ZY\nxTuMI6eWhhcqVQGxlHOyn4wOB2Bwh+xxgUsYvTu6wgYFKNPC0FRzFViMkRW0ZeOJ\n1ItZj3QqIhQWfVN2CcmwbRCmELf+okGtatWgejtrJ2qNN5PQtaBLKv4qCKMiDpsK\nPV7GjztjfQ/rnvWXKK/tTu1bb64/qM3RVdAyUwzHkQKBgQD2SaOylk2XHDSQtecl\nXsWsM3jyLHDxqQoK4lFu+uT3kZxbG3Q4D543MeMWOvbzxFWMuMYpEdwYkeXfehn5\nuD4RzlDJDK2TrKrmF5yvRmVEH/F1hcn3e2MDPtQqADQBa8rc2uSLzhobT+Ek9lZr\npt8cFmFgx8tpUtnCt5kFnNLxxQKBgQDXf0KRoAFVDhr05dXvKTPnFn4qqKCq3Cno\n5fcb3PwTJJ8EeH8pJn1S0KI2KZlGzizxedQQziYkcX2ppwo6RdqOsiy00WMVQwRi\nUwrQr2OkAyNfpFQezflqJR+CvJce4Ib1uAz8c7dmpV7oGxW8hMpis3lOi0+mMWbK\nuSc9z6UAgwKBgQDeHrf2PrwnhpaZ1JRtDbY1gg6YSyBpssyN2GMdNkX+SWK8gFwm\nm19T5DgsOm2yl+WYDqUZMTRRLHQnQtXedB32rR4K1NZPEzDmZ3E2WsTF1hFMrqbh\n/nPj32w1nQ1KIs9ItFnfBLhi3X3uegSi/lLF4CFeyZJYoRIoHLFzcGaHCQKBgQCV\n//0kRI3o2IKnCPybFsEMD7oOk4YSqGF7veb9vBqycIFHqWBKEoKVjKf8r4QDpyvd\nggG9GOGv6FeiKaWS3mC9hwRbcIxZlmaM0mTq0cq3tX9/6XCsaI899U0zwXYnhf4r\nN8vCRgHZLy8avQ+qQ3xkq6y6oXn1otl8LtlDyy99ZQKBgQCmXdNdekC2dgrF98yj\n6lMafLdxy0cfQtIzoAZWAE1hwtk39nQzndBu5FuEwrYmUo4L7/oCTZK1KMr/FDv/\n6tzOga0FC0ua+xsRFBb3RhBl0h6I18fIn9+LHOjBgnGBFochqp3cH4Ukrno6jGEQ\n3jiqT1zkJoMJ1crOftROQim6VQ==\n-----END PRIVATE KEY-----\n"
    },
    databaseURL: vars.FB_DB_URL
  }, '"' + uuid.v4() + '"');
  return FbApp.database();
}
module.exports = FirebaseDatabase;
