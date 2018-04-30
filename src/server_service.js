var Express = require("express");
var FS = require("fs");
var Multer = require("multer");
var Ffmpeg = require("js-ffmpeg");

module.exports = {

	init: function (Config) {
		var upload = Multer({ storage: Multer.memoryStorage() });
        var ffmpegOptions = Config.ffmpegOptions;

		var express = Express();

		if (Config.staticServe)
			express.use("/static", Express["static"](Config.staticServe));

		var fullFile = function (filename) {
			return Config.mediaDirectory + "/" + filename;
		};

		express.use(function(request, response, next) {
			response.header("Access-Control-Allow-Origin", "*");
			response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			next();
		});

		express.get('/files/:filename', function (request, response) {
			console.log("Streaming " + request.params.filename);
			response.sendFile(fullFile(request.params.filename));
		});

		express.post("/files/:filename", upload.single('file'), function (request, response) {
			console.log("Storing " + request.params.filename);
			FS.writeFileSync(fullFile(request.params.filename), request.file.buffer);
			response.status(200).send({});
		});

		express.post("/files/:source/transcode/:target", function (request, response) {
			var target = fullFile(request.params.target);
			var video_source = fullFile(request.params.source);
			var audio_source = request.query.audio ? fullFile(request.query.audio) : null;
			var sources = [video_source];
			if (audio_source)
				sources.push(audio_souce);
			console.log("Transcoding " + request.params.source + (request.query.audio ? " + " + request.query.audio : "") + " -> " + request.params.target);
			Ffmpeg.ffmpeg_simple(sources, {}, target, null, null, ffmpegOptions).callback(function (error, value) {
				if (error)
					response.status(500).send(error);
				else
					response.status(200).send(value);
			});
		});

        express.post("/text-track/:filename/lang/:lang/label/:label", upload.single('file'), function (request, response) {
        	var _params = request.params;
            console.log("Storing text tracks" + _params.filename);
            // request.file has keys: fieldname, fieldname: 'file', originalname: 'bunny-en.vtt',
            // encoding: '7bit', mimetype: 'application/octet-stream', buffer: <Buffer ....>, size: 472 }
			// request.params has only one key filename: 'video-timestamp.vtt'
            FS.writeFileSync(fullFile(_params.filename), request.file.buffer);
            response.status(200).send({'lang': _params.lang, 'label': _params.label});
        });

        express.get("/text-track/:filename", function(request, response) {
            console.log("Streaming text tracks" + request.params.filename);
			response.sendFile(fullFile(request.params.filename));
        });

        express.get("/text-track/:filename/lang/:lang/label/:label", function(request, response) {
            console.log("Streaming detailed text tracks lang:" + request.params.lang + ', label: ' + request.params.label);
            // response.sendFile(fullFile(request.params.filename));
            response.sendFile(fullFile(request.params.filename));
            response.status(200).send({'lang': request.params.lang, 'label': request.params.label});
        });

		return express;
	},

	run: function (server, port, sslKey, sslCert) {
		port = port || 5000;
		if (sslKey && sslCert) {
			require("https").createServer({
				key: FS.readFileSync(sslKey),
				cert: FS.readFileSync(sslCert),
				requestCert: false,
				rejectUnauthorized: false
			}, server).listen(port, function () {
				console.log("Listening on", port);
			});
		} else {
			server.listen(port, function () {
				console.log("Listening on", port);
			});
		}
	}

};
