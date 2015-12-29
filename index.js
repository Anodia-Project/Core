

var Anodia = require('./Anodia.js');

//arduino": "Communication-Arduino"


function args() {

	var args = process.argv.slice(2);
	for(key in args) {
		if (args[key] == "-l" || args[key] == "--log") {
			Anodia.log = true;
		} else if (args[key] == "-c" || args[key] == "--console") {
			Anodia.console = true;
		}
	}

}

////////////////////////////////


args();

Anodia.init();
Anodia.run();