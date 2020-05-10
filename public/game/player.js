/* eslint-disable no-undef */
class PlayerClass {
  directions = directionsUtil
  powerUpsButton

  SOCIAL_DISTANCING_LENGTH = 20
  SOCIAL_DISTANCING_TIMER = 10

  SPRINT_INCREMENT = 2.5

  constructor(scene, velocity) {
    this.scene = scene
    this.velocity = velocity

    this.player = this.initSprite()

    this.player.setVelocity(0, velocity)
    this.player.setSize(60, 60, true)
    this.player.setDisplaySize(24, 24)
    // not needed because we have a borders created with objects body
    this.player.setCollideWorldBounds(true)


    this.player.setBounce(1)

    const callbackPowerUp = isMobile(this.scene) && this.sprint
    this.powerUpsButton = new PowerUp(this.scene, callbackPowerUp)
  }

  initSprite() {
    // this.scene.anims.create({
    //   key: 'player_walk_down',
    //   frames: this.scene.anims.generateFrameNumbers('player_down'),
    //   frameRate: 8,
    //   yoyo: false,
    //   repeat: -1,
    // })

    this.player = this.scene.physics.add.sprite(
      this.scene.game.config.width / 2 - 20,
      this.scene.game.config.height / 2 - 20,
      'player'
    )

    // this.player.anims.load('player_walk_down')

    // this.player.anims.play('player_walk_down')

    return this.player
  }

  get() {
    return this.player
  }

  checkIfVelocityIsZeroAndUpdate(playerTouching) {
    const { x, y } = this.player.body.velocity
    if (x !== 0 || y !== 0) {
      return
    }

    if (playerTouching.up) {
      this.player.setVelocityY(this.velocity * -1)
    } else if (playerTouching.right) {
      this.player.setVelocityX(this.velocity * -1)
    } else if (playerTouching.down) {
      this.player.setVelocityY(this.velocity)
    } else if (playerTouching.left) {
      this.player.setVelocityX(this.velocity)
    }
  }

  collideWithBall(balls, onGameOver) {
    this.scene.physics.add.collider(this.player, balls.getGroup(), (_player, _ball) => {
      const playerData = _player.getData('player') || {}
      const gameTime = this.scene.ownVars.time
  
      if (_ball.getData('infected')) {
        if (playerData.mask) {
          playerData.mask = false
          _player.setData('player', playerData)
          PlayerClass.updateTexture(_player)
        } else if (playerData.respirator) {
          balls.recoverABall({ ball: _ball, byPlayer: true }) 
          playerData.respirator = false
          _player.setData('player', playerData)
          PlayerClass.updateTexture(_player)
        } else { 
          const EVENTS = globalCollectData.getEventsConst()
          const event = EVENTS.playerInfected
          globalCollectData.set({ event, gameTime })

          _player.destroy()
          onGameOver()
        }
      } else {
        if (playerData.respirator) {
          playerData.respirator = false
          _player.setData('player', playerData)
          PlayerClass.updateTexture(_player)
        }
      }

      if (_player && _player.body && _player.body.touching) {
        this.checkIfVelocityIsZeroAndUpdate(_player.body.touching)
      }

      this.directions.setAnimationByDirection(_player)
      this.directions.setAnimationByDirection(_ball)
    })
  }

  prevCursorInput = 0
  prevTimeInput = 0
  TIME_DOUBLE_INPUT = 500
  CURSORS_INPUT_CODE = {
    top: 1,
    right: 2,
    down: 3,
    left: 4
  }
  inputs(cursors, time) {
    if (!this.player.active) {
      return
    }

    const fastDoubleInput = newInput => {
      if (newInput !== this.prevCursorInput) {
        this.prevTimeInput = time
        return false
      }
      const diffTime = time - this.prevTimeInput
      this.prevTimeInput = time

      if (diffTime <= this.TIME_DOUBLE_INPUT) {
        this.sprint()
        return true
      }
    }
  
    if (Phaser.Input.Keyboard.JustDown(cursors.left)) {
      this.player.setVelocityY(0)
      this.player.setVelocityX(this.velocity * -1)
      this.directions.setAnimationByDirection(this.player)
      fastDoubleInput(this.CURSORS_INPUT_CODE.left)
      this.prevCursorInput = this.CURSORS_INPUT_CODE.left
    } else if (Phaser.Input.Keyboard.JustDown(cursors.right)) {
      this.player.setVelocityY(0)
      this.player.setVelocityX(this.velocity)
      this.directions.setAnimationByDirection(this.right)
      fastDoubleInput(this.CURSORS_INPUT_CODE.right)
      this.prevCursorInput = this.CURSORS_INPUT_CODE.right
    }
  
    if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
      this.player.setVelocityX(0)
      this.player.setVelocityY(this.velocity * -1)
      this.directions.setAnimationByDirection(this.player)
      fastDoubleInput(this.CURSORS_INPUT_CODE.up)
      this.prevCursorInput = this.CURSORS_INPUT_CODE.up
    } else if (Phaser.Input.Keyboard.JustDown(cursors.down)) {
      this.player.setVelocityX(0)
      this.player.setVelocityY(this.velocity)
      this.directions.setAnimationByDirection(this.player)
      fastDoubleInput(this.CURSORS_INPUT_CODE.down)
      this.prevCursorInput = this.CURSORS_INPUT_CODE.down
    }
  }

  wallEnabled = true
  inputKeysActions() {
    this.scene.input.keyboard.on('keydown-Q', event => {
      socialDistancigAction.bind(this.scene)(this.SOCIAL_DISTANCING_LENGTH, this.SOCIAL_DISTANCING_TIMER)
    })
    this.scene.input.keyboard.on('keydown-W', event => {
      if (!this.wallEnabled) {
        return
      }
      this.wallEnabled = false
      quarentineWallAction.bind(this.scene)(() => this.wallEnabled = true)
    })
  }

  static updateTexture(player) {
    const data = player.getData('player')

    if (data.mask && data.respirator) {
      player.setTexture('player_mask_respirator')
    } else if (data.mask) {
      player.setTexture('player_mask')
    } else if (data.respirator) {
      player.setTexture('player_respirator')
    } else {
      player.setTexture('player')
    }
  }

  setAnimationByDirection() {
    this.directions.setAnimationByDirection(this.player)
  }

  setNewVelocity(newVelovity) {
    const { x, y } = this.player.body.velocity

    const up = y < 0
    const down = y > 0
    const right = x > 0
    const left = x < 0

    if (up) {
      this.player.setVelocityY(newVelovity * -1)
    } else if (down) {
      this.player.setVelocityY(newVelovity)
    }

    if (right) {
      this.player.setVelocityX(newVelovity)
    } else if (left) {
      this.player.setVelocityX(newVelovity * -1)
    }
  }

  setDefaultVelocity() {
    if (this.sprintEnable) {
      this.setNewVelocity(this.velocity * this.SPRINT_INCREMENT)
    } else {
      this.setNewVelocity(this.velocity)
    }
  }

  sprintEnable = false
  sprint = () => {
    if (this.sprintEnable) {
      return
    }

    this.sprintEnable = true
    this.powerUpsButton.setText('Recharching...')
    this.setNewVelocity(this.velocity * this.SPRINT_INCREMENT)
    setTimeout(() => {
      this.setNewVelocity(this.velocity)
      setTimeout(() => {
        this.powerUpsButton.setText('Sprint')
        this.sprintEnable = false
      }, 5000)
    }, 250)
  }

  hasRespirator() {
    const playerData = this.player.getData('player')
    return playerData && playerData.respirator
  }

  hasMask() {
    const playerData = this.player.getData('player') || {}
    return playerData && playerData.mask
  }

}
