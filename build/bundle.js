module.exports=function(e){function t(o){if(n[o])return n[o].exports;var r=n[o]={exports:{},id:o,loaded:!1};return e[o].call(r.exports,r,r.exports,t),r.loaded=!0,r.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){var o=n(2);e.exports=o.fromExpress(n(3))},,function(e,t){e.exports=require("webtask-tools")},function(e,t,n){var o=n(4),r=n(5),a=n(6),s=n(9),i=n(10),l=n(11),c=n(12),d=n(15)(),u=(n(16),n(17)),p=n(19),f=1e5,h=999999;d.use("/.extensions",n(20)),d.use(function(e,t,n){u.setVars(e),n()}),d.use(o("dev")),d.use(r()),d.get("/meta",function(e,t){t.status(200).send(p)}),d.get("/",function(e,t){console.log(JSON.stringify(u)),e.query.id&&null!==e.query.id?(console.log(e.query.id),c(u).ref(e.query.id).once("value",function(n){if(null!=n.val())if((new Date).getTime()-n.val().created_at<=3e5){var o=n.val();o.state=e.query.state,c(u).ref(e.query.id).set(o),console.log("updated data"),t.header("Content-Type","text/html"),t.status(200).send(s({title:"Verify code by Phone",id:e.query.id,path:"api/run/pushp/7c53f537927a4c2f3be8690e07505954"}))}else{var o=n.val();o.created_at=(new Date).getTime(),o.code=Math.floor(Math.random()*(h-f+1))+f,o.state=e.query.state,c(u).ref(e.query.id).set(o),console.log("updated code 2"),t.header("Content-Type","text/html"),t.status(200).send(s({title:"Verify code by Phone",id:e.query.id,path:"api/run/pushp/7c53f537927a4c2f3be8690e07505954"}))}else t.header("Content-Type","text/html"),t.status(200).send(a({message:"Error while getting user data.",error:{code:"USER_NOT_FOUND"}}))},function(e){"undefined"!=typeof e&&null!=e&&(console.log("here1"),t.header("Content-Type","text/html"),t.status(200).send(a({message:"Error while getting user data.",error:{code:e.code}})))})):(t.header("Content-Type","text/html"),t.status(200).send(a({message:"Error while getting user data.",error:{code:"User not provided"}})))}),d.post("/codefromprovider/*",function(e,t){console.log("codefromprovider");var o=n(26).parse(e.url,!0).pathname,r=o.split("/"),a=decodeURIComponent(r[r.length-1]);console.log(a),c(u).ref(encodeURIComponent(a)).once("value",function(e){var n=new l.TwimlResponse;n.say("Hello, "+e.val().name+", "+e.val().code.toString().split("").join(",")+" is your verification code!",{voice:"alice",loop:2}),t.type("text/xml"),t.status(200).send(n.toString())},function(e){if("undefined"!=typeof e&&null!=e){console.log("Error");var n=new l.TwimlResponse;n.say("Error while getting user data. Code: "+e.code,{voice:"alice"}),t.type("text/xml"),t.status(200).send(n.toString())}})}),d.post("/",function(e,t){console.log("In Post"),console.log(e.webtaskContext.data),"call"==e.webtaskContext.data.type&&(console.log("call"),""!==e.webtaskContext.data.phone&&c(u).ref(encodeURIComponent(e.webtaskContext.data.id)).once("value",function(o){var r=n(11)(u.TWILIO_ID,u.TWILIO_SECRET);console.log("before call, code: "+o.val().code),console.log("vars"+u),r.makeCall({to:e.webtaskContext.data.phone,from:"+18638692482",url:u.WT_URL+"/codefromprovider/"+encodeURIComponent(e.webtaskContext.data.id)},function(n,r){n?(console.log(n),t.header("Content-Type","text/html"),t.status(200).send(a({message:"Error while making the call",error:n}))):(console.log("after call no error"),console.log(o.val().name),t.header("Content-Type","text/html"),t.status(200).send(i({user:{name:o.val().name,id:e.webtaskContext.data.id}})))})},function(e){"undefined"!=typeof e&&null!=e&&(console.log("here1"),t.header("Content-Type","text/html"),t.status(200).send(a({message:"Error while getting user data.",error:{code:e.code}})))})),"verifycode"==e.webtaskContext.data.type&&(console.log("here-verify"),console.log(e.webtaskContext.data.id),console.log(e.webtaskContext.data.code),c(u).ref(encodeURIComponent(e.webtaskContext.data.id)).once("value",function(n){if(e.webtaskContext.data.code==n.val().code){var o=n.val().state;t.writeHead(301,{Location:"https://"+u.AUTH0_DOMAIN+"/continue?state="+(o||"")}),t.end()}else t.status(401),t.render("error",{message:"The code validation failed",error:{code:"failed"}})},function(e){"undefined"!=typeof e&&null!=e&&(console.log("here1"),t.header("Content-Type","text/html"),t.status(200).send(a({message:"Error while getting user data.",error:{code:e.code}})))}))}),e.exports=d},function(e,t){e.exports=require("morgan")},function(e,t){e.exports=require("cookie-parser")},function(e,t,n){var o=n(7);e.exports=function(e){var t,n=[],r=e||{};return function(e,r,a){n.push("<!DOCTYPE html><html><head><title>"+o.escape(null==(t=a)?"":t)+'</title><link href="https://cdn.auth0.com/styleguide/4.8.13/index.min.css" rel="stylesheet"></head><body><div class="logo-branding"><img src="https://styleguide.auth0.com/lib/logos/img/logo-blue.png" width="100px"></div><div class="main container"><div class="row"><div class="col-md-6 col-md-offset-3"></div><h1>'+o.escape(null==(t=r)?"":t)+"</h1><h2>"+o.escape(null==(t=e.status)?"":t)+"</h2><pre>"+o.escape(null==(t=e.code)?"":t)+"</pre></div></div></body></html>")}.call(this,"error"in r?r.error:"undefined"!=typeof error?error:void 0,"message"in r?r.message:"undefined"!=typeof message?message:void 0,"title"in r?r.title:"undefined"!=typeof title?title:void 0),n.join("")}},function(e,t,n){"use strict";function o(e){return null!=e&&""!==e}function r(e){return(Array.isArray(e)?e.map(r):e&&"object"==typeof e?Object.keys(e).filter(function(t){return e[t]}):[e]).filter(o).join(" ")}function a(e){return i[e]||e}function s(e){var t=String(e).replace(l,a);return t===""+e?e:t}t.merge=function e(t,n){if(1===arguments.length){for(var r=t[0],a=1;a<t.length;a++)r=e(r,t[a]);return r}var s=t.class,i=n.class;(s||i)&&(s=s||[],i=i||[],Array.isArray(s)||(s=[s]),Array.isArray(i)||(i=[i]),t.class=s.concat(i).filter(o));for(var l in n)"class"!=l&&(t[l]=n[l]);return t},t.joinClasses=r,t.cls=function(e,n){for(var o=[],a=0;a<e.length;a++)n&&n[a]?o.push(t.escape(r([e[a]]))):o.push(r(e[a]));var s=r(o);return s.length?' class="'+s+'"':""},t.style=function(e){return e&&"object"==typeof e?Object.keys(e).map(function(t){return t+":"+e[t]}).join(";"):e},t.attr=function(e,n,o,r){return"style"===e&&(n=t.style(n)),"boolean"==typeof n||null==n?n?" "+(r?e:e+'="'+e+'"'):"":0==e.indexOf("data")&&"string"!=typeof n?(JSON.stringify(n).indexOf("&")!==-1&&console.warn("Since Jade 2.0.0, ampersands (`&`) in data attributes will be escaped to `&amp;`"),n&&"function"==typeof n.toISOString&&console.warn("Jade will eliminate the double quotes around dates in ISO form after 2.0.0")," "+e+"='"+JSON.stringify(n).replace(/'/g,"&apos;")+"'"):o?(n&&"function"==typeof n.toISOString&&console.warn("Jade will stringify dates in ISO form after 2.0.0")," "+e+'="'+t.escape(n)+'"'):(n&&"function"==typeof n.toISOString&&console.warn("Jade will stringify dates in ISO form after 2.0.0")," "+e+'="'+n+'"')},t.attrs=function(e,n){var o=[],a=Object.keys(e);if(a.length)for(var s=0;s<a.length;++s){var i=a[s],l=e[i];"class"==i?(l=r(l))&&o.push(" "+i+'="'+l+'"'):o.push(t.attr(i,l,!1,n))}return o.join("")};var i={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"},l=/[&<>"]/g;t.escape=s,t.rethrow=function e(t,o,r,a){if(!(t instanceof Error))throw t;if(!("undefined"==typeof window&&o||a))throw t.message+=" on line "+r,t;try{a=a||n(8).readFileSync(o,"utf8")}catch(n){e(t,null,r)}var s=3,i=a.split("\n"),l=Math.max(r-s,0),c=Math.min(i.length,r+s),s=i.slice(l,c).map(function(e,t){var n=t+l+1;return(n==r?"  > ":"    ")+n+"| "+e}).join("\n");throw t.path=o,t.message=(o||"Jade")+":"+r+"\n"+s+"\n\n"+t.message,t},t.DebugItem=function(e,t){this.lineno=e,this.filename=t}},function(e,t){e.exports=require("fs")},function(e,t,n){var o=n(7);e.exports=function(e){var t,n=[],r=e||{};return function(e,r){n.push("<!DOCTYPE html><html><head><title>"+o.escape(null==(t=r)?"":t)+'</title><link href="https://cdn.auth0.com/styleguide/4.8.13/index.min.css" rel="stylesheet"></head><body><div class="logo-branding"><img src="https://styleguide.auth0.com/lib/logos/img/logo-blue.png" width="100px"></div><div class="main container"><div class="row"><div class="col-md-6 col-md-offset-3"><h1 class="display-4 m-b-2">Call to Verify</h1><p>Please enter your phone number</p><!-- phone form--><form method="POST" action="/7c53f537927a4c2f3be8690e07505954"><div class="form-group"><label for="phone">Phone Number:</label><input id="phone" name="phone" type="tel" placeholder="+1777-777-7777" required class="form-control"><input id="type" name="type" type="hidden" value="call" class="form-control"><input id="id" name="id" type="hidden"'+o.attr("value",""+e,!0,!0)+' class="form-control"></div><button type="submit" class="btn btn-primary">Call me</button></form></div></div></div></body></html>')}.call(this,"id"in r?r.id:"undefined"!=typeof id?id:void 0,"title"in r?r.title:"undefined"!=typeof title?title:void 0),n.join("")}},function(e,t,n){var o=n(7);e.exports=function(e){var t,n=[],r=e||{};return function(e,r){n.push("<!DOCTYPE html><html><head><title>"+o.escape(null==(t=e)?"":t)+'</title><link href="https://cdn.auth0.com/styleguide/4.8.13/index.min.css" rel="stylesheet"></head><body><div class="logo-branding"><img src="https://styleguide.auth0.com/lib/logos/img/logo-blue.png" width="100px"></div><div class="main container"><div class="row"><div class="col-md-6 col-md-offset-3"><h1 class="display-4 m-b-2">Enter the code</h1><p>Hi '+o.escape(null==(t=r.name)?"":t)+'</p><p>Enter your voice call verification code</p><form method="POST" action="/"><div class="form-group"><label for="code">Code:</label><input id="code" name="code" type="text" placeholder="Enter your code" required class="form-control"><input id="type" name="type" type="hidden" value="verifycode" class="form-control"><input id="id" name="id" type="hidden"'+o.attr("value",""+r.id,!0,!0)+' class="form-control"></div><button type="submit" class="btn btn-primary">Verify</button></form></div></div></div></body></html>')}.call(this,"title"in r?r.title:"undefined"!=typeof title?title:void 0,"user"in r?r.user:"undefined"!=typeof user?user:void 0),n.join("")}},function(e,t){e.exports=require("twilio")},function(e,t,n){function o(e){var t=n(13),o=n(14);console.log("firebase"),console.log(e.FB_PRIVATE_KEY);var r={projectId:e.FB_PROJECT_ID,clientEmail:e.FB_CLIENT_EMAIL,privateKey:e.FB_PRIVATE_KEY.toString("utf8").replace(/\\n/g,"\n")};console.log(r);var a=t.initializeApp({serviceAccount:r,databaseURL:e.FB_DB_URL},'"'+o.v4()+'"');return a.database()}e.exports=o},function(e,t){e.exports=require("firebase@3.1.0")},function(e,t){e.exports=require("uuid")},function(e,t){e.exports=require("express")},function(e,t){e.exports=require("body-parser")},function(e,t,n){function o(e){null!=e.webtaskContext?(console.log(e.webtaskContext.data),r.TWILIO_ID=e.webtaskContext.data.TWILIO_ID,r.TWILIO_SECRET=e.webtaskContext.data.TWILIO_SECRET,r.AUTH0_DOMAIN=e.webtaskContext.data.AUTH0_DOMAIN,r.WT_URL=e.webtaskContext.data.WT_URL,r.FB_PROJECT_ID=e.webtaskContext.data.FB_PROJECT_ID,r.FB_CLIENT_EMAIL=e.webtaskContext.data.FB_CLIENT_EMAIL,r.FB_PRIVATE_KEY=e.webtaskContext.data.FB_PRIVATE_KEY,r.FB_DB_URL=e.webtaskContext.data.FB_DB_URL):(n(18).config(),r.TWILIO_ID=process.env.TWILIO_ID,r.TWILIO_SECRET=process.env.TWILIO_SECRET,r.AUTH0_DOMAIN=process.env.AUTH0_DOMAIN,r.WT_URL=process.env.WT_URL,r.FB_PROJECT_ID=process.env.FB_PROJECT_ID,r.FB_CLIENT_EMAIL=process.env.FB_CLIENT_EMAIL,r.FB_PRIVATE_KEY=process.env.FB_PRIVATE_KEY,r.FB_DB_URL=process.env.data.FB_DB_URL)}var r={setVars:o};e.exports=r},function(e,t){e.exports=require("dotenv")},function(e,t){e.exports={title:"Voice Based MFA",name:"voice-mfa",version:"2.0.0",author:"pushp.abrol@auth0.com",description:"Nothing",type:"application",logoUrl:"https://cdn.auth0.com/extensions/custom-social-connections/assets/logo.png",keywords:["auth0","extension"],auth0:{createClient:!0,scopes:"create:rules read:rules delete:rules",onInstallPath:"/.extensions/on-install",onUninstallPath:"/.extensions/on-uninstall",onUpdatePath:"/.extensions/on-update"},secrets:{TWILIO_ID:{description:"Twilio Id to use for calling via Phone",required:!0},TWILIO_SECRET:{description:"Twilio Secret",required:!0},FB_PROJECT_ID:{description:"Firebase Service Account Project Id",required:!0},FB_CLIENT_EMAIL:{description:"Firebase Service Account Cleint Email",required:!0},FB_PRIVATE_KEY:{description:"Private Key",required:!0},FB_DB_URL:{description:"Firebase Database Url",required:!0}}}},function(e,t,n){function o(e){return function(t,n,o){if(console.log("jwt"),t.headers.authorization&&"Bearer"===t.headers.authorization.split(" ")[0]){var r=t.headers.authorization.split(" ")[1],a=l.verify(r,t.webtaskContext.data.EXTENSION_SECRET,{audience:d(t.webtaskContext.data.WT_URL,e),issuer:"https://"+t.webtaskContext.data.AUTH0_DOMAIN});return a?o():n.sendStatus(401)}return n.sendStatus(401)}}function r(e,t){var n="https://"+e.webtaskContext.data.AUTH0_DOMAIN+"/oauth/token",o="https://"+e.webtaskContext.data.AUTH0_DOMAIN+"/api/v2/",r=e.webtaskContext.data.AUTH0_CLIENT_ID,a=e.webtaskContext.data.AUTH0_CLIENT_SECRET;s.post(n).send({audience:o,grant_type:"client_credentials",client_id:r,client_secret:a}).type("application/json").end(function(e,n){e||!n.ok?t(null,e):t(n.body.access_token)})}var a=n(15),s=n(21),i=n(22).ManagementClient,l=n(23),c=a.Router(),d=n(24);n(25);e.exports=c,c.use("/on-install",o("/.extensions/on-install")),c.use("/on-uninstall",o("/.extensions/on-uninstall")),c.use("/on-update",o("/.extensions/on-update")),c.use(function(e,t,n){console.log("here"),r(e,function(t,o){if(o)return n(o);var r=new i({domain:e.webtaskContext.data.AUTH0_DOMAIN,token:t});e.auth0=r,n()})}),c.post("/on-install",function(e,t){e.auth0.rules.create({name:"voice-mfa-rule",script:"function (user, context, callback) {\n  callback(null, user, context);\n}",order:2,enabled:!0,stage:"login_success"}).then(function(){t.sendStatus(204)}).catch(function(){t.sendStatus(500)})}),c.put("/on-update",function(e,t){t.sendStatus(204)}),c.delete("/on-uninstall",function(e,t){e.auth0.rules.getAll().then(function(n){var o;console.log(n.length);for(var r=0;r<n.length;r++)"voice-mfa-rule"===n[r].name&&(o=n[r]);null!=o&&"undefined"!=typeof o&&e.auth0.rules.delete({id:o.id}).then(function(){t.sendStatus(204)}).catch(function(){t.sendStatus(500)})}).catch(function(){t.sendStatus(500)})})},function(e,t){e.exports=require("superagent")},function(e,t){e.exports=require("auth0@2.1.0")},function(e,t){e.exports=require("jsonwebtoken")},function(e,t,n){var o,r;!function(a,s,i){"undefined"!=typeof e&&e.exports?e.exports=i():(o=i,r="function"==typeof o?o.call(t,n,t,e):o,!(void 0!==r&&(e.exports=r)))}("urljoin",this,function(){function e(e,t){return e=e.replace(/:\//g,"://"),e=e.replace(/([^:\s])\/+/g,"$1/"),e=e.replace(/\/(\?|&|#[^!])/g,"$1"),e=e.replace(/(\?.+)\?/g,"$1&")}return function(){var t=arguments,n={};"object"==typeof arguments[0]&&(t=arguments[0],n=arguments[1]||{});var o=[].slice.call(t,0).join("/");return e(o,n)}})},function(e,t){e.exports=require("auth0-oauth2-express")},function(e,t){e.exports=require("url")}]);