var server, path, ip = '127.0.0.1', port = 1337, http = require('http'), url = require('url');

server = http.createServer(function (req, res){
    res.writeHead(200, {'content-type': 'text/html'})
    path = url.parse(req.url);

    switch(path.pathname){
        case "/index":
            res.end('I am index.')
            break
        case "/test":
            res.end('this is test page.')
            break
        default:
            res.end('default page.')
            break;
    }
});

server.listen(port, ip);

console.log("server running at http://" + ip + ":" + port);
