/**
 *
 * @author:       Swornim Barahi
 * @name:         Lab 0
 * @class:        CSC321A (Design and Analysis of Algorithms)
 * @description:  Implement the Gale Shapley Algorithm
 *                (with Integers instead of names)
 *                Started writing at 9/15/2019
 * @summary:      To run this code you must first have the following
 *                installed.
 *                 * Node       https://nodejs.org/en/
 *                 * Yarn       https://yarnpkg.com/en/docs/install
 *                In the terminal, run the following commands
 *                 * yarn
 *                 * node ./gs1.js
 */

// importing modules
const _ = require("underscore");
const { performance } = require("perf_hooks");

/**
 *
 * @argument { number[] } suitors   The array of suitors
 * @argument { number[] } girls     The array of girls
 * @returns { Object/Map }          The preferences map with
 *                                  each person's preference list
 *
 * @description                     The function takes in a list of
 *                                  suitors and girls, applies Fisher-Yates
 *                                  Shuffle then adds them to a
 *                                  disctionary to return
 *
 */
const createRandomPreferenceList = (suitors, girls) => {
	let girlPreferences = new Object();
	let suitorPreferences = new Object();
	for (let suitor of suitors) {
		suitorPreferences[suitor] = [0, _.shuffle(girls)];
	}
	for (let girl of girls) {
		girlPreferences[girl] = _.shuffle(suitors);
	}
	return [suitorPreferences, girlPreferences];
};

/**
 *
 * @param { Object/Map } preferences      The randomized map with each
 *                                        person's preference list
 * 
 * @returns { void }
 *
 * @description                           Prints the map in a tabular format
 *
 */
const printPreferenceTable = (suitorPreferences, girlPreferences) => {
	console.log("Preference Table:");
	for (let entry in suitorPreferences) {
		console.log(entry + ":\t", suitorPreferences[entry][1].join("  "));
	}
	for (let entry in girlPreferences) {
		console.log(entry + ":\t", girlPreferences[entry].join("  "));
	}
};

/**
 *
 * @param {Map} matches   The matches
 *
 * @returns {void}
 *
 * @description           Prints out the matching pairs after the
 *                        algorithm is completed
 */
const printResult = matches => {
	let output = [];

	for (let entry of matches) {
		output.push([entry[1], entry[0]]);
	}

	output.sort();

	console.log("Pairings:");
	for (let elem of output) {
		console.log("\t", elem.join(" - "));
	}
};

/**
 *
 * @param { number[] }    suitors       The array of suitors
 * @param { Object/Map }  preferences   The randomized map with each
 *                                      person's preference list
 *
 * @returns { Map }                     Return the map of the matches
 *                                      from the Gale-Shapely Algorithm
 *
 * @description                         The steps are explained in the
 *                                      function body
 */
const galeShapley = (suitors, suitorPreferences, girlPreferences, verbose) => {
	// Initialize Map to add matched pairs
	let matches = new Map();

	// While there exists a man who is not engaged
	// and still has a woman to propose to
	while (suitors.length !== 0) {
		// currentSuitor is the man who proposes
		let currentSuitor = suitors.pop();
		let currentPreferenceNumber = suitorPreferences[currentSuitor][0];
		suitorPreferences[currentSuitor][0]++;

		// currentGirl is the preferred girl for currentSuitor
		let currentGirl =
			suitorPreferences[currentSuitor][1][currentPreferenceNumber];
		verbose && console.log(currentSuitor, "proposes to", currentGirl);

		// If currentGirl is not engaged
		if (!matches.has(currentGirl)) {
			// currentSuitor and currentGirl get engaged
			matches.set(currentGirl, currentSuitor);
			verbose && console.log(currentSuitor, "is engaged to", currentGirl);
		} else if (
			// If currentGirl is engaged and prefers their matched
			// partner to currentSuitor
			girlPreferences[currentGirl].indexOf(currentSuitor) >
			girlPreferences[currentGirl].indexOf(matches.get(currentGirl))
		) {
			// The current suitor has to wait their turn
			suitors.push(currentSuitor);
		} else {
			// If currentGirl prefers currentSuitor she replaces
			// her partner with currentSuitor
			suitors.push(matches.get(currentGirl));
			verbose && console.log(currentGirl, "dumps", matches.get(currentGirl));
			matches.set(currentGirl, currentSuitor);
		}
	}
	return matches;
};

/**
 *
 * @returns { Map }                     Return the map of the matches
 *                                      from the Gale-Shapely Algorithm
 *
 * @description                         The steps are explained in the
 *                                      function body
 */
function runGaleShapley(num = 1000, verbose) {
	let suitors = [];
	let girls = [];

	for (let i = 0; i < num; i++) {
		suitors.push(i);
		girls.push(i);
	}

	// Creating a preference list
	let [suitorPreferences, girlPreferences] = createRandomPreferenceList(
		suitors,
		girls
	);

	// Log the Table
	verbose && printPreferenceTable(suitorPreferences, girlPreferences);

	verbose && console.log("\n\n");

	// Time the algorithm
	let t0 = performance.now();

	// Run the Gale-Shapley Algorithm
	let matches = galeShapley(
		suitors,
		suitorPreferences,
		girlPreferences,
		verbose
	);

	verbose && console.log("\n\n");

	// Log the time taken
	let t1 = performance.now();
	console.log(num, t1 - t0);
	// console.log((process.cpuUsage(startUsage)["user"] / 1000000).toFixed(6));

	// Log the Results
	verbose && printResult(matches);
}

/**
 * 
 * @returns { void }
 * 
 * @description   This function initializes all necessary resources to run
 *                the Gale-Shapley Algorithm
 */
function main() {
	const verbose = process.argv[3] === "-v" || process.argv[3] === "verbose";
	runGaleShapley(Number(process.argv[2]), verbose);
}

// Run the main
main();
