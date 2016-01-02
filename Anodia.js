
var rl = require('readline');
var async = require('async');

var Anodia = {

	logging: -1,
	console: false,

	list_modules: [],
	module: [],

	init: function(callback) {
		Anodia.log(0,'Starting initialization...');

		async.series([
			this.enable_console.bind(this),
			this.load_modules.bind(this),
			this.init_modules.bind(this),
			function(cb) {
				Anodia.log(0,'Initialization done');
				cb(null);
				callback(null);
			}
		], function(err,results) {
			if(err)
				Anodia.log(1,err);
		});
	},

	add_module: function(nom, dossier) {
		this.list_modules[nom] = dossier;
	},

	enable_console: function(callback) {
		Anodia.log(2,"enable_console");
		if (this.console) {
			this.console = rl.createInterface({
				input: process.stdin,
				output: process.stdout
			});

			this.console.setPrompt('> ');

			this.console.on('line', function(line) {
				if (line == "exit") {
					this.exit();
				} else if (line != "") {
					line = line.split(" ");
					this.command(line);
				}
				this.console.prompt();
			}.bind(this)).on('close', function() {
				this.exit();
				//console.log("\n   ^C again to quit");
			}.bind(this));
		}

		callback(null);
	},

	load_modules: function(callback) {
		Anodia.log(2,"load_modules");
		for(var name in this.list_modules) {
			this.module[name] = require('../'+this.list_modules[name]+'/index.js');
			// require is already sync
		}

		callback(null);
	},

	init_modules: function(callback) {
		Anodia.log(2,"init_modules");

		tasks = [];
		for( name in this.module ) {
			tasks.push(function(cb) {
				this.module[name].init(this,cb);
			}.bind(this));
		}

		tasks.push(function() {
			callback(null);
		})

		async.series(tasks,function(err, results) {
			if (err)
				Anodia.log(1,err);
		});
	},

	run: function() {
		Anodia.log(0,'Running Anodia...\n');
		this.console.prompt();
	},

	exit: function() {

		console.log("");
		Anodia.log(0,'Exiting Anodia...\n');
		tasks = [];
		for ( name in this.module ) {
			tasks.push(function(cb) {
				this.module[name].exit(cb);
			}.bind(this));
		}

		tasks.push(function() {
			process.exit();
		});

		async.series(tasks, function(err, results) {
			if (err)
				Anodia.log(1,err);
		});
	},

	command: function(cmd) {
		var name = cmd.shift();

		if(this.module[name]) {
			this.module[name].command(cmd);
		} else {
			console.log("Unknown module: "+name);
		}
	},

	log: function(level, msg, brk) {
		if (this.logging >= level) {
			for(var i = 0; i < brk-1; i++) { console.log("\n") }
			if (level == 1) {msg = "ERROR: "+msg} else if (level == 2) {msg = "   "+msg}
			console.log("A"+level+" > "+msg);
		}
	}
};

module.exports = Anodia;