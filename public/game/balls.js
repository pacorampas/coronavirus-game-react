/* eslint-disable no-undef */
class BallsClass {
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
    Phaser.Actions.RandomRectangle(ballsChildren, scene.physics.world.bounds)

    ballsChildren.forEach((ball) => {
      ball.setSize(60, 60, true)
      ball.setDisplaySize(24, 24)
  
      if (Phaser.Math.Between(0, 1) === 1) {
        ball.setVelocity(this.velocity * -1)
      }

      // ball.anims.load('player_walk_down')

      // ball.anims.play('player_walk_down')

      BallsClass.uninfectABall({ ball, noSave: true })

      this.directions.setAnimationByDirection(ball)
    })

    const gameTime = this.scene.ownVars.time
    BallsClass.infectABall({ 
      ball: ballsChildren[ballsChildren.length - 1],  
      gameTime,
      scene: this.scene
    })

    this.ballCollideWithBall()
  }

  getGroup() {
    return this.balls
  }

  static infectABall({ ball, gameTime, scene }) {
    const EVENTS = globalCollectData.getEventsConst()

    ball.setData('infected', true)
    ball.setTexture('infected')
    
    globalCollectData.set({ event: EVENTS.ballInfected, gameTime })

    scene.time.addEvent({
      delay: 10000,
      callback: () => {
        if (ball.getData('recovered')) {
          return
        }
        BallsClass.recoverABall({ 
          ball,  
          gameTime: scene.ownVars.time
        })
      },
      //args: [],
      callbackScope: this,
      loop: false,
    })
  }

  static uninfectABall({ ball, gameTime, noSave, byPlayer }) {
    
    ball.setData('infected', false)
    
    if (noSave) {
      return
    }

    const EVENTS = globalCollectData.getEventsConst()
    const event = (byPlayer && EVENTS.ballRecoveredByPlayer) || EVENTS.ballRecovered
    globalCollectData.set({ event, gameTime })
  }

  static recoverABall({ ball, gameTime, byPlayer }) {
    
    ball.setData('infected', false)
    ball.setData('recovered', true)
    ball.setTintFill('0x00ff00')

    const EVENTS = globalCollectData.getEventsConst()
    const event = (byPlayer && EVENTS.ballRecoveredByPlayer) || EVENTS.ballRecovered
    globalCollectData.set({ event, gameTime })
  }
  
  ballCollideWithBall() {
    this.scene.physics.add.collider(this.balls, this.balls, (_ballA, _ballB) => {
      const gameTime = this.scene.ownVars.time
      if (_ballA.getData('infected') && !_ballB.getData('infected') && !_ballB.getData('recovered')) {
        BallsClass.infectABall({ ball: _ballB, gameTime, scene: this.scene })
      } else if (_ballB.getData('infected') && !_ballA.getData('infected') && !_ballA.getData('recovered')) {
        BallsClass.infectABall({ ball: _ballA, gameTime, scene: this.scene })
      }

      this.directions.setAnimationByDirection(_ballA)
      this.directions.setAnimationByDirection(_ballB)
    })
  }

  setAnimationByDirection(ball) {
    this.directions.setAnimationByDirection(ball)
  }

}
