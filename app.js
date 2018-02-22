console.log('WWW Door start ...');

var ledPin = 13;
var firmata = require('firmata');

var board = new firmata.Board("/dev/ttyS0", function(err) {
    if (err) {
        console.log(err);
        board.reset();
        return;
    }

    console.log('connected...');
    console.log('board.firmware: ', board.firmware);

    board.pinMode(ledPin, board.MODES.OUTPUT);

    var url = require('url');
    var http = require('http');

    http.createServer(function(request, response) {
        var params = url.parse(request.url, true).query;
        try {
            if (params.value.toLowerCase() == 'high') {
                board.digitalWrite(ledPin, board.HIGH);
            } else if (params.value.toLowerCase() == 'low'){
                board.digitalWrite(ledPin, board.LOW);
            } else if (params.value.toLowerCase() == 'up'){
                board.sysexCommand([0x20,1]);
            } else if (params.value.toLowerCase() == 'down'){
                board.sysexCommand([0x21,1]);
            } else if (params.value.toLowerCase() == 'stop'){
                board.sysexCommand([0x22,1]);
            }
        } catch(e) {
            console.log(e);
        }
        response.writeHead(200);
        response.write("The value written was: " + params.value);
        response.end();
    }.bind(this)).listen(8080);

    console.log('Listening on port 8080 ...');
});
