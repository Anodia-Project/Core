
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
		})
	},

	run: function() {
		Anodia.log(0,'Running Anodia...');
	},

	log: function(level, msg) {
		if (this.logging >= level) {
			if (level == 1) {msg = "ERROR: "+msg} else if (level == 2) {msg = "   "+msg}
			console.log("A"+level+" > "+msg);
		}
	}
};

module.exports = Anodia;