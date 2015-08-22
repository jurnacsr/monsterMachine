ig.module(
	'game.entities.portal'
)
.requires(
	'impact.entity',
	'game.entities.portalGibs'
)
.defines(function(){
	EntityPortal = ig.Entity.extend({
		animSheet: new ig.AnimationSheet( 'media/portalSheet.png?t='+Math.random(), 50, 50 ),
		size: {x: 50, y:50},
		offset: {x: 0, y: 0},
		maxVel: {x: 0, y: 0},
		name: 'portal',
		
		baseProduction: new Big(1),
		baseMonsterLossChange: 0.99,
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
					ig.game.spawnEntity(EntityPortalGibs, this.pos.x + this.size.x/2 - 20, this.pos.y + this.size.y/2 - 20);
				}
			}
		},
		
		getIncome: function() {
			
			var monsterLossChance = this.baseMonsterLossChange - ig.game.getPortalLossChanceUpgrades();
			var p = Math.random();
			if (p < monsterLossChance) {
				if (!ig.game.loseMonster()) {
					return new Big(0);
				}
			}
			
			return ig.game.getPortalUpgrades(this.baseProduction);
		}
	});
});