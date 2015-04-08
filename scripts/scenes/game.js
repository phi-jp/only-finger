

tm.define("GameScene", {
    superClass: "Scene",

    init: function() {
        this.superInit();

        this.fromJSON({
            children: {
                blockGroup: {
                    type: "CanvasElement",
                },
            },
        });
    },

    onenter: function() {
        this.app.pushScene(StanbyScene());
    },

    update: function(app) {
        var p = app.pointing;

        if (p.getPointingEnd()) {
            this.app.popScene();
        }

        if (p.getPointing()) {
            FingerEffect(p.x, p.y).addChildTo(this);

            var hit = this.blockGroup.children.some(function(block) {
                if (block.isHitPoint(p.x, p.y)) {
                    this.app.popScene();
                }
            }, this);
        }

        if (app.frame % 10 == 0) {
            this.createBlock(Random.randint(0, 640), -50);
        }
    },

    createBlock: function(x, y) {
        var block = Block().addChildTo(this.blockGroup).setPosition(x, y);
    },
});


tm.define("Block", {
    superClass: "Shape",

    init: function() {
        this.superInit({
            width: SCREEN_GRID_X.span(6),
            bgColor: "white",
        });

        this.setBoundingType('rect');

        this.vy = 8;
    },

    update: function() {
        this.y += this.vy;
        this.rotation += 4;

        if (this.y > SCREEN_HEIGHT) {
            this.remove();
        }
    },
});


tm.define("StanbyScene", {
    superClass: "Scene",

    init: function() {
        this.superInit();

        this.circle = CircleShape({
            fillStyle: "transparent",
        }).addChildTo(this);
        this.circle.setPosition(SCREEN_CENTER_X, SCREEN_GRID_Y.span(12));
        this.circle.setInteractive(true, 'circle');

        this.circle.onpointingstart = function() {
            this.app.popScene();
        }.bind(this);
    },
});

tm.define("FingerEffect", {
    superClass: "CircleShape",

    init: function(x, y) {
        this.superInit({
            fillStyle: "white",
            strokeStyle: "transparent",
            width: 32,
            height: 32,
        });

        this.x = x;
        this.y = y;
        this.tweener
            .by({
                y: 100,
                alpha: -1,
                scaleX: -1,
                scaleY: -1,
            }).call(function() {
                this.remove();
            }, this)
            ;
    }
})