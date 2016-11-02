var Webtask = require('webtask-tools');

module.exports = Webtask.fromExpress(require('./index.js'));
