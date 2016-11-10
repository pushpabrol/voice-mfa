var Request = require('request-promise');
var Webpack = require('webpack');
var _ = require('lodash');
var pkg = require('./webtask.json');
var StringReplacePlugin = require("string-replace-webpack-plugin");
var WebpackOnBuildPlugin = require('on-build-webpack');
var fs = require('fs');
var url = require('url');
var UnminifiedWebpackPlugin = require('unminified-webpack-plugin');

var LIST_MODULES_URL = 'https://webtask.it.auth0.com/api/run/wt-tehsis-gmail_com-1?key=eyJhbGciOiJIUzI1NiIsImtpZCI6IjIifQ.eyJqdGkiOiJmZGZiOWU2MjQ0YjQ0YWYyYjc2YzAwNGU1NjgwOGIxNCIsImlhdCI6MTQzMDMyNjc4MiwiY2EiOlsiZDQ3ZDNiMzRkMmI3NGEwZDljYzgwOTg3OGQ3MWQ4Y2QiXSwiZGQiOjAsInVybCI6Imh0dHA6Ly90ZWhzaXMuZ2l0aHViLmlvL3dlYnRhc2tpby1jYW5pcmVxdWlyZS90YXNrcy9saXN0X21vZHVsZXMuanMiLCJ0ZW4iOiIvXnd0LXRlaHNpcy1nbWFpbF9jb20tWzAtMV0kLyJ9.MJqAB9mgs57tQTWtRuZRj6NCbzXxZcXCASYGISk3Q6c';

module.exports = Request.get(LIST_MODULES_URL, {
  json: true
}).then(function(data) {
  var modules = data.modules;

  return {
    entry: './webtask',
    output: {
      path: './build',
      filename: 'bundle.js',
      library: true,
      libraryTarget: 'commonjs2',
    },
    module: {
      loaders: [
        {
          test: /\.jade$/,
          loader: require.resolve('jade-loader')
        },
        {
          test: /\.jade$/,
          loader: StringReplacePlugin.replace({
            replacements: [
              {
                pattern: /\'\/\'/ig,
                replacement: function(match, p1, offset, string) {
                  return "'/'";
                }.bind(this)
              }
            ]
          })
        },
        {
          test: /\.js$/,
          loader: StringReplacePlugin.replace({
            replacements: [
              {
                pattern: /req\.body/ig,
                replacement: function(match, p1, offset, string) {

                  return 'req.webtaskContext.data';
                }.bind(this)
              }
            ]
          })
        },
        {
          test: /\.json$/,
          loader: 'json'
        }
      ]
    },
    externals: _(modules).reduce(function(acc, module) {

      return _.set(acc, module.name, true);
    }, {
      // Not provisioned via verquire
      'auth0-api-jwt-rsa-validation': true,
      'auth0-authz-rules-api': true,
      'auth0-oauth2-express': false,
      'auth0-sandbox-ext': true,
      'detective': true,
      'sandboxjs': true,
      'webtask-tools': true,
      'jade': true,
      'auth0@2.1.0': true

    }),
    plugins: [
      new StringReplacePlugin(),
      new Webpack.optimize.DedupePlugin(),
      new Webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      new WebpackOnBuildPlugin(function() {
        var path = './build/bundle.js';
        var bundle = fs.readFileSync(path, 'utf8');
        bundle = bundle.replace(/require\("firebase"\)/ig, 'require("firebase@3.1.0")');
        bundle = bundle.replace(/require\("auth0"\)/ig, 'require("auth0@2.1.0")');
        fs.writeFileSync(path, bundle);

      }),
      new UnminifiedWebpackPlugin()
    ],
    resolve: {
      modulesDirectories: ['node_modules'],
      root: __dirname,
      alias: {},
    },
    node: {
      console: false,
      global: false,
      process: false,
      Buffer: false,
      __filename: false,
      __dirname: false
    }
  };
});
