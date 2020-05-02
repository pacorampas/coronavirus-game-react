/* eslint-disable no-undef */
const initTimerText = function() {
  const { time }  = this.ownVars
  this.ownVars.timeText = this.add.text(12, 12)
  this.ownVars.timeText.setStyle({
    fontFamily: 'Montserrat-bold',
    fontSize: '24px',
    fill: '#333333',
    align: 'right'
  })
  this.ownVars.timeText.setText(`${time}s`)
  this.ownVars.timeText.setAlpha(0.9)
}

const timer = function() {
  const { player, time, timeText } = this.ownVars
  
  timeText && timeText.setText(`${time}s`)

  this.time.addEvent({
    delay: 1000,
    callback: () => {
      // TODO GAME OVER TIME STOP
      if (player && !player.get().active) {
        return
      }

      const newTime = time + 1
      this.ownVars.time = newTime

      timer.bind(this)()
    },
    //args: [],
    callbackScope: this,
    loop: false,
  })
}

var isMobile = function (scene) {
  return !scene.sys.game.device.os.desktop
}

class TextButton extends Phaser.GameObjects.Text {
  constructor(scene, x, y, text, style, callback) {
    super(scene, x, y, text, style)

    this.setInteractive({ useHandCursor: true })
      .on('pointerover', () => this.enterButtonHoverState())
      .on('pointerout', () => this.enterButtonRestState())
      .on('pointerdown', () => this.enterButtonActiveState())
      .on('pointerup', () => {
        this.enterButtonHoverState()
        callback()
      })
  }

  enterButtonHoverState() {
    this.setStyle({ fill: '#ff0' })
  }

  enterButtonRestState() {
    this.setStyle({ fill: '#0f0' })
  }

  enterButtonActiveState() {
    this.setStyle({ fill: '#0ff' })
  }
}

class PowerUp {
  sprintButton = null
  callback
  constructor(scene, cb) {
    this.scene = scene
    this.callback = cb

    // TODO destroy power ups on game over
    this.createSprintButton()
  }

  createSprintButton = () => {
    this.sprintButton = new TextButton(
      this.scene,
      40,
      this.scene.game.config.height - 40,
      'Sprint!',
      { fill: '#0f0' },
      this.handleSprintClick
    )
    this.scene.add.existing(this.sprintButton)
  }

  handleSprintClick = () => {
    this.callback && this.callback()
  }

  setText(newText) {
    this.sprintButton.text = newText
  }
}

class DirectionsUtilClass {
  DIRECTIONS = {
    up: 1,
    upRight: 2,
    right: 3,
    downRight: 4,
    down: 5,
    downLeft: 6,
    left: 7,
    upLeft: 8
  }

  getDirections() {
    return this.DIRECTIONS
  }

  inferNewDirection(object) {
    if (!object || !object.body) {
      return 
    }

    const { x, y } = object.body.velocity

    const up = y < 0
    const down = y > 0
    const right = x > 0
    const left = x < 0

    if (up) {
      if (right) {
        return this.DIRECTIONS.upRight
      } else if (left) {
        return this.DIRECTIONS.upLeft
      }

      return this.DIRECTIONS.up

    } else if (down) {
      if (right) {
        return this.DIRECTIONS.downRight
      } else if (left) {
        return this.DIRECTIONS.downLeft
      }
      return this.DIRECTIONS.down
    } 
    
    if (right) {
      return this.DIRECTIONS.right
    } else if (left) {
      return this.DIRECTIONS.left
    }
  }

  setAnimationByDirection(object) {
    switch(this.inferNewDirection(object)) {
      case this.DIRECTIONS.up:
        object.setAngle(180)
        return
      case this.DIRECTIONS.upRight:
        object.setAngle(-135)
        return
      case this.DIRECTIONS.right:
        object.setAngle(-90)
        return
      case this.DIRECTIONS.downRight:
        object.setAngle(-45)
        return
      case this.DIRECTIONS.down:
        object.setAngle(0)
        return
      case this.DIRECTIONS.downLeft:
        object.setAngle(45)
        return
      case this.DIRECTIONS.left:
        object.setAngle(90)
        return
      case this.DIRECTIONS.upLeft:
        object.setAngle(135)
        return
    }
  }
}

const directionsUtil = new DirectionsUtilClass()

class WavesManager {
  NEXT_ITEM_MIN_TIME = 2000
  NEXT_ITEM_MAX_TIME = 1500
  wave = 1
  waveText

  constructor({ scene }) {
    this.scene = scene
  }

  initText() {
    this.waveText = this.scene.add.text(0, 12)
    this.waveText.setStyle({
      fontFamily: 'Montserrat',
      fontSize: '24px',
      fill: '#333333',
      align: 'center',
      fixedWidth: this.scene.game.config.width,
    })
    this.updateWaveText()
  }

  shouldTheWaveIncrement(balls) {
    const children = balls.getGroup().getChildren()
    if (children.every(ball => !ball.getData('infected'))) {
      this.wave += 1
      balls.uninfectAll()
      balls.infectABall({ ball: children[0] })
      this.incrementGameVelocity()
      this.updateWaveText()
    }
  }

  incrementGameVelocity() {
    const timeScaleDisable = this.scene.ownVars.timeScaleDisable
    const world = this.scene.physics.world

    if (!timeScaleDisable && world.timeScale >= 0.2) {
      world.timeScale -= 0.1;
    }
  }

  updateWaveText() {
    if (!this.waveText) {
      return
    }
    this.waveText.setText(`OLEADA ${this.wave}`)
  }

  timerNextItem() {
    timerNextItem.bind(this.scene)(
      this.NEXT_ITEM_MIN_TIME, 
      this.NEXT_ITEM_MAX_TIME,
    )
  }
}
