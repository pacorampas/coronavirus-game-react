/* eslint-disable no-undef */
/* global dat */
const initGame = function(documentId) {
  var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
    backgroundColor: 0x222222,
    parent: documentId,
    dom: {
      createContainer: true,
    },
    physics: {
      default: 'arcade',
      // https://photonstorm.github.io/phaser3-docs/Phaser.Types.Physics.Arcade.html#.ArcadeWorldConfig
      arcade: {
        // https://photonstorm.github.io/phaser3-docs/Phaser.Types.Physics.Arcade.html#.CheckCollisionObject
        checkCollision: {
          up: true,
          down: true,
          left: true,
          right: true,
        },
        // debug: true,
        // debugBodyColor: 0xff00ff,
        // debugShowBody: true,
        // debugShowStaticBody: true,
        // debugShowVelocity: true,
        // debugStaticBodyColor: 0x0000ff,
        // debugVelocityColor: 0x00ff00,
        forceX: false,
        fps: 60,
        gravity: {
          x: 0,
          y: 0,
        },
        height: 600,
        isPaused: false,
        maxEntries: 16,
        overlapBias: 4,
        tileBias: 16,
        timeScale: 1,
        useTree: true,
        width: 1000,
        x: 0,
        y: 0,
      },
    },
    scene: {
      preload: preload,
      create: create,
      update: update,
    },
  }
  
  const BALLS_LENGTH = 14
  
  var player
  let GLOB_VELOCITY = 100
  var joystick
  var borders
  
  const game = new Phaser.Game(config)
  
  function preload() {
    if (isMobile(this)) {
      this.load.plugin(
        'rexvirtualjoystickplugin',
        'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js',
        true
      )
    }
  
    this.load.image('ball', 'game/assets/person.png')
    this.load.image('infected', 'game/assets/infected.png')
  
    this.load.image('item_mask', 'game/assets/mask.png')
    this.load.image('item_forced_quarentine', 'game/assets/forced_quarentine.png')
    this.load.image('item_social_distancing', 'game/assets/social_distancing.png')
    this.load.image(
      'item_more_social_distancing',
      'game/assets/more_social_distancing.png'
    )
    this.load.image('item_respirator', 'game/assets/respirator.png')
  
    this.load.image('solid_block', 'game/assets/block.png')
  
    this.load.image('player', 'game/assets/player.png')
  
    this.load.spritesheet('person', 'game/assets/sprite_player_down.png', { frameWidth: 256, frameHeight: 256 });
  
    this.load.image('player_mask', 'game/assets/player_mask.png')
    this.load.image('player_respirator', 'game/assets/player_respirator.png')
    this.load.image('player_mask_respirator', 'game/assets/player_mask_respirator.png')
  
    this.load.spritesheet('player_down', 'game/assets/sprite_player_down.png', { frameWidth: 256, frameHeight: 256 });
  }
  
  function create() {
    this.ownVars = {
      time: 0,
      velocity: GLOB_VELOCITY
    }
    // + 1 is a player
    globalCollectData.setTotals(BALLS_LENGTH + 1)
    
    // this.physics.world.setBounds(50, 50, 700, 500);
  
    // graphics = this.add.graphics();
  
    borders = new Borders(this)
  
    player = new PlayerClass(this, GLOB_VELOCITY)
    this.ownVars.player = player
  
    balls = new BallsClass(this, GLOB_VELOCITY, BALLS_LENGTH)

    
    const handleGameOver = () => {
      console.log(globalCollectData.getData())
    }
    
    player.collideWithBall(balls.getGroup(), handleGameOver)
    borders.collideWith([balls.getGroup()], (_border, _ball) => {
      balls.setAnimationByDirection(_ball)
    })
    borders.collideWith([player.get()], (_border, _player) => {
      player.setAnimationByDirection()
    })
    
  
    //createWorldGui(this.physics.world);
  
    if (isMobile(this)) {
      joystick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
        x: config.width - 60 - 40,
        y: config.height - 60 - 40,
        dir: '4dir',
        radius: 60,
        base: this.add.circle(0, 0, 60, 0x888888),
        thumb: this.add.circle(0, 0, 30, 0xcccccc),
      })
      cursors = joystick.createCursorKeys()
    } else {
      cursors = this.input.keyboard.createCursorKeys()
    }
  
    timerNextItem.bind(this)(BALLS_LENGTH)
    timer.bind(this)()
  }
  
  function update(time) {
    this.physics.world.wrap(balls.getGroup())
  
    // graphics.clear().fillStyle(0).fillRectShape(this.physics.world.bounds);
  
    player.inputs(cursors, time)
  }
  
  function createWorldGui(world) {
    var gui = new dat.GUI({ width: 400 })
  
    var bounds = gui.addFolder('bounds')
    bounds.add(world.bounds, 'x', -400, 400, 10)
    bounds.add(world.bounds, 'y', -300, 300, 10)
    bounds.add(world.bounds, 'width', 0, 800, 10)
    bounds.add(world.bounds, 'height', 0, 600, 10)
  
    var check = gui.addFolder('checkCollision')
    check.add(world.checkCollision, 'left')
    check.add(world.checkCollision, 'up')
    check.add(world.checkCollision, 'right')
    check.add(world.checkCollision, 'down')
  
    var defaults = gui.addFolder('defaults')
    defaults.add(world.defaults, 'debugShowBody')
    defaults.add(world.defaults, 'debugShowStaticBody')
    defaults.add(world.defaults, 'debugShowVelocity')
    defaults.addColor(world.defaults, 'bodyDebugColor')
    defaults.addColor(world.defaults, 'staticBodyDebugColor')
    defaults.addColor(world.defaults, 'velocityDebugColor')
  
    var debug = gui.addFolder('debugGraphic')
    debug.add(world.debugGraphic, 'visible')
    debug.add(world.debugGraphic, 'clear')
  
    gui.add(world, 'drawDebug')
  
    gui.add(world, 'forceX')
  
    var gravity = gui.addFolder('gravity')
    gravity.add(world.gravity, 'x', -300, 300, 10)
    gravity.add(world.gravity, 'y', -300, 300, 10)
  
    // gui.add(world, 'isPaused');
  
    gui.add(world, 'OVERLAP_BIAS', -8, 8, 1)
  
    gui.add(world, 'pause')
  
    gui.add(world, 'resume')
  
    return gui
  }

  return game
}
