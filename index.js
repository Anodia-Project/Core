
var Anodia = require('./Anodia.js');
var async = require('async');

function args() {

	var args = process.argv.slice(2);
	for(key in args) {
		if (["-l","-l0","--log","--log0"].indexOf(args[key]) > -1) {
			Anodia.logging = 0; // Level: Mandatory
		} else if (["-l1","--log1"].indexOf(args[key]) > -1) {
			Anodia.logging = 1; // Level: Errors
		} else if (["-l2","--log2"].indexOf(args[key]) > -1) {
			Anodia.logging = 2; // Level: Debug
		} else if (["-c", "--console"].indexOf(args[key]) > -1) {
			Anodia.console = true;
		}
	}

}

////////////////////////////////


args();

// Ajout des modules

Anodia.add_module("arduino", "Communication-Arduino");

// End

async.series([
	Anodia.init.bind(Anodia),
	Anodia.run.bind(Anodia)
],
function(err, results) {
	if (err)
		console.log("Anodia a arrété de fonctionner lamentablement. Pouvez-vous lui pardonner ?");
});