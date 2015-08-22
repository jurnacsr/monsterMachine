ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	'game.entities.generator',
	'game.entities.portal',
	'game.entities.lab'
)
.defines(function(){

MyGame = ig.Game.extend({
		
	// Load a font
	bigFont: new ig.Font( 'media/bigFont.png?t='+Math.random()),
	scoreFont: new ig.Font( 'media/scoreFont.png?t='+Math.random()),
	structuresHeadingFont: new ig.Font( 'media/structuresHeadingFont.png?t='+Math.random()),
	structuresDescriptionFont: new ig.Font( 'media/structureDescriptionFont.png?t='+Math.random()),
	upgradeDescriptionFont: new ig.Font( 'media/upgradeDescriptionFont.png?t='+Math.random()),
	
	// UI panel
	uiPanel: new ig.Image("media/uiPanel.png?t="+Math.random()),
	
	// game grid image
	grid: new ig.Image("media/grid.png?t="+Math.random()),	
	gridSelector: new ig.Image("media/gridSelector.png?t="+Math.random()),
	
	// structure images
	structureImage: [
		new ig.Image("media/graveyardBase.png?t="+Math.random()),
		new ig.Image("media/caveBase.png?t="+Math.random()),
		new ig.Image("media/labBase.png?t="+Math.random())		
	],
	structureIndex: 0,
	
	// portal images
	portalImage: [
		new ig.Image("media/bedBase.png?t="+Math.random()),
		new ig.Image("media/basementBase.png?t="+Math.random()),
		new ig.Image("media/closetBase.png?t="+Math.random())		
	],
	portalIndex: 0,
	
	// lab images
	labImage: [
		new ig.Image("media/castleBase.png?t="+Math.random()),
		new ig.Image("media/brokenLabBase.png?t="+Math.random()),
		new ig.Image("media/masherBase.png?t="+Math.random())		
	],
	labIndex: 0,
	
	// map vars
	structureMap: [
		['','','','','','','','','',''],
		['','','','','','','','','',''],
		['','','','','','','','','',''],
		['','','','','','','','','',''],
		['','','','','','','','','',''],
		['','','','','','','','','',''],
		['','','','','','','','','',''],
		['','','','','','','','','',''],
		['','','','','','','','','',''],
		['','','','','','','','','','']
	],
	
	// mouse vars
	mouseX: -1,
	mouseY: -1,
	mouseInUI: false,
	mouseGridX: -1,
	mouseGridY: -1,
	holdingStructure: false,
	heldStructure: '',
	
	// game score vars
	monsters: new Big(10),
	monstersToAdd: new Big(0),
	tears: new Big(0),
	tearsToAdd: new Big(0),
	goo: new Big(0),
	gooToAdd: new Big(0),
	
	// structure costs
	generatorCost: new Big(10),
	portalCost: new Big(100),
	labCost: new Big(200),
	
	// lists for costs and income
	incomeTimer: new ig.Timer(),
	incomePerSecond: 5,
	
	// upgrade vars
	upgradeImages: new ig.Image("media/upgradeSheet.png?t="+Math.random()),
	generatorUpgradeLevel: 0,
	generatorUpgradeCost: new Big(100),
	
	portalUpgradeLevel: 0,
	portalUpgradeCost: new Big(200),
	
	portalUpgradeChanceLevel: 0,
	portalUpgradeChanceCost: new Big(200),
	
	labUpgradeLevel: 0,
	labUpgradeCost: new Big(400),
	
	// building place sound
	placeSound: new ig.Sound('media/sounds/place.ogg'),
	destroySound: new ig.Sound('media/sounds/destroy.ogg'),
	
	// sound settings
	soundEnabled: true,
	musicEnabled: true,
	soundIcons: new ig.Image("media/volumeIcons.png?t="+Math.random()),
	
	init: function() {
		// Initialize your game here; bind keys etc.
		ig.input.bind(ig.KEY.MOUSE1, "click");
		ig.input.bind(ig.KEY.MOUSE2, "destroy");
		ig.input.bind(ig.KEY.SPACE, "space");
		
		//randomMonster();
		//randomCurrency();
		
		// determine random structure icon
		this.structureIndex = Math.floor(Math.random() * 3);
		this.portalIndex = Math.floor(Math.random() * 3);
		this.labIndex = Math.floor(Math.random() * 3);
		
		// game music - this shit is dope son
		ig.music.add("media/music/track1.mp3"),
		ig.music.add("media/music/track2.mp3"),
		ig.music.add("media/music/track3.mp3"),
		ig.music.volume = 1.0;
		ig.music.play();
		
		// sound settings
		this.placeSound.volume = 0.25;
		this.destroySound.volume = 0.25;
	},
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		
		// Add your own, additional update code here
		this.mouseX = ig.input.mouse.x;
		this.mouseY = ig.input.mouse.y;
		this.mouseGridX = Math.floor(this.mouseX / CELL_SIZE);
		this.mouseGridY = Math.floor(this.mouseY / CELL_SIZE);
		this.mouseInUI = this.mouseX >= 499;
		
		this.monstersToAdd = new Big(0);
		this.tearsToAdd = new Big(0);
		if (this.incomeTimer.delta() >= 1/this.incomePerSecond) {
			
			// generator income
			for (var i = 0; i < this.getEntitiesByType(EntityGenerator).length; i++) {
				var m = this.getEntitiesByType(EntityGenerator)[i];
				this.monstersToAdd = this.monstersToAdd.plus(m.getIncome());
			}
			this.monsters = this.monsters.add(this.monstersToAdd.div(new Big(this.incomePerSecond)));
			
			// portal income
			for (var i = 0; i < this.getEntitiesByType(EntityPortal).length; i++) {
				var m = this.getEntitiesByType(EntityPortal)[i];
				this.tearsToAdd = this.tearsToAdd.plus(m.getIncome());
			}
			this.tears = this.tears.add(this.tearsToAdd.div(new Big(this.incomePerSecond)));
			
			// lab income
			for (var i = 0; i < this.getEntitiesByType(EntityLab).length; i++) {
				var m = this.getEntitiesByType(EntityLab)[i];
				this.gooToAdd = this.tearsToAdd.plus(m.getIncome());
			}
			this.goo = this.goo.add(this.gooToAdd.div(new Big(this.incomePerSecond)));
			
			this.incomeTimer.reset();
		}
		
		if (ig.input.released("click")) {
			this.handleClick();
		}
		
		if (ig.input.released("destroy")) {
			this.handleDestroyClick();
		}
		
		if (this.musicEnabled) {
			ig.music.volume = 1.0;
		} else {
			ig.music.volume = 0;
		}
		if (this.soundEnabled) {
			this.placeSound.volume = 0.25;
			this.destroySound.volume = 0.25;
		} else {
			this.placeSound.volume = 0;
			this.destroySound.volume = 0;
		}
		
		// pretty cursor
		if (this.mouseOverAnything()) {
			document.getElementById("canvas").style.cursor = "pointer";
		} else { 
			document.getElementById("canvas").style.cursor = "default";		
		}	
		
		//log(this.holdingStructure + ": "+this.heldStructure);
		
		//log("Mouse: "+this.mouseX +", "+this.mouseY+". Grid Pos: "
		//+ this.mouseGridX +", "+this.mouseGridY+".  In UI: "
		//+this.mouseInUI +".  Map: "+this.structureMap[this.mouseGridY][this.mouseGridX]);
	},
	
	mouseOverAnything: function () { 
	 return this.mouseOverMusicIcon() || this.mouseOverSoundIcon() || this.mouseOverStructure(0) || this.mouseOverStructure(1) || this.mouseOverStructure(2) || this.mouseOverUpgrade(0) || this.mouseOverUpgrade(1) || this.mouseOverUpgrade(2) || this.mouseOverUpgrade(3);
	},
	
	handleDestroyClick: function() {
		var s = this.getEntityByName(this.mouseGridX + ":"+this.mouseGridY);
		if (s) {
			s.kill();
			this.structureMap[this.mouseGridY][this.mouseGridX] = '';
			this.destroySound.play();
		}
	},
	
	handleClick: function() {
		
		// are we holding a structure?
		if (this.holdingStructure) {
			if (this.mouseInUI) {
				log("Holding structure, clicked on UI.  dropping.");
				this.holdingStructure = false;
				this.heldStructure = '';
				return;				
			}
			log("Holding structure, clicked on map");
			if (this.mapSpotEmpty()) {
				log("Map spot empty.");
				this.setMapCell(this.heldStructure);
				this.holdingStructure = false;
				
				// money check! 
				if (this.heldStructure == 'generator') {
					if (this.monsters.lt(this.generatorCost)) {
						return;
					} else {
						this.monsters = this.monsters.minus(this.generatorCost);
						this.generatorCost = this.generatorCost.plus(this.generatorCost.times(GENERATOR_INCREASE_AMT).round());
						log(this.generatorCost.toString());
						this.spawnEntity(EntityGenerator, this.mouseGridX * CELL_SIZE, this.mouseGridY * CELL_SIZE);
						this.placeSound.play();
					}
				}
				else if (this.heldStructure == 'portal') {
					if (this.monsters.lt(this.portalCost)) {
						return;
					} else {
						this.monsters = this.monsters.minus(this.portalCost);
						this.portalCost = this.portalCost.plus(this.portalCost.times(PORTAL_INCREASE_AMT).round());
						log(this.portalCost.toString());
						this.spawnEntity(EntityPortal, this.mouseGridX * CELL_SIZE, this.mouseGridY * CELL_SIZE);
						this.placeSound.play();
					}
				}
				else if (this.heldStructure == 'lab') {
					if (this.monsters.lt(this.labCost)) {
						return;
					} else {
						this.monsters = this.monsters.minus(this.labCost);
						this.labCost = this.labCost.plus(this.portalCost.times(LAB_INCREASE_AMT).round());
						log(this.labCost.toString());
						this.spawnEntity(EntityLab, this.mouseGridX * CELL_SIZE, this.mouseGridY * CELL_SIZE);
						this.placeSound.play();
					}
				}
				this.heldStructure = '';
			}
		}
		
		// was the click over a structure?
		if (this.mouseOverStructure(0)) {
			this.holdingStructure = true;
			this.heldStructure = 'generator';
		}
		else if (this.mouseOverStructure(1)) {
			this.holdingStructure = true;
			this.heldStructure = 'portal';
			
		}
		else if (this.mouseOverStructure(2)) {
			this.holdingStructure = true;
			this.heldStructure = 'lab';
			
		} else {
			this.holdingStructure = false;
			this.heldStructure = '';
		}
		
		// was the click over an upgrade?
		if (this.mouseOverUpgrade(0)) {
			// money check! 
			if (this.goo.lt(this.generatorUpgradeCost)) {
				return;
			} else {
				this.goo = this.goo.minus(this.generatorUpgradeCost);
				this.generatorUpgradeCost = this.generatorUpgradeCost.plus(this.generatorUpgradeCost.times(UPGRADE_INCREASE_AMT).round());
				log(this.generatorUpgradeCost.toString());
				this.generatorUpgradeLevel++;
			}		
		}
		if (this.mouseOverUpgrade(1)) {
			// money check! 
			if (this.goo.lt(this.portalUpgradeCost)) {
				return;
			} else {
				this.goo = this.goo.minus(this.portalUpgradeCost);
				this.portalUpgradeCost = this.portalUpgradeCost.plus(this.portalUpgradeCost.times(UPGRADE_INCREASE_AMT).round());
				log(this.portalUpgradeCost.toString());
				this.portalUpgradeLevel++;
			}		
		}
		if (this.mouseOverUpgrade(2)) {
			// money check! 
			if (this.goo.lt(this.portalUpgradeChanceCost)) {
				return;
			} else {
				this.goo = this.goo.minus(this.portalUpgradeChanceCost);
				this.portalUpgradeChanceCost = this.portalUpgradeChanceCost.plus(this.portalUpgradeChanceCost.times(UPGRADE_INCREASE_AMT).round());
				log(this.portalUpgradeChanceCost.toString());
				this.portalUpgradeChanceLevel++;
			}		
		}
		if (this.mouseOverUpgrade(3)) {
			// money check! 
			if (this.goo.lt(this.labUpgradeCost)) {
				return;
			} else {
				this.goo = this.goo.minus(this.labUpgradeCost);
				this.labUpgradeCost = this.labUpgradeCost.plus(this.labUpgradeCost.times(UPGRADE_INCREASE_AMT).round());
				log(this.labUpgradeCost.toString());
				this.labUpgradeLevel++;
			}		
		}
		
		// was the mouse over the music icon?
		if (this.mouseOverMusicIcon()) {
			this.musicEnabled = !this.musicEnabled;
		}
		// was the mouse over the sound icon?
		if (this.mouseOverSoundIcon()) {
			this.soundEnabled = !this.soundEnabled;
		}
		
	},
	
	// factors generator upgrades
	getGeneratorUpdgrades: function(base) {
		var b;
		
		// these loops are terrible...
		for (var i = 0; i < this.generatorUpgradeLevel; i++) {
			b = base.times(0.5);
			base = base.plus(b);
		}
		return base;
	},
	
	// factors portal upgrades - monster loss chance
	getPortalLossChanceUpgrades: function() {
		var p = 0.99;
		
		// these loops are terrible...
		for (var i =0; i < this.portalUpgradeChanceLevel; i++ ) {
			p = p - (p * 0.15);
		}
		
		return p;
	},
	
	// factors portal output upgrades
	getPortalUpgrades: function(base) {
		var b;
		
		// these loops are terrible...
		for (var i = 0; i < this.portalUpgradeLevel; i++) {
			b = base.times(0.5);
			base = base.plus(b);
		}
		return base;
	},
	
	// factors lab output upgrades
	getLabUpgrades: function(base) {
		var b;
		
		// these loops are terrible...
		for (var i = 0; i < this.labUpgradeLevel; i++) {
			b = base.times(0.5);
			base = base.plus(b);
		}
		return base;
	},
	
	// lost a monster to a portal!
	loseMonster: function() {
		if (this.monsters.lte(new Big(0))) return false;
		this.monsters = this.monsters.minus(new Big(1 / this.incomePerSecond));
		return true;
	},
	
	// lose sadness to gain goo
	loseSadness: function() {
		if (this.tears.lte(new Big(0))) return false;
		this.tears = this.tears.minus(new Big(1 / this.incomePerSecond));
		return true;
	},
	
	// check the map array if it contains a non-empty string
	mapSpotEmpty: function() {
		return this.structureMap[this.mouseGridY][this.mouseGridX] === '';
	},
	
	// set a map cell to a structure
	setMapCell: function(structure) {
		this.structureMap[this.mouseGridY][this.mouseGridX] = structure;
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		
		if (!this.mouseInUI) {
			this.gridSelector.draw(this.mouseGridX * CELL_SIZE, this.mouseGridY * CELL_SIZE);
		}
		
		// draw UI elements
		this.bigFont.draw("Monster Machine!", 625, 10, ig.Font.ALIGN.CENTER);
		this.scoreFont.draw(MONSTER + ":", 625, 50, ig.Font.ALIGN.CENTER);
		this.scoreFont.draw(this.monsters.toFixed(0), 625, 70, ig.Font.ALIGN.CENTER);
		
		this.scoreFont.draw(CURRENCY + ":", 625, 100, ig.Font.ALIGN.CENTER);
		this.scoreFont.draw(this.tears.toFixed(0), 625, 120, ig.Font.ALIGN.CENTER);
		
		// structures
		this.structuresHeadingFont.draw("Structures", 625, 170, ig.Font.ALIGN.CENTER);
		var index = 500 + 25;
		ig.system.context.fillStyle = "#190838";
		if (this.mouseOverStructure(0)) ig.system.context.fillStyle = "#E0C200";
		if (this.heldStructure == 'generator') ig.system.context.fillStyle = "#DB3A32";
		ig.system.context.fillRect(index - 2, 200 - 2, 54, 54);
		this.structureImage[this.structureIndex].draw(index , 200);
		if (this.generatorCost.gt(this.monsters)) {
			ig.system.context.fillStyle = "rgba(22, 22, 22, 0.75)";
			ig.system.context.fillRect(index - 2, 200 - 2, 54, 54);
		}
		
		index += 75;
		ig.system.context.fillStyle = "#190838";
		if (this.mouseOverStructure(1)) ig.system.context.fillStyle = "#E0C200";
		if (this.heldStructure == 'portal') ig.system.context.fillStyle = "#DB3A32";
		ig.system.context.fillRect(index - 2, 200 - 2, 54, 54);
		this.portalImage[this.portalIndex].draw(index , 200);
		if (this.portalCost.gt(this.monsters)) {
			ig.system.context.fillStyle = "rgba(22, 22, 22, 0.75)";
			ig.system.context.fillRect(index - 2, 200 - 2, 54, 54);
		}
		
		index += 75;
		ig.system.context.fillStyle = "#190838";
		if (this.mouseOverStructure(2)) ig.system.context.fillStyle = "#E0C200";
		if (this.heldStructure == 'lab') ig.system.context.fillStyle = "#DB3A32";
		ig.system.context.fillRect(index - 2, 200 - 2, 54, 54);
		this.labImage[this.labIndex].draw(index , 200);
		if (this.labCost.gt(this.monsters)) {
			ig.system.context.fillStyle = "rgba(22, 22, 22, 0.75)";
			ig.system.context.fillRect(index - 2, 200 - 2, 54, 54);
		}
		
		if (this.mouseOverStructure(0)) {
			this.structuresDescriptionFont.draw(STRUCTURE_DESCRIPTIONS["generator"].replace("$$", this.generatorCost.toFixed(0)), 625, 255, ig.Font.ALIGN.CENTER);
		}
		if (this.mouseOverStructure(1)) {
			this.structuresDescriptionFont.draw(STRUCTURE_DESCRIPTIONS["portal"].replace("$$", this.portalCost.toFixed(0)), 625, 255, ig.Font.ALIGN.CENTER);
		}
		if (this.mouseOverStructure(2)) {
			this.structuresDescriptionFont.draw(STRUCTURE_DESCRIPTIONS["lab"].replace("$$", this.labCost.toFixed(0)), 625, 255, ig.Font.ALIGN.CENTER);
		}
		
		if (this.mouseOverUpgrade(0)) {
			this.upgradeDescriptionFont.draw(UPGRADE_DESCRIPTIONS["generator"].replace("$$", this.generatorUpgradeCost.toFixed(0)).replace("&&", this.generatorUpgradeLevel), 625, 425, ig.Font.ALIGN.CENTER);
		}
		if (this.mouseOverUpgrade(1)) {
			this.upgradeDescriptionFont.draw(UPGRADE_DESCRIPTIONS["portal"].replace("$$", this.portalUpgradeCost.toFixed(0)).replace("&&", this.portalUpgradeLevel), 625, 425, ig.Font.ALIGN.CENTER);
		}
		if (this.mouseOverUpgrade(2)) {
			this.upgradeDescriptionFont.draw(UPGRADE_DESCRIPTIONS["portal_chance"].replace("$$", this.portalUpgradeChanceCost.toFixed(0)).replace("&&", this.portalUpgradeChanceLevel), 625, 425, ig.Font.ALIGN.CENTER);
		}
		if (this.mouseOverUpgrade(3)) {
			this.upgradeDescriptionFont.draw(UPGRADE_DESCRIPTIONS["lab"].replace("$$", this.labUpgradeCost.toFixed(0)).replace("&&", this.labUpgradeLevel), 625, 425, ig.Font.ALIGN.CENTER);
		}
		
		// draw upgrades		
		this.scoreFont.draw("Goo: "+this.goo.toFixed(0), 625, 340, ig.Font.ALIGN.CENTER);
		
		var index = 500 + 14;
		ig.system.context.fillStyle = "#EFF4FF";
		if (this.mouseOverUpgrade(0)) ig.system.context.fillStyle = "#E0C200";
		//if (this.heldStructure == 'generator') ig.system.context.fillStyle = "#DB3A32";
		ig.system.context.fillRect(index - 2, 370 - 2, 54, 54);
		this.upgradeImages.drawTile(index, 370, 0, 50);
		if (this.generatorUpgradeCost.gt(this.goo)) {
			ig.system.context.fillStyle = "rgba(22, 22, 22, 0.75)";
			ig.system.context.fillRect(index - 2, 370 - 2, 54, 54);
		}
		
		index += 57;
		ig.system.context.fillStyle = "#EFF4FF";
		if (this.mouseOverUpgrade(1)) ig.system.context.fillStyle = "#E0C200";
		//if (this.heldStructure == 'generator') ig.system.context.fillStyle = "#DB3A32";
		ig.system.context.fillRect(index - 2, 370 - 2, 54, 54);
		this.upgradeImages.drawTile(index, 370, 1, 50);
		if (this.portalUpgradeCost.gt(this.goo)) {
			ig.system.context.fillStyle = "rgba(22, 22, 22, 0.75)";
			ig.system.context.fillRect(index - 2, 370 - 2, 54, 54);
		}
		
		index += 57;
		ig.system.context.fillStyle = "#EFF4FF";
		if (this.mouseOverUpgrade(2)) ig.system.context.fillStyle = "#E0C200";
		//if (this.heldStructure == 'generator') ig.system.context.fillStyle = "#DB3A32";
		ig.system.context.fillRect(index - 2, 370 - 2, 54, 54);
		this.upgradeImages.drawTile(index, 370, 2, 50);
		if (this.portalUpgradeChanceCost.gt(this.goo)) {
			ig.system.context.fillStyle = "rgba(22, 22, 22, 0.75)";
			ig.system.context.fillRect(index - 2, 370 - 2, 54, 54);
		}
		
		index += 57;
		ig.system.context.fillStyle = "#EFF4FF";
		if (this.mouseOverUpgrade(3)) ig.system.context.fillStyle = "#E0C200";
		//if (this.heldStructure == 'generator') ig.system.context.fillStyle = "#DB3A32";
		ig.system.context.fillRect(index - 2, 370 - 2, 54, 54);
		this.upgradeImages.drawTile(index, 370, 3, 50);
		if (this.labUpgradeCost.gt(this.goo)) {
			ig.system.context.fillStyle = "rgba(22, 22, 22, 0.75)";
			ig.system.context.fillRect(index - 2, 370 - 2, 54, 54);
		}
		
		// music/volume icons
		if (this.musicEnabled) {
			this.soundIcons.drawTile(515, 120, 0, 40);
		} else {
			this.soundIcons.drawTile(515, 120, 1, 40);			
		}
		
		if (this.soundEnabled) {
			this.soundIcons.drawTile(690, 120, 2, 40);			
		} else {
			this.soundIcons.drawTile(690, 120, 3, 40);			
		}
	},
	
	// is the mouse over a structure icon?
	mouseOverStructure: function(index) {
		return this.mouseX >= 525 + (75 * index) && this.mouseY >= 200 
			&& this.mouseX <= 575 + (75 * index) && this.mouseY <= 250;		
	},
	
	// is the mouse over an upgrade icon?
	mouseOverUpgrade: function(index) {
		return this.mouseX >= 514 + (57 * index) && this.mouseY >= 370 
			&& this.mouseX <= 564 + (57 * index) && this.mouseY <= 420;		
	},
	
	// is the mouse over the music icon?
	mouseOverMusicIcon: function() {
		return this.mouseX >= 520 && this.mouseY >= 120 
			&& this.mouseX <= 550 && this.mouseY <= 160;		
	},
	
	// is the mouse over the sound icon?
	mouseOverSoundIcon: function() {
		return this.mouseX >= 690 && this.mouseY >= 120 
			&& this.mouseX <= 725 && this.mouseY <= 160;		
	},
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 750, 500, 1 );

});
