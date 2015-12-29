
var rl = require('readline');

var Anodia = {

	log: false,
	console: false,

	list_modules: [],
	modules: [],

	init: function() {
		console.log('Starting initialization...');

		if (this.console) {
			this.console = rl.createInterface({
				input: process.stdin,
				output: process.stdout
			});
		}

		this.load_modules();	
		this.init_modules();
		
		console.log('Initialization done');
	},

	load_modules: function() {
		for(var name in this.list_modules) {
			this.modules[name] = require('../'+list[name]+'/index.js');
		}
	},

	init_modules: function() {
		for( name in this.modules ) {
			this.modules[name].init();
		}
	},

	run: function() {
		console.log('Running Anodia...');
	}
};

module.exports = Anodia;