/* eslint-disable no-undef */
/* global dat */

import { WavesManager, isMobile, timer, initTimerText } from './utils'
import { timerNextItemReset, setPointIcon } from './items'
import { socialDistancigAction } from './actions'
import CollectData from './collectData'
import Borders from './borders'
import PlayerClass from './player'
import BallsClass from './balls'

export const initGame = function (
  documentId,
  ballsLength,
  socialDistancingLength,
  playerDisbaled,
  timeScaleDisable,
  onGameHover,
  sizes
) {
  var config = {
    type: Phaser.AUTO,
    width: sizes.width || 1000,
    height: sizes.height || 600,
    backgroundColor: 0xfafafa,
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

  const BALLS_LENGTH = ballsLength

  var player
  let GLOB_VELOCITY = 100
  var joystick
  var borders
  var cursors
  var swipeInput

  const game = new Phaser.Game(config)

  function preload() {
    if (isMobile(this)) {
      this.load.plugin(
        'rexvirtualjoystickplugin',
        'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js',
        true
      )
      this.load.scenePlugin({
        key: 'rexgesturesplugin',
        url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexgesturesplugin.min.js',
        sceneKey: 'rexGestures'
      }) 
    }

    this.load.script(
      'webfont',
      'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js'
    )

    this.load.image('ball', process.env.PUBLIC_URL + '/assets/person.png')
    this.load.image('infected', process.env.PUBLIC_URL + '/assets/infected.png')

    this.load.image('item_mask', process.env.PUBLIC_URL + '/assets/ico-mask.png')
    this.load.image(
      'item_forced_quarentine',
      process.env.PUBLIC_URL + '/assets/forced_quarentine.png'
    )
    this.load.image(
      'item_social_distancing',
      process.env.PUBLIC_URL + '/assets/social_distancing.png'
    )
    this.load.image(
      'item_more_social_distancing',
      process.env.PUBLIC_URL + '/assets/more_social_distancing.png'
    )
    this.load.image('item_respirator', process.env.PUBLIC_URL + '/assets/ico-medikit.png')

    this.load.image('item_dog', process.env.PUBLIC_URL + '/assets/ico-dog.png')
    this.load.image('item_shop', process.env.PUBLIC_URL + '/assets/ico-shop.png')

    this.load.image('solid_block', process.env.PUBLIC_URL + '/assets/block.png')

    this.load.image('player', process.env.PUBLIC_URL + '/assets/player.png')

    this.load.spritesheet('person', process.env.PUBLIC_URL + '/assets/sprite_player_down.png', {
      frameWidth: 256,
      frameHeight: 256,
    })

    this.load.image('player_mask', process.env.PUBLIC_URL + '/assets/player_mask.png')
    this.load.image('player_respirator', process.env.PUBLIC_URL + '/assets/player_respirator.png')
    this.load.image(
      'player_mask_respirator',
      process.env.PUBLIC_URL + '/assets/player_mask_respirator.png'
    )

    this.load.spritesheet('player_down', process.env.PUBLIC_URL + '/assets/sprite_player_down.png', {
      frameWidth: 256,
      frameHeight: 256,
    })

    // Powerups
    this.load.image('powerup_mask', process.env.PUBLIC_URL + '/assets/powerup-mask.png')
    this.load.image(
      'powerup_mask_disabled',
      process.env.PUBLIC_URL + '/assets/powerup-mask-disabled.png'
    )

    this.load.image('powerup_medikit', process.env.PUBLIC_URL + '/assets/powerup-medikit.png')
    this.load.image(
      'powerup_medikit_disabled',
      process.env.PUBLIC_URL + '/assets/powerup-medikit-disabled.png'
    )
  }

  function create() {
    const wavesManager = new WavesManager({ scene: this })

    this.ownVars = {
      time: 0,
      velocity: GLOB_VELOCITY,
      timeScaleDisable,
      wavesManager,
    }

    const self = this
    // fonts
    WebFont.load({
      custom: {
        families: ['FiraMono-Bold', 'FiraMono-Medium'],
      },
      active: function (a) {
        wavesManager.initText()
        initTimerText.bind(self)()
      },
    })

    // + 1 is a player
    CollectData.initGame(BALLS_LENGTH + 1)

    // this.physics.world.setBounds(50, 50, 700, 500);

    // graphics = this.add.graphics();

    borders = new Borders(this)

    if (!playerDisbaled) {
      player = new PlayerClass(this, GLOB_VELOCITY, BALLS_LENGTH)
      this.ownVars.player = player
    }

    const balls = new BallsClass(this, GLOB_VELOCITY, BALLS_LENGTH)
    this.ownVars.balls = balls

    const handleGameOver = () => {
      timerNextItemReset()
      balls.stop()
      onGameHover &&
        onGameHover({
          time: this.ownVars.time,
          points: wavesManager.getPoints(),
          wave: this.ownVars.wavesManager.getWave()
        })
    }
    if (!playerDisbaled) {
      player.collideWithBall(balls, handleGameOver)
      borders.collideWith([player.get()], (_border, _player) => {
        player.setAnimationByDirection()
      })
    }
    borders.collideWith([balls.getGroup()], (_border, _ball) => {
      balls.setAnimationByDirection(_ball)
    })

    //createWorldGui(this.physics.world);
    if (!playerDisbaled) {
      if (true && isMobile(this)) {
        // joystick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
        //   x: 12 + 32,
        //   y: config.height - 44,
        //   dir: '4dir',
        //   radius: 32,
        //   base: this.add.circle(0, 0, 32, 0xf3f3f3),
        //   thumb: this.add.circle(0, 0, 24, 0xffffff),
        // })
        // cursors = joystick.createCursorKeys()

        swipeInput = this.rexGestures.add.swipe({ threshold: 5, velocityThreshold: 10 , dir: '4dir' })
      } else {
        cursors = this.input.keyboard.createCursorKeys()
        player.inputKeysActions()
      }

      wavesManager.timerNextItem()
      wavesManager.timerNextWall()
      setPointIcon.bind(this)()
    }
    timer.bind(this)()

    if (socialDistancingLength && socialDistancingLength > 0) {
      socialDistancigAction.bind(this)(socialDistancingLength, 0, balls)
    }
  }

  function update(time) {
    if (cursors && !playerDisbaled) {
      player.inputs(cursors, time)
    }
    if (swipeInput && swipeInput.isSwiped) {
      player.inputsSwipe(swipeInput, time)
    }
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
