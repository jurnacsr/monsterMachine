ig.module(
	'game.entities.generatorGibs'
)
.requires(
	'impact.entity'
)
.defines(function(){
	EntityGeneratorGibs = ig.Entity.extend({
		animSheet: new ig.AnimationSheet( 'media/generatorGibs.png?t='+Math.random(), 40, 40 ),
		size: {x: 40, y:40},
		offset: {x: 0, y: 0},
		maxVel: {x: 0, y: 40},
		name: '',
		
		lifeTimer: new ig.Timer(),
		lifeTime: -1,
		
		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			
			this.name = 'generatorGib';
			
			// generate a random gib 
			var index = Math.floor(Math.random() * 5);
			
			this.lifeTime = Math.random() * 3;
			this.lifeTimer = new ig.Timer();
			
			this.vel.y = this.getRandom(-40, -20);
			
			// Add the animations
			this.addAnim( 'idle', 3, [index]);
			
		},
		
		update: function() {
			this.parent();
			
			this.currentAnim.alpha -= 0.0075;		
			if (this.currentAnim.alpha <= 0) this.currentAnim.alpha = 0;
			if (this.lifeTimer.delta() >= this.lifeTime) this.kill();
		}, 
		
		getRandom: function(min, max) {
			return Math.random() * (max - min) + min;
		}
	});
});