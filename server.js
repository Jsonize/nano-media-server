opt = require('node-getopt').create([
    ["", "port=PORT", "server port (default 5000)"],
    ["", "staticserve=DIRECTORY", "statically serve directory (default disabled)"],
    ["", "directory=DIRECTORY", "media directory (default '/tmp')"],
    ["", "sslkey=SSLKEY", "ssl key"],
    ["", "sslcert=SSLCERT", "ssl cert"],
    ["", "ffmpegopt=FFMPEG", "ffmpeg options"]
]).bindHelp().parseSystem().options;

var Server = require(__dirname + "/src/server_service.js");

if (opt.ffmpegopt) {
    var ffmpegOptionsObject = JSON.parse(JSON.stringify(opt.ffmpegopt));

    if (typeof ffmpegOptionsObject !== 'object')
        jsonObject = (new Function('return ' + opt.ffmpegopt))();
}

var server = Server.init({
    mediaDirectory: opt.directory || "/tmp",
    staticServe: opt.staticserve ,
    ffmpegOptions: ffmpegOptionsObject || {}
});

Server.run(server, opt.port || process.env.PORT || 5000, opt.sslkey, opt.sslcert);