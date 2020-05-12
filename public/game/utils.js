/* eslint-disable no-undef */
const initTimerText = function () {
  const { time } = this.ownVars
  this.ownVars.timeText = this.add.text(12, 12)
  this.ownVars.timeText.setStyle({
    fontFamily: 'FiraMono-Bold',
    fontSize: '24px',
    fill: '#333333',
    align: 'right',
  })
  this.ownVars.timeText.setText(`${time}s`)
  this.ownVars.timeText.setAlpha(0.9)
}

const timer = function () {
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

class PowerUps {
  phaserButtons = []
  phaserPassiveImages = {}
  BUTTON_WIDTH = 48
  PASSIVE_WIDTH = 32

  constructor(config = {}) {
    this.scene = config.scene
    this.actionableButtons = config.actionableButtons || []
    this.passivePowerUps = config.passivePowerUps || []
    this.addActionableButtons()
    this.addPassivePowerUps()

    this.drawSceneSeparator()
    this.passivePowerUps.length > 0 && this.drawSeparator()
  }

  getActionableButtonsWidth = () => {
    const { actionableButtons } = this
    const numOfButtons = actionableButtons.length

    return numOfButtons * this.BUTTON_WIDTH + numOfButtons * 24 + 12
  }

  addActionableButtons = () => {
    const { game } = this.scene
    const { config } = game
    const { actionableButtons } = this

    actionableButtons.forEach((powerUpButton, idx) => {
      const powerUpPhaserButton = this.scene.add.dom(
        config.width - 36 - idx * (24 + this.BUTTON_WIDTH),
        config.height - 44,
        powerUpButton.getDOMButton()
      )

      this.phaserButtons.push(powerUpPhaserButton)
    })
  }

  addPassivePowerUps = () => {
    const { passivePowerUps } = this
    const { game } = this.scene
    const { config } = game

    const coordinates = {
      // 24: space between buttons
      // 12: space between screen right border and first button
      // 16: extra space between actionable buttons and passive ones
      x:
        config.width -
        (this.getActionableButtonsWidth() + 16 + this.PASSIVE_WIDTH),
      y: config.height - 44,
    }

    passivePowerUps.forEach((passivePowerUp, idx) => {
      const image = this.scene.add.image(
        coordinates.x - idx * (this.PASSIVE_WIDTH + 16),
        coordinates.y,
        `${passivePowerUp}_disabled`
      )
      image.setDisplaySize(this.PASSIVE_WIDTH, this.PASSIVE_WIDTH)
      this.phaserPassiveImages[passivePowerUp] = image
    })
  }

  drawSceneSeparator = () => {
    const { game } = this.scene
    const { config } = game
    this.scene.add.rectangle(
      config.width / 2,
      config.height - 88,
      config.width,
      1,
      '0xeeeeee'
    )
  }

  drawSeparator = () => {
    const actionableButtonsWidth = this.getActionableButtonsWidth()
    const { game } = this.scene
    const { config } = game
    this.scene.add.rectangle(
      config.width - actionableButtonsWidth,
      config.height - 44,
      1,
      88,
      '0xeeeeee'
    )
  }

  setPassivePowerUp = ({ active, powerUp }) => {
    if (!this.phaserPassiveImages[powerUp]) {
      return console.error('Invalid power up provided')
    }

    this.phaserPassiveImages[powerUp].setTexture(
      `${powerUp}${active ? '' : '_disabled'}`
    )
  }
}

class PowerUpButton {
  powerUpButton = null
  callback = null

  constructor(config = {}) {
    this.callback = config.cb
    this.shortcut = config.shortcut || ''
    this.icon = config.icon || ''

    // TODO destroy power ups on game over
    this.createButton()
  }

  createButton = () => {
    this.powerUpButtonHTML = document.createElement('button')
    this.powerUpButtonHTML.classList.add('power-up')
    this.powerUpButtonHTML.addEventListener('click', () => {
      this.handleClick()
    })

    if (this.icon) {
      const icon = document.createElement('img')
      icon.src = `./game/assets/ico-${this.icon}.png`

      this.powerUpButtonHTML.appendChild(icon)
    }

    if (this.shortcut) {
      const shortcutIndicator = document.createElement('span')
      shortcutIndicator.classList.add('power-up-shortcut')
      shortcutIndicator.textContent = this.shortcut
      this.powerUpButtonHTML.appendChild(shortcutIndicator)
    }
  }

  handleClick = () => {
    this.callback && this.callback()
  }

  getDOMButton = () => this.powerUpButtonHTML
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
    upLeft: 8,
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
    switch (this.inferNewDirection(object)) {
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
  NEXT_ITEM_MAX_TIME = 15000
  NEXT_WALL_MIN_TIME = 15000
  NEXT_WALL_MAX_TIME = 45000
  wave = 1
  points = 0
  waveText
  pointsText

  constructor({ scene }) {
    this.scene = scene
  }

  initText() {
    this.waveText = this.scene.add.text(0, 12)
    this.waveText.setStyle({
      fontFamily: 'FiraMono-Medium',
      fontSize: '24px',
      fill: '#333333',
      align: 'center',
      fixedWidth: this.scene.game.config.width,
    })
    this.updateWaveText()

    this.pointsText = this.scene.add.text(0, 12)
    this.pointsText.setStyle({
      fontFamily: 'FiraMono-Bold',
      fontSize: '24px',
      fill: '#333333',
      align: 'right',
      fixedWidth: this.scene.game.config.width - 12,
    })
    this.updatePointsText()
  }

  sumPoints() {
    this.points = this.points + (20 + 5 * this.wave)
    this.updatePointsText()
  }

  getPoints() {
    return this.points
  }

  shouldTheWaveIncrement(balls) {
    const children = balls.getGroup().getChildren()
    if (children.every((ball) => !ball.getData('infected'))) {
      this.wave += 1
      balls.uninfectAll()
      balls.infectABall({ ball: children[0] })
      this.incrementGameVelocity()
      this.updateWaveText()
      this.notifyWaveChange({ wave: this.wave })
    }
  }

  incrementGameVelocity() {
    const timeScaleDisable = this.scene.ownVars.timeScaleDisable
    const world = this.scene.physics.world

    if (!timeScaleDisable && world.timeScale >= 0.3) {
      world.timeScale -= 0.02
    }
  }

  updateWaveText() {
    if (!this.waveText) {
      return
    }
    this.waveText.setText(`OLEADA ${this.wave}`)
  }

  updatePointsText() {
    if (!this.pointsText) {
      return
    }
    this.pointsText.setText(`${this.points}pts`)
  }

  timerNextItem() {
    timerNextItem.bind(this.scene)(
      this.NEXT_ITEM_MIN_TIME,
      this.NEXT_ITEM_MAX_TIME
    )
  }

  timerNextWallInstance
  timerNextWall() {
    if (this.timerNextWallInstance) {
      timerNextItemInstance.remove()
    }

    const milliseconds = Phaser.Math.Between(
      this.NEXT_WALL_MIN_TIME,
      this.NEXT_WALL_MAX_TIME
    )

    this.timerNextWallInstance = this.scene.time.addEvent({
      delay: milliseconds,
      callback: () => {
        quarentineWallAction.bind(this.scene)(() => this.timerNextWall())
      },
      //args: [],
      callbackScope: this,
      loop: false,
    })
  }

  onWaveChangeCb = []
  onWaveChange(cb) {
    if (this.onWaveChangeCb.some((c) => cb === c)) {
      return
    }
    this.onWaveChangeCb.push(cb)
  }

  offWaveChange(cb) {
    if (!cb) {
      return
    }
    const index = this.onWaveChangeCb.indexOf((c) => cb === c)
    this.onWaveChangeCb.splice(index, 1)
  }

  notifyWaveChange(data) {
    this.onWaveChangeCb.forEach((cb) => cb(data))
  }
}
