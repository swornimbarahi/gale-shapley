/**
 *
 * @author:       Swornim Barahi
 * @name:         Lab 0
 * @class:        CSC321A (Design and Analysis of Algorithms)
 * @description:  Implement the Gale Shapley Algorithm
 *                (with a data of 10 suitors and 10 girls)
 *                Started writing at 9/10/2019
 * @summary:      To run this code you must first have the following
 *                installed.
 *                 * Node       https://nodejs.org/en/
 *                 * Yarn       https://yarnpkg.com/en/docs/install
 *                In the terminal, run the following commands
 *                 * yarn
 *                 * node ./gs.js
 */

// importing modules
const _ = require("underscore");
const readline = require("readline");

/**
 *
 * @argument { string[] } suitors   The array of suitors
 * @argument { string[] } girls     The array of girls
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
	let preferences = new Object();
	for (let suitor of suitors) {
		preferences[suitor] = [0, _.shuffle(girls)];
	}
	for (let girl of girls) {
		preferences[girl] = [0, _.shuffle(suitors)];
	}
	return preferences;
};

/**
 *
 * @param { Object/Map } preferences      The randomized map with each
 *                                        person's preference list
 *
 * @description                           Prints the map in a tabular format
 *
 */
const printPreferenceTable = preferences => {
	console.log("Preference Table:");
	for (let entry in preferences) {
		console.log(entry + ":\t", preferences[entry][1].join("  "));
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
 * @param { string[] }    suitors       The array of suitors
 * @param { Object/Map }  preferences   The randomized map with each
 *                                      person's preference list
 *
 * @returns { Map }                     Return the map of the matches
 *                                      from the Gale-Shapely Algorithm
 *
 * @description                         The steps are explained in the
 *                                      function body
 */
const galeShapley = (suitors, preferences) => {
	// Initialize Map to add matched pairs
	let matches = new Map();

	suitors.reverse();

	// While there exists a man who is not engaged
	// and still has a woman to propose to
	while (suitors.length !== 0) {
		// currentSuitor is the man who proposes
		let currentSuitor = suitors.pop();
		let currentPreferenceNumber = preferences[currentSuitor][0];
		preferences[currentSuitor][0]++;

		// currentGirl is the preferred girl for currentSuitor
		let currentGirl = preferences[currentSuitor][1][currentPreferenceNumber];
		console.log(currentSuitor, "proposes to", currentGirl);

		// If currentGirl is not engaged
		if (!matches.has(currentGirl)) {
			// currentSuitor and currentGirl get engaged
			matches.set(currentGirl, currentSuitor);
			console.log(currentSuitor, "is engaged to", currentGirl);
		} else if (
			// If currentGirl is engaged and prefers their matched
			// partner to currentSuitor
			preferences[currentGirl][1].indexOf(currentSuitor) >
			preferences[currentGirl][1].indexOf(matches.get(currentGirl))
		) {
			// The current suitor has to wait their turn
			suitors.push(currentSuitor);
		} else {
			// If currentGirl prefers currentSuitor she replaces
			// her partner with currentSuitor
			suitors.push(matches.get(currentGirl));
			console.log(currentGirl, "dumps", matches.get(currentGirl));
			matches.set(currentGirl, currentSuitor);
		}
	}
	return matches;
};

/**
 *
 * @param { string[] }    suitors       The array of suitors
 * @param { Object/Map }  preferences   The randomized map with each
 *                                      person's preference list
 *
 * @returns { Map }                     Return the map of the matches
 *                                      from the Gale-Shapely Algorithm
 *
 * @description                         The steps are explained in the
 *                                      function body
 */
function runGaleShapley() {
	let suitors = [
		"Jon",
		"Ian",
		"Hal",
		"Gav",
		"Fred",
		"Ed",
		"Dan",
		"Col",
		"Bob",
		"Abe"
	];

	let girls = [
		"Abi",
		"Bea",
		"Cath",
		"Dee",
		"Eve",
		"Fay",
		"Gay",
		"Hope",
		"Ivy",
		"Jan"
	];

	// Creating a preference list
	let preferences = createRandomPreferenceList(suitors, girls);

	// Log the Table
	printPreferenceTable(preferences);

	console.log("\n\n");

	// Time the algorithm
	const startUsage = process.cpuUsage();
	console.time("Elapsed wall clock time:\t");

	// Run the Gale-Shapley Algorithm
	let matches = galeShapley(suitors, preferences);

	console.log("\n\n");

	// Log the time taken
	console.timeEnd("Elapsed wall clock time:\t");
	console.log(
		"Elapsed CPU time:\t\t  " +
			(process.cpuUsage(startUsage)["user"] / 1000000).toFixed(6)
	);

	// Log the Results
	printResult(matches);
}

/**
 * @description   This function runs all the other necessary functions to run
 *                the Gale-Shapley Algorithm
 */
function main() {
	const rl = readline.createInterface(process.stdin, process.stdout);
  
  runGaleShapley();
  
  rl.setPrompt("Another trial? (y)es, (n)o\n");
  rl.prompt();

	rl.on("line", line => {
		if (line === "n" || line === "no") rl.close();

		runGaleShapley();

		rl.prompt();
	}).on("close", () => {
		process.exit(0);
	});
}

// Run the main
main();
