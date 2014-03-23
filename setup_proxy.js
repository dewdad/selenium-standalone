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

https = require('https');
var oldhttpsreq = https.request;
https.request = function (options, callback) {
  options.agent = tunnelingAgent;
  return oldhttpsreq.call(null, options, callback);
};

http = require('http');
var oldhttpreq = http.request;
http.request = function (options, callback) {
  options.agent = tunnelingAgent;
  return oldhttpreq.call(null, options, callback);
};