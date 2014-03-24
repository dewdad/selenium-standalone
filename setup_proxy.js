var _debug;

if (!!process.env.http_proxy){
    var url = require('url');
    var proxy = url.parse(process.env.http_proxy); // {hostname:'', port:''}

    var genOptions = function(options){
        var __options = typeof(options)==='string'? url.parse(options): options;
        __options.headers = __options.headers || {};
        __options.headers.Host = __options.host;
        __options.path = 'http://' + __options.host + __options.path;
        __options.hostname = proxy.host.split(':')[0];
        __options.port = parseInt(proxy.port);
        if (_debug) {
            console.log('=== begin proxy request debug ===');
            console.log(__options);
            console.log('=== end proxy request debug ===');
        }
        return __options;
    };

    var https = require('https');
    var oldhttpsreq = https.request;
    https.request = function (options, callback) {
        var request;

        if(_debug) console.log('proxied https request.');
        var __options = genOptions(options);
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
        var __options = genOptions(options);
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