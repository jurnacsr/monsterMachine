ig.module(
	'game.entities.lab'
)
.requires(
	'impact.entity',
	'game.entities.labGibs'
)
.defines(function(){
	EntityLab = ig.Entity.extend({
		animSheet: new ig.AnimationSheet( 'media/labStructureSheet.png?t='+Math.random(), 50, 50 ),
		size: {x: 50, y:50},
		offset: {x: 0, y: 0},
		maxVel: {x: 0, y: 0},
		name: 'lab',
		
		baseProduction: new Big(1),
		gibP: 0.00075,
		
		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			this.name = Math.floor(x / CELL_SIZE) +":"+Math.floor(y / CELL_SIZE);
			
			// generate a random portal
			var index = Math.floor(Math.random() * 3);
			
			// Add the animations
			var startFrame = index * 4;
			this.addAnim( 'idle', 1-(Math.random() / 5), [startFrame, startFrame + 1, startFrame + 2, 
										startFrame + 3, startFrame + 2, startFrame + 1]);
			
		},
		
		update: function() {
			this.parent();
			
			if (Math.random() <= this.gibP) {
			
				// spawn a few gibs
				var numGibs = 1;
				
				for (var i = 0; i < numGibs; i++) {
					ig.game.spawnEntity(EntityLabGibs, this.pos.x + this.size.x/2 - 20, this.pos.y + this.size.y/2 - 20);
				}
			}
		},
		
		getIncome: function() {
			if (!ig.game.loseSadness()) {
				return new Big(0);
			}
			return ig.game.getLabUpgrades(this.baseProduction);
		}
	});
});