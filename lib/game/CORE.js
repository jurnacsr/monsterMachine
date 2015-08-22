var DEBUG = false;

var CELL_SIZE = 50;
var MONSTER = "Monsters";
var CURRENCY = "Sadness";

var GENERATOR_INCREASE_AMT = 0.25;
var PORTAL_INCREASE_AMT = 0.25;
var LAB_INCREASE_AMT = 0.25;

var UPGRADE_INCREASE_AMT = 0.75;

var STRUCTURE_DESCRIPTIONS = {};
STRUCTURE_DESCRIPTIONS["generator"] = "A gooey creepy mess\n of limbs and ick.  \nGenerates monsters.\nCost: $$ monsters"
STRUCTURE_DESCRIPTIONS["portal"] = "A portal into a child's \nnightmare.  May consume \nmonsters to make sadness.\nCost: $$ monsters"
STRUCTURE_DESCRIPTIONS["lab"] = "A horrifying lab where mad\nscience rules.  Consumes \nsadness to make science.\nCost: $$ monsters"

var UPGRADE_DESCRIPTIONS = {};
UPGRADE_DESCRIPTIONS["generator"] = "More monsters!  More monsters!\nGenerators produce more monsters.\nCurrent Level: &&\nCost: $$ goo";
UPGRADE_DESCRIPTIONS["portal"] = "Portals produce more tears.\nLet the nightmares continue!  Scream!\nCurrent Level: &&\nCost: $$ goo";
UPGRADE_DESCRIPTIONS["portal_chance"] = "Efficiency! Portals have less chance to\nconsume a monster.\nCurrent Level: &&\nCost: $$ goo";
UPGRADE_DESCRIPTIONS["lab"] = "Lack of knowledge is scary ignorance.\nLabs produce more goo.\nCurrent Level: &&\nCost: $$ goo";

function log(msg) {
	if (DEBUG) {
		console.log(msg);
	}
}

function randomTitle() {
	var titles = [
		"I am the Monster?!",
		"Yes, you are the Monster",
		"The tears of children fuel me",
		"GLADOS was right, you monster",
		"You're scaring the kids",
		"Don't look in the mirror",
		"Who can resist the evil of THRILLER",
		"Monsters, LLC",
	]
	
	var randIndex = Math.floor(Math.random() * titles.length);
	document.title = titles[randIndex];
}

function randomMonster() {
	var currencyList = [
		"Creepy Crawlies",
		"Nightmares",
		"Tentacled Horrors",
		"Vampires",
		"Werewolves",
		"Zombies",
		"Swamp Things",
	]
	
	var randIndex = Math.floor(Math.random() * currencyList.length);
	MONSTER = currencyList[randIndex];
}
function randomCurrency() {
	var currencyList = [
		"Tears of Sadness",
		"Innocent Screams",
		"Nightmare Twitches",
		"Falling Nightmares",
		"Noises in the Dark"
	]
	
	var randIndex = Math.floor(Math.random() * currencyList.length);
	currency = currencyList[randIndex];
}