/* eslint-disable no-undef */
import { directionsUtil, PowerUpButton, PowerUps, isDesktop } from './utils'
import CollectData from './collectData'
import { socialDistancigAction } from './actions'

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

export default class PlayerClass {
  directions = directionsUtil
  sprintButton
  socialDistancingButton

  SOCIAL_DISTANCING_LENGTH
  SOCIAL_DISTANCING_TIMER = 10

  SPRINT_INCREMENT = 2.5
  SPRINT_TIME_DISABLED = 5 // seconds
  SOCIAL_DISTANCE_TIME_DISABLED = 10 // seconds

  constructor(scene, velocity, BALLS_LENGTH) {
    this.scene = scene
    this.velocity = velocity

    this.SOCIAL_DISTANCING_LENGTH = Math.round(BALLS_LENGTH * 0.7)

    this.player = this.initSprite()

    this.player.setVelocity(0, velocity)
    this.player.setSize(60, 60, true)
    this.player.setDisplaySize(24, 24)
    // not needed because we have a borders created with objects body
    this.player.setCollideWorldBounds(true)

    this.player.setBounce(1)

    this.sprintButton = new PowerUpButton({
      shortcut: isDesktop(this.scene) && 'R',
      icon: 'sprint',
      cb: this.sprint,
    })
    this.socialDistancingButton = new PowerUpButton({
      shortcut: isDesktop(this.scene) && 'E',
      icon: 'confination',
      cb: this.socialDistance,
    })

    this.powerUps = new PowerUps({
      scene: this.scene,
      actionableButtons: [this.socialDistancingButton, this.sprintButton],
      // passivePowerUps: ['powerup_medikit', 'powerup_mask'],
    })

    this.scene.ownVars.wavesManager.onWaveChange(() => {
      this.disbledSocialDistancing = false
      this.socialDistancingButton.setDisabled({ disabled: false })
    })
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
    this.balls = balls
    this.scene.physics.add.collider(
      this.player,
      balls.getGroup(),
        debounce((_player, _ball) => {
        const playerData = _player.getData('player') || {}
        const gameTime = this.scene.ownVars.time

        if (_ball.getData('infected')) {
          if (playerData.respirator) {
            balls.recoverABall({ ball: _ball, byPlayer: true })
            playerData.respirator = false
            _player.setData('player', playerData)
            this.updateTexture(_player)
          } else if (playerData.mask) {
            playerData.mask = false
            _player.setData('player', playerData)
            this.updateTexture(_player)
          } else {
            const EVENTS = CollectData.getEventsConst()
            const event = EVENTS.playerInfected
            CollectData.set({ event, gameTime })
            _player.destroy()
            onGameOver()
          }
        } else {
          if (playerData.respirator) {
            balls.recoverABall({ ball: _ball, byPlayer: true })
            playerData.respirator = false
            _player.setData('player', playerData)
            this.updateTexture(_player)
          }
        }

        if (_player && _player.body && _player.body.touching) {
          this.checkIfVelocityIsZeroAndUpdate(_player.body.touching)
        }

        this.directions.setAnimationByDirection(_player)
        this.directions.setAnimationByDirection(_ball)
      }, 250)
    )
  }

  prevCursorInput = 0
  prevTimeInput = 0
  TIME_DOUBLE_INPUT = 500
  CURSORS_INPUT_CODE = {
    top: 1,
    right: 2,
    down: 3,
    left: 4,
  }

  fastDoubleInput = (newInput, time) => {
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

  inputLeft(time) {
    this.player.setVelocityY(0)
    this.player.setVelocityX(this.velocity * -1)
    this.directions.setAnimationByDirection(this.player)
    this.fastDoubleInput(this.CURSORS_INPUT_CODE.left, time)
    this.prevCursorInput = this.CURSORS_INPUT_CODE.left
  }

  inputRight(time) {
    this.player.setVelocityY(0)
    this.player.setVelocityX(this.velocity)
    this.directions.setAnimationByDirection(this.right)
    this.fastDoubleInput(this.CURSORS_INPUT_CODE.right, time)
    this.prevCursorInput = this.CURSORS_INPUT_CODE.right
  }

  inputUp(time) {
    this.player.setVelocityX(0)
    this.player.setVelocityY(this.velocity * -1)
    this.directions.setAnimationByDirection(this.player)
    this.fastDoubleInput(this.CURSORS_INPUT_CODE.up, time)
    this.prevCursorInput = this.CURSORS_INPUT_CODE.up
  }

  inputDown(time) {
    this.player.setVelocityX(0)
    this.player.setVelocityY(this.velocity)
    this.directions.setAnimationByDirection(this.player)
    this.fastDoubleInput(this.CURSORS_INPUT_CODE.down, time)
    this.prevCursorInput = this.CURSORS_INPUT_CODE.down
  }

  inputs(cursors, time) {
    if (!this.player.active) {
      return
    }

    if (Phaser.Input.Keyboard.JustDown(cursors.left)) {
      this.inputLeft(time)
    } else if (Phaser.Input.Keyboard.JustDown(cursors.right)) {
      this.inputRight(time)
    }

    if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
      this.inputUp(time)
    } else if (Phaser.Input.Keyboard.JustDown(cursors.down)) {
      this.inputDown(time)
    }
  }

  inputsSwipe(swipe, time) {
    if (!this.player.active) {
      return
    }

    if (swipe.left) {
      this.inputLeft(time)
    } else if (swipe.right) {
      this.inputRight(time)
    } else if (swipe.up) {
      this.inputUp(time)
    } else if (swipe.down) {
      this.inputDown(time)
    }
  }

  // wallEnabled = true
  inputKeysActions() {
    this.scene.input.keyboard.on(
      'keydown-E',
      this.socialDistancingButton.handleClick
    )
    this.scene.input.keyboard.on('keydown-R', this.sprintButton.handleClick)
    // this.scene.input.keyboard.on('keydown-W', (event) => {
    //   if (!this.wallEnabled) {
    //     return
    //   }
    //   this.wallEnabled = false
    //   quarentineWallAction.bind(this.scene)(() => (this.wallEnabled = true), this.balls)
    // })
    // this.scene.input.keyboard.on('keydown-W', event => {
    //   if (!this.wallEnabled) {
    //     return
    //   }
    //   this.wallEnabled = false
    //   quarentineWallAction.bind(this.scene)(() => this.wallEnabled = true)
    // })
  }

  updateTexture(player) {
    const data = player.getData('player')

    this.powerUps.setPassivePowerUp({ active: data.mask, powerUp: 'powerup_mask' })
    this.powerUps.setPassivePowerUp({ active: data.respirator, powerUp: 'powerup_medikit' })

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
  sprintUIDisabled = false
  sprint = () => {
    if (this.sprintUIDisabled) {
      return
    }

    this.sprintEnable = true
    this.sprintUIDisabled = true

    this.setNewVelocity(this.velocity * this.SPRINT_INCREMENT)
    this.scene.time.addEvent({
      delay: 250,
      callback: () => {
        this.sprintEnable = false
        this.setNewVelocity(this.velocity)
      },
      //args: [],
      callbackScope: this,
      loop: false,
    })

    this.sprintButton.setDisabled({ disabled: true })
    this.runCountDownSprint({
      onEnd: () => {
        this.sprintUIDisabled = false
        this.sprintButton.setDisabled({ disabled: false })
        this.countDownSprint = this.SPRINT_TIME_DISABLED * 1000
      },
    })
  }

  countDownSprint = this.SPRINT_TIME_DISABLED * 1000
  runCountDownSprint({ onEnd }) {
    if (this.countDownSprint === 0) {
      onEnd && onEnd()
      return
    }

    this.sprintButton.updateCountdown({ timeLeft: this.countDownSprint / 1000 })
    this.countDownSprint -= 1000

    this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        this.runCountDownSprint({ onEnd })
      },
      //args: [],
      callbackScope: this,
      loop: false,
    })
  }

  disbledSocialDistancing = false
  socialDistance = () => {
    if (this.disbledSocialDistancing) {
      return
    }
    this.disbledSocialDistancing = true
    socialDistancigAction.bind(this.scene)(
      this.SOCIAL_DISTANCING_LENGTH,
      this.SOCIAL_DISTANCING_TIMER,
      this.balls
    )

    this.socialDistancingButton.setDisabled({ disabled: true })
    // this.runCountDownSocialDistance({
    //   onEnd: () => {
    //     this.disbledSocialDistancing = false
    //     this.socialDistancingButton.setDisabled({ disabled: false })
    //     this.countDownSocialDistance = this.SOCIAL_DISTANCE_TIME_DISABLED * 1000
    //   },
    // })
  }

  countDownSocialDistance = this.SOCIAL_DISTANCE_TIME_DISABLED * 1000
  runCountDownSocialDistance({ onEnd }) {
    if (this.countDownSocialDistance === 0) {
      onEnd && onEnd()
      return
    }

    this.socialDistancingButton.updateCountdown({
      timeLeft: this.countDownSocialDistance / 1000,
    })
    this.countDownSocialDistance -= 1000

    this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        this.runCountDownSocialDistance({ onEnd })
      },
      //args: [],
      callbackScope: this,
      loop: false,
    })
  }

  setRespirator({ active }) {
    this.powerUps.setPassivePowerUp({ active, powerUp: 'powerup_medikit' })
  }

  hasRespirator() {
    const playerData = this.player.getData('player')
    return playerData && playerData.respirator
  }

  setMask({ active }) {
    this.powerUps.setPassivePowerUp({ active, powerUp: 'powerup_mask' })
  }

  hasMask() {
    const playerData = this.player.getData('player') || {}
    return playerData && playerData.mask
  }
}
