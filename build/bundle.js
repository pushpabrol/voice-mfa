module.exports=function(e){function t(o){if(n[o])return n[o].exports;var r=n[o]={exports:{},id:o,loaded:!1};return e[o].call(r.exports,r,r.exports,t),r.loaded=!0,r.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){var o=n(2);e.exports=o.fromExpress(n(3))},,function(e,t){e.exports=require("webtask-tools")},function(e,t,n){var o=n(4),r=n(5),i=n(6),a=n(9),s=n(10),u=n(11),l=n(12),c=n(15)(),d=n(16),p=n(17),f=n(19),h=1e5,m=999999;c.use(d.urlencoded({extended:!0})),c.use(function(e,t,n){p.setVars(e),n()}),c.use("/.extensions",n(20)),c.use(o("dev")),c.use(r()),c.get("/meta",function(e,t){t.status(200).send(f)}),c.get("/",function(e,t){e.query.id&&null!==e.query.id?l(p).ref(e.query.id).once("value",function(n){if(null!=n.val())if((new Date).getTime()-n.val().created_at<=3e5){var o=n.val();o.state=e.query.state,l(p).ref(e.query.id).set(o),t.header("Content-Type","text/html"),t.status(200).send(a({title:"Verify code by Phone",id:e.query.id}))}else{var o=n.val();o.created_at=(new Date).getTime(),o.code=Math.floor(Math.random()*(m-h+1))+h,o.state=e.query.state,l(p).ref(e.query.id).set(o),t.header("Content-Type","text/html"),t.status(200).send(a({title:"Verify code by Phone",id:e.query.id}))}else t.header("Content-Type","text/html"),t.status(200).send(i({message:"Error while getting user data.",error:{code:"USER_NOT_FOUND"}}))},function(e){"undefined"!=typeof e&&null!=e&&(t.header("Content-Type","text/html"),t.status(200).send(i({message:"Error while getting user data.",error:{code:e.code}})))}):(t.header("Content-Type","text/html"),t.status(200).send(i({message:"Error while getting user data.",error:{code:"User not provided"}})))}),c.post("/codefromprovider/*",function(e,t){var o=n(27).parse(e.url,!0).pathname,r=o.split("/"),i=decodeURIComponent(r[r.length-1]);l(p).ref(encodeURIComponent(i)).once("value",function(e){var n=new u.TwimlResponse;n.say("Hello, "+e.val().name+", "+e.val().code.toString().split("").join(",")+" is your verification code!",{voice:"alice",loop:2}),t.type("text/xml"),t.status(200).send(n.toString())},function(e){if("undefined"!=typeof e&&null!=e){var n=new u.TwimlResponse;n.say("Error while getting user data. Code: "+e.code,{voice:"alice"}),t.type("text/xml"),t.status(200).send(n.toString())}})}),c.post("/",function(e,t){"call"==e.body.type&&""!==e.body.phone&&l(p).ref(encodeURIComponent(e.body.id)).once("value",function(o){var r=n(11)(p.TWILIO_ID,p.TWILIO_SECRET),r=n(11)(p.TWILIO_ID,p.TWILIO_SECRET);r.incomingPhoneNumbers.list().then(function(n){r.makeCall({to:e.body.phone,from:n.incoming_phone_numbers[0].phone_number,url:p.WT_URL+"/codefromprovider/"+encodeURIComponent(e.body.id)},function(n,r){n?(t.header("Content-Type","text/html"),t.status(200).send(i({message:"Error while making the call",error:n}))):(t.header("Content-Type","text/html"),t.status(200).send(s({user:{name:o.val().name,id:e.body.id,path:p.WT_URL.split("/")[p.WT_URL.split("/").length-1]}})))})},function(e){t.header("Content-Type","text/html"),t.status(200).send(i({message:"Error while fetching Phone number from your twilio account",error:e}))})},function(e){"undefined"!=typeof e&&null!=e&&(t.header("Content-Type","text/html"),t.status(200).send(i({message:"Error while getting user data.",error:{code:e.code}})))}),"verifycode"==e.body.type&&l(p).ref(encodeURIComponent(e.body.id)).once("value",function(n){if(e.body.code==n.val().code){var o=n.val().state;t.writeHead(301,{Location:"https://"+p.AUTH0_DOMAIN+"/continue?state="+(o||"")}),t.end()}else t.status(401),t.render("error",{message:"The code validation failed",error:{code:"failed"}})},function(e){"undefined"!=typeof e&&null!=e&&(t.header("Content-Type","text/html"),t.status(200).send(i({message:"Error while getting user data.",error:{code:e.code}})))})}),e.exports=c},function(e,t){e.exports=require("morgan")},function(e,t){e.exports=require("cookie-parser")},function(e,t,n){var o=n(7);e.exports=function(e){var t,n=[],r=e||{};return function(e,r,i){n.push("<!DOCTYPE html><html><head><title>"+o.escape(null==(t=i)?"":t)+'</title><link href="https://cdn.auth0.com/styleguide/4.8.13/index.min.css" rel="stylesheet"></head><body><div class="logo-branding"><img src="https://styleguide.auth0.com/lib/logos/img/logo-blue.png" width="100px"></div><div class="main container"><div class="row"><div class="col-md-6 col-md-offset-3"></div><h1>'+o.escape(null==(t=r)?"":t)+"</h1><h2>"+o.escape(null==(t=e.status)?"":t)+"</h2><pre>"+o.escape(null==(t=e.code)?"":t)+"</pre></div></div></body></html>")}.call(this,"error"in r?r.error:"undefined"!=typeof error?error:void 0,"message"in r?r.message:"undefined"!=typeof message?message:void 0,"title"in r?r.title:"undefined"!=typeof title?title:void 0),n.join("")}},function(e,t,n){"use strict";function o(e){return null!=e&&""!==e}function r(e){return(Array.isArray(e)?e.map(r):e&&"object"==typeof e?Object.keys(e).filter(function(t){return e[t]}):[e]).filter(o).join(" ")}function i(e){return s[e]||e}function a(e){var t=String(e).replace(u,i);return t===""+e?e:t}t.merge=function e(t,n){if(1===arguments.length){for(var r=t[0],i=1;i<t.length;i++)r=e(r,t[i]);return r}var a=t.class,s=n.class;(a||s)&&(a=a||[],s=s||[],Array.isArray(a)||(a=[a]),Array.isArray(s)||(s=[s]),t.class=a.concat(s).filter(o));for(var u in n)"class"!=u&&(t[u]=n[u]);return t},t.joinClasses=r,t.cls=function(e,n){for(var o=[],i=0;i<e.length;i++)n&&n[i]?o.push(t.escape(r([e[i]]))):o.push(r(e[i]));var a=r(o);return a.length?' class="'+a+'"':""},t.style=function(e){return e&&"object"==typeof e?Object.keys(e).map(function(t){return t+":"+e[t]}).join(";"):e},t.attr=function(e,n,o,r){return"style"===e&&(n=t.style(n)),"boolean"==typeof n||null==n?n?" "+(r?e:e+'="'+e+'"'):"":0==e.indexOf("data")&&"string"!=typeof n?(JSON.stringify(n).indexOf("&")!==-1,n&&"function"==typeof n.toISOString," "+e+"='"+JSON.stringify(n).replace(/'/g,"&apos;")+"'"):o?(n&&"function"==typeof n.toISOString," "+e+'="'+t.escape(n)+'"'):(n&&"function"==typeof n.toISOString," "+e+'="'+n+'"')},t.attrs=function(e,n){var o=[],i=Object.keys(e);if(i.length)for(var a=0;a<i.length;++a){var s=i[a],u=e[s];"class"==s?(u=r(u))&&o.push(" "+s+'="'+u+'"'):o.push(t.attr(s,u,!1,n))}return o.join("")};var s={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"},u=/[&<>"]/g;t.escape=a,t.rethrow=function e(t,o,r,i){if(!(t instanceof Error))throw t;if(!("undefined"==typeof window&&o||i))throw t.message+=" on line "+r,t;try{i=i||n(8).readFileSync(o,"utf8")}catch(n){e(t,null,r)}var a=3,s=i.split("\n"),u=Math.max(r-a,0),l=Math.min(s.length,r+a),a=s.slice(u,l).map(function(e,t){var n=t+u+1;return(n==r?"  > ":"    ")+n+"| "+e}).join("\n");throw t.path=o,t.message=(o||"Jade")+":"+r+"\n"+a+"\n\n"+t.message,t},t.DebugItem=function(e,t){this.lineno=e,this.filename=t}},function(e,t){e.exports=require("fs")},function(e,t,n){var o=n(7);e.exports=function(e){var t,n=[],r=e||{};return function(e,r){n.push("<!DOCTYPE html><html><head><title>"+o.escape(null==(t=r)?"":t)+'</title><link href="https://cdn.auth0.com/styleguide/4.8.13/index.min.css" rel="stylesheet"></head><body><div class="logo-branding"><img src="https://styleguide.auth0.com/lib/logos/img/logo-blue.png" width="100px"></div><div class="main container"><div class="row"><div class="col-md-6 col-md-offset-3"><h1 class="display-4 m-b-2">Call to Verify</h1><p>Please enter your phone number</p><!-- phone form--><form method="POST" action="/7c53f537927a4c2f3be8690e07505954"><div class="form-group"><label for="phone">Phone Number:</label><input id="phone" name="phone" type="tel" placeholder="+1777-777-7777" required class="form-control"><input id="type" name="type" type="hidden" value="call" class="form-control"><input id="id" name="id" type="hidden"'+o.attr("value",""+e,!0,!0)+' class="form-control"></div><button type="submit" class="btn btn-primary">Call me</button></form></div></div></div></body></html>')}.call(this,"id"in r?r.id:"undefined"!=typeof id?id:void 0,"title"in r?r.title:"undefined"!=typeof title?title:void 0),n.join("")}},function(e,t,n){var o=n(7);e.exports=function(e){var t,n=[],r=e||{};return function(e,r){n.push("<!DOCTYPE html><html><head><title>"+o.escape(null==(t=e)?"":t)+'</title><link href="https://cdn.auth0.com/styleguide/4.8.13/index.min.css" rel="stylesheet"></head><body><div class="logo-branding"><img src="https://styleguide.auth0.com/lib/logos/img/logo-blue.png" width="100px"></div><div class="main container"><div class="row"><div class="col-md-6 col-md-offset-3"><h1 class="display-4 m-b-2">Enter the code</h1><p>Hi '+o.escape(null==(t=r.name)?"":t)+'</p><p>Enter your voice call verification code</p><form method="POST" action="/7c53f537927a4c2f3be8690e07505954"><div class="form-group"><label for="code">Code:</label><input id="code" name="code" type="text" placeholder="Enter your code" required class="form-control"><input id="type" name="type" type="hidden" value="verifycode" class="form-control"><input id="id" name="id" type="hidden"'+o.attr("value",""+r.id,!0,!0)+' class="form-control"></div><button type="submit" class="btn btn-primary">Verify</button></form></div></div></div></body></html>')}.call(this,"title"in r?r.title:"undefined"!=typeof title?title:void 0,"user"in r?r.user:"undefined"!=typeof user?user:void 0),n.join("")}},function(e,t){e.exports=require("twilio")},function(e,t,n){function o(e){var t=n(13),o=n(14),r={projectId:e.FB_PROJECT_ID,clientEmail:e.FB_CLIENT_EMAIL,privateKey:e.FB_PRIVATE_KEY.toString("utf8").replace(/\\n/g,"\n")},i=t.initializeApp({serviceAccount:r,databaseURL:e.FB_DB_URL},'"'+o.v4()+'"');return i.database()}e.exports=o},function(e,t){e.exports=require("firebase@3.1.0")},function(e,t){e.exports=require("uuid")},function(e,t){e.exports=require("express")},function(e,t){e.exports=require("body-parser")},function(e,t,n){function o(e){null!=e.webtaskContext?(r.TWILIO_ID=e.webtaskContext.data.TWILIO_ID,r.TWILIO_SECRET=e.webtaskContext.data.TWILIO_SECRET,r.AUTH0_DOMAIN=e.webtaskContext.data.AUTH0_DOMAIN,r.WT_URL=e.webtaskContext.data.WT_URL,r.FB_PROJECT_ID=e.webtaskContext.data.FB_PROJECT_ID,r.FB_CLIENT_EMAIL=e.webtaskContext.data.FB_CLIENT_EMAIL,r.FB_PRIVATE_KEY=e.webtaskContext.data.FB_PRIVATE_KEY,r.FB_DB_URL=e.webtaskContext.data.FB_DB_URL):(n(18).config(),r.TWILIO_ID=process.env.TWILIO_ID,r.TWILIO_SECRET=process.env.TWILIO_SECRET,r.AUTH0_DOMAIN=process.env.AUTH0_DOMAIN,r.WT_URL=process.env.WT_URL,r.FB_PROJECT_ID=process.env.FB_PROJECT_ID,r.FB_CLIENT_EMAIL=process.env.FB_CLIENT_EMAIL,r.FB_PRIVATE_KEY=process.env.FB_PRIVATE_KEY,r.FB_DB_URL=process.env.data.FB_DB_URL)}var r={setVars:o};e.exports=r},function(e,t){e.exports=require("dotenv")},function(e,t){e.exports={title:"Voice Based MFA",name:"voice-mfa",version:"2.0.0",author:"pushp.abrol@auth0.com",description:"Nothing",type:"application",logoUrl:"https://cdn.auth0.com/extensions/custom-social-connections/assets/logo.png",keywords:["auth0","extension"],auth0:{createClient:!0,scopes:"create:rules read:rules delete:rules",onInstallPath:"/.extensions/on-install",onUninstallPath:"/.extensions/on-uninstall",onUpdatePath:"/.extensions/on-update"},secrets:{TWILIO_ID:{description:"Twilio Id to use for calling via Phone",required:!0},TWILIO_SECRET:{description:"Twilio Secret",required:!0},FB_PROJECT_ID:{description:"Firebase Service Account Project Id",required:!0},FB_CLIENT_EMAIL:{description:"Firebase Service Account Cleint Email",required:!0},FB_PRIVATE_KEY:{description:"Private Key",required:!0},FB_DB_URL:{description:"Firebase Database Url",required:!0}}}},function(e,t,n){function o(e){return function(t,n,o){if(t.headers.authorization&&"Bearer"===t.headers.authorization.split(" ")[0]){var r=t.headers.authorization.split(" ")[1],i=u.verify(r,t.webtaskContext.data.EXTENSION_SECRET,{audience:c(t.webtaskContext.data.WT_URL,e),issuer:"https://"+t.webtaskContext.data.AUTH0_DOMAIN});return i?o():n.sendStatus(401)}return n.sendStatus(401)}}function r(e,t){var n="https://"+e.webtaskContext.data.AUTH0_DOMAIN+"/oauth/token",o="https://"+e.webtaskContext.data.AUTH0_DOMAIN+"/api/v2/",r=e.webtaskContext.data.AUTH0_CLIENT_ID,i=e.webtaskContext.data.AUTH0_CLIENT_SECRET;a.post(n).send({audience:o,grant_type:"client_credentials",client_id:r,client_secret:i}).type("application/json").end(function(e,n){e||!n.ok?t(null,e):t(n.body.access_token)})}var i=n(15),a=n(21),s=n(22).ManagementClient,u=n(23),l=i.Router(),c=n(24),d=(n(25),n(17)),p=n(26);e.exports=l,l.use("/on-install",o("/.extensions/on-install")),l.use("/on-uninstall",o("/.extensions/on-uninstall")),l.use("/on-update",o("/.extensions/on-update")),l.use(function(e,t,n){r(e,function(t,o){if(o)return n(o);var r=new s({domain:e.webtaskContext.data.AUTH0_DOMAIN,token:t});e.auth0=r,n()})}),l.post("/on-install",function(e,t){e.auth0.rules.create({name:"voice-mfa-rule",script:p(d.WT_URL,d.FB_PROJECT_ID,d.FB_CLIENT_EMAIL,d.FB_PRIVATE_KEY,d.FB_DB_URL),order:2,enabled:!0,stage:"login_success"}).then(function(){t.sendStatus(204)}).catch(function(){t.sendStatus(500)})}),l.put("/on-update",function(e,t){t.sendStatus(204)}),l.delete("/on-uninstall",function(e,t){e.auth0.rules.getAll().then(function(n){for(var o,r=0;r<n.length;r++)"voice-mfa-rule"===n[r].name&&(o=n[r]);null!=o&&"undefined"!=typeof o&&e.auth0.rules.delete({id:o.id}).then(function(){t.sendStatus(204)}).catch(function(){t.sendStatus(500)})}).catch(function(){t.sendStatus(500)})})},function(e,t){e.exports=require("superagent")},function(e,t){e.exports=require("auth0@2.1.0")},function(e,t){e.exports=require("jsonwebtoken")},function(e,t,n){var o,r;!function(i,a,s){"undefined"!=typeof e&&e.exports?e.exports=s():(o=s,r="function"==typeof o?o.call(t,n,t,e):o,!(void 0!==r&&(e.exports=r)))}("urljoin",this,function(){function e(e,t){return e=e.replace(/:\//g,"://"),e=e.replace(/([^:\s])\/+/g,"$1/"),e=e.replace(/\/(\?|&|#[^!])/g,"$1"),e=e.replace(/(\?.+)\?/g,"$1&")}return function(){var t=arguments,n={};"object"==typeof arguments[0]&&(t=arguments[0],n=arguments[1]||{});var o=[].slice.call(t,0).join("/");return e(o,n)}})},function(e,t){e.exports=require("auth0-oauth2-express")},function(e,t){e.exports=function(e,t,n,o,r){return"    function(user, context, callback) {    var EXTENSION_URL ="+e+";    var FB_PROJECT_ID ="+t+";    var FB_CLIENT_EMAIL ="+n+";    var FB_PRIVATE_KEY ="+o+";    var FB_DB_URL ="+r+";    var min = 100000;    var max = 999999;    var num = Math.floor(Math.random() * (max - min + 1)) + min;    if (context.protocol !== 'redirect-callback') {      var firebase = require('firebase@3.1.0');      var uuid = require('uuid');      var FBApp = firebase.initializeApp({        serviceAccount: {          projectId: FB_PROJECT_ID,          clientEmail: FB_CLIENT_EMAIL,          privateKey: FB_PRIVATE_KEY.replace(/\\n/g, '\n')        },        databaseURL: FB_DB_URL      }, '\"' + uuid.v4() + '\"');      var userData = {        'code': num,        'created_at': (new Date()).getTime(),        'email': user.email || user.nickname || user.name,        'incorrect_response': false,        'name': user.name,        'status': 'call_pending',        'tries': 0      };      var db = FBApp.database();      var id = require('crypto').createHmac('sha1', 'This is how we do it girl').update(user.user_id).digest('hex');      var redirectUrl = EXTENSION_URL + '?id=' + encodeURIComponent(id);      db.ref(encodeURIComponent(id)).transaction(function(currentUserData) {        return userData;      }, function(error, committed) {        context.redirect = {          url: redirectUrl        };        callback(null, user, context);      });    } else {      return callback(null, user, context);    }    };"}},function(e,t){e.exports=require("url")}]);