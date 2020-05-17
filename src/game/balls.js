/* eslint-disable no-undef */
import { directionsUtil } from './utils'
import CollectData from './collectData'

export default class BallsClass {
  directions = directionsUtil
  constructor(scene, velocity, ballsLength) {
    this.scene = scene
    this.velocity = velocity



    this.balls = scene.physics.add.group({
      key: 'ball',
      frameQuantity: ballsLength,
      collideWorldBounds: true,
      bounceX: 1,
      bounceY: 1,
      velocityX: velocity,
      velocityY: velocity,
    })

    const ballsChildren = this.balls.getChildren()
    var rect = this.scene.add.rectangle(
      0, 
      0, 
      this.scene.game.config.width, 
      this.scene.game.config.height - 180
    )
    Phaser.Actions.RandomRectangle(ballsChildren, rect)

    ballsChildren.forEach((ball) => {
      ball.setSize(60, 60, true)
      ball.setDisplaySize(24, 24)
  
      if (Phaser.Math.Between(0, 1) === 1) {
        ball.setVelocity(this.velocity * -1)
      }

      // ball.anims.load('player_walk_down')

      // ball.anims.play('player_walk_down')

      this.uninfectABall({ ball, noSave: true })

      this.directions.setAnimationByDirection(ball)
    })

    this.infectABall({ 
      ball: ballsChildren[ballsChildren.length - 1]
    })

    this.ballCollideWithBall()
  }

  getGroup() {
    return this.balls
  }

  infectABall({ ball }) {
    const EVENTS = CollectData.getEventsConst()

    ball.setData('infected', true)
    ball.setTexture('infected')
    ball.setTintFill('0xff656d')

    const time = this.scene.ownVars.time
    
    CollectData.set({ event: EVENTS.ballInfected, gameTime: time })

    this.scene.time.addEvent({
      delay: 10000,
      callback: () => {
        if (ball.getData('recovered')) {
          return
        }
        this.recoverABall({ 
          ball
        })
      },
      //args: [],
      callbackScope: this,
      loop: false,
    })
  }

  uninfectABall({ ball, noSave, byPlayer }) {
    ball.setData('infected', false)
    ball.setData('recovered', false)
    ball.setTexture('ball')
    ball.setTintFill('0xd4d6dc')

    if (noSave) {
      return
    }

    const EVENTS = CollectData.getEventsConst()
    const event = (byPlayer && EVENTS.ballRecoveredByPlayer) || EVENTS.ballRecovered
    CollectData.set({ event, gameTime: this.scene.ownVars.time })
  }

  recoverABall({ ball, byPlayer }) {
    if (ball.getData('recovered')) {
      return
    }
    ball.setData('infected', false)
    ball.setData('recovered', true)
    ball.setTexture('ball')
    ball.setTintFill('0x62dcb6')

    const wavesManger = this.scene.ownVars.wavesManager
    wavesManger.shouldTheWaveIncrement(this)

    const EVENTS = CollectData.getEventsConst()
    const event = (byPlayer && EVENTS.ballRecoveredByPlayer) || EVENTS.ballRecovered
    CollectData.set({ event, gameTime: this.scene.ownVars.time })
  }

  uninfectAll () {
    this.balls.getChildren().forEach(ball => {
      this.uninfectABall({ 
        ball,
        noSave: true
      })
    })
    CollectData.resetWaveData({ gameTime: this.scene.ownVars.time })

  }
  
  ballCollideWithBall() {
    this.scene.physics.add.collider(this.balls, this.balls, (_ballA, _ballB) => {
      if (_ballA.getData('infected') && !_ballB.getData('infected') && !_ballB.getData('recovered')) {
        this.infectABall({ ball: _ballB })
      } else if (_ballB.getData('infected') && !_ballA.getData('infected') && !_ballA.getData('recovered')) {
        this.infectABall({ ball: _ballA })
      }

      this.directions.setAnimationByDirection(_ballA)
      this.directions.setAnimationByDirection(_ballB)
    })
  }

  setAnimationByDirection(ball) {
    this.directions.setAnimationByDirection(ball)
  }

  setDefaultVelocity(ball) {
    const { x, y } = ball.body.velocity

    const up = y < 0
    const down = y > 0
    const right = x > 0
    const left = x < 0

    if (up) {
      ball.setVelocityY(this.velocity * -1)
    } else if (down) {
      ball.setVelocityY(this.velocity)
    }

    if (right) {
      ball.setVelocityX(this.velocity)
    } else if (left) {
      ball.setVelocityX(this.velocity * -1)
    }
  }

  stop() {
    this.balls.getChildren().forEach(ball => {
      ball.setVelocity(0)
    }) 
  }

}
