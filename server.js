opt = require('node-getopt').create([
    ["", "port=PORT", "server port (default 5000)"],
    ["", "staticserve=DIRECTORY", "statically serve directory (default disabled)"],
    ["", "directory=DIRECTORY", "media directory (default '/tmp')"],
    ["", "sslkey=SSLKEY", "ssl key"],
    ["", "sslcert=SSLCERT", "ssl cert"]
]).bindHelp().parseSystem().options;

var Server = require(__dirname + "/src/server_service.js");

var server = Server.init({
	mediaDirectory: opt.directory || "/tmp",
	staticServe: opt.staticserve 
});

Server.run(server, opt.port || process.env.PORT || 5000, opt.sslkey, opt.sslcert);