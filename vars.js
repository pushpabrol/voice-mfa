
var env = {
  setVars: setEnvironment
};

function setEnvironment(req) {
  if (req.webtaskContext != null) {
    console.log(req.webtaskContext.data);
    env.TWILIO_ID = req.webtaskContext.data.TWILIO_ID;
    env.TWILIO_SECRET = req.webtaskContext.data.TWILIO_SECRET;
    env.AUTH0_DOMAIN = req.webtaskContext.data.AUTH0_DOMAIN;
    env.WT_URL = req.webtaskContext.data.WT_URL;
    env.FB_PROJECT_ID = req.webtaskContext.data.FB_PROJECT_ID;
    env.FB_CLIENT_EMAIL = req.webtaskContext.data.FB_CLIENT_EMAIL;
    env.FB_PRIVATE_KEY = req.webtaskContext.data.FB_PRIVATE_KEY;
    env.FB_DB_URL = req.webtaskContext.data.FB_DB_URL;

  } else {
    require('dotenv').config();
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
