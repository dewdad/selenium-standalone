if (!process.env.http_proxy) return;

var url    = require('url');
var tunnel = require('tunnel');
var proxy = url.parse(process.env.http_proxy);

var tunnelingAgent = tunnel.httpsOverHttp({
  proxy: {
    host: proxy.hostname,
    port: proxy.port
  }
});

var https = require('https');
var oldhttpsreq = https.request;
https.request = function (options, callback) {
  options.agent = tunnelingAgent;
  return oldhttpsreq.call(null, options, callback);
};

var http = require('http');
var oldhttpreq = https.request;
http.request = function (options, callback) {
  options.agent = tunnelingAgent;
  return oldhttpreq.call(null, options, callback);
};