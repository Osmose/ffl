define(function(require) {
    var Engine = require('flux/engine');
    var Entity = require('flux/entity');
    var TiledGraphic = require('flux/graphics/tiled');
    var Loader = require('flux/resources/loader');

    // Create a new resource loader.
    var loader = new Loader();

    // REGISTER RESOURCES TO LOAD HERE
    loader.register('character-overworld', 'img/character-overworld.png',
                    'image');

    // Callback run once all resources have been loaded.
    loader.loadAll().done(function() {
        // Initialize engine.
        var engine = new Engine(320, 288, 3);
        engine.bg_color = '#FFFF99';

        // ADD INITIAL STATE (entities, worlds, etc) HERE
        function Player(x, y) {
            Entity.call(this, x, y);
            this.graphic = new TiledGraphic(loader.get('character-overworld'),
                                            16, 16);
            this.graphic.addTileName('down', 0);
            this.graphic.addTileName('up', 2);
            this.graphic.addTileName('left', 4);
            this.graphic.addTileName('right', 6);
            this.graphic.addAnimationName('walk_down', [1, 10, 0, 10]);
            this.graphic.addAnimationName('walk_up', [3, 10, 2, 10]);
            this.graphic.addAnimationName('walk_left', [5, 10, 4, 10]);
            this.graphic.addAnimationName('walk_right', [7, 10, 6, 10]);

            this.direction = 'down';
            this.walking = false;
            this.walking_distance = 0;
        }
        Player.prototype = Object.create(Entity.prototype);

        Player.prototype.tick = function() {
            Entity.prototype.tick.call(this);
            var kb = this.engine.kb;

            if (this.walking_distance === 0) {
                this.walking = false;
            }

            if (!this.walking) {
                if (kb.check(kb.RIGHT)) {
                    this.walking = true;
                    this.direction = 'right';
                }
                if (kb.check(kb.LEFT)) {
                    this.walking = true;
                    this.direction = 'left';
                }
                if (kb.check(kb.UP)) {
                    this.walking = true;
                    this.direction = 'up';
                }
                if (kb.check(kb.DOWN)) {
                    this.walking = true;
                    this.direction = 'down';
                }

                if (this.walking) {
                    this.walking_distance = 16;
                }
            }

            if (this.walking) {
                switch (this.direction) {
                    case 'up': this.y--; break;
                    case 'down': this.y++; break;
                    case 'left': this.x--; break;
                    case 'right': this.x++; break;
                }

                this.walking_distance--;
            }

            var tile = (this.walking ? 'walk_' : '') + this.direction;
            this.graphic.currentTile = tile;
        };

        engine.addEntity(new Player(16, 16));

        // Append canvas to screen and start the engine!
        document.querySelector('#game').appendChild(engine.canvas);
        engine.start();
    });
});
