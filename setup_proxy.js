var _debug;
if (!!process.env.http_proxy){
    var url = require('url');
    var proxy = url.parse(process.env.http_proxy); // {hostname:'', port:''}

    var https = require('https');
    var oldhttpsreq = https.request;
    https.request = function (options, callback) {
        var request;

        if(_debug) console.log('proxied https request.');
        var __options = typeof(options)==='string'? url.parse(options): options;
        __options.path = 'https://' + __options.host + __options.path;
        __options.host = proxy.host.split(':')[0];
        __options.port = proxy.port;
        if (_debug) {
            console.log('=== https-proxy.js begin debug ===');
            //console.log(JSON.stringify(__options, null, 2));
            console.log(__options);
            console.log('=== https-proxy.js end debug ===');
        }
        request = oldhttpsreq.call(null, __options, callback);
        request.on('error', function(e) {
            console.log('problem with request: ' + e.message);
        });
        return request;
    };

    var http = require('http');
    var oldhttpreq = http.request;
    http.request = function (options, callback) {
        var request;

        if(_debug) console.log('proxied http request.');
        var __options = typeof(options)==='string'? url.parse(options): options;
        __options.path = 'http://' + __options.host + __options.path;
        __options.host = proxy.host.split(':')[0];
        __options.port = parseInt(proxy.port);
        if (_debug) {
            console.log('=== http-proxy.js begin debug ===');
            //console.log(JSON.stringify(__options, null, 2));
            console.log(__options);
            console.log('=== http-proxy.js end debug ===');
        }
        request = oldhttpreq.call(null, __options, function(res){
            if(_debug) console.log(['callback:', res]);
            callback(res);
        });
        request.on('error', function(e) {
            console.log('problem with request: ' + e.message);
        });
        return request;
    };
}else{
    console.log('No http_proxy variable found.');
}

module.exports = function(debug){
  _debug = debug || false;
};