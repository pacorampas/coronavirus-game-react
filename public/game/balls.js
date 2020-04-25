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

    Phaser.Actions.RandomRectangle(this.balls.getChildren(), scene.physics.world.bounds)

    this.balls.getChildren().forEach((ball) => {
      ball.setSize(200, 200, true)
      ball.setDisplaySize(40, 40)
  
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
      ball: this.balls.getChildren()[0],  
      gameTime
    })

    this.ballCollideWithBall()
  }

  getGroup() {
    return this.balls
  }

  static infectABall({ ball, gameTime }) {
    const EVENTS = globalCollectData.getEventsConst()

    ball.setData('infected', true)
    ball.setTint('0xd1045a')
    
    globalCollectData.set({ event: EVENTS.ballInfected, gameTime })
  }

  static uninfectABall({ ball, gameTime, noSave, byPlayer }) {
    
    ball.setData('infected', false)
    ball.setTint('0xfa5fd6')
    
    if (noSave) {
      return
    }

    const EVENTS = globalCollectData.getEventsConst()
    const event = (byPlayer && EVENTS.ballRecoveredByPlayer) || EVENTS.ballRecovered
    globalCollectData.set({ event, gameTime })
  }
  
  ballCollideWithBall() {
    this.scene.physics.add.collider(this.balls, this.balls, (_ballA, _ballB) => {
      const gameTime = this.scene.ownVars.time
      if (_ballA.getData('infected') && !_ballB.getData('infected')) {
        BallsClass.infectABall({ ball: _ballB, gameTime })
      } else if (_ballB.getData('infected') && !_ballA.getData('infected')) {
        BallsClass.infectABall({ ball: _ballA, gameTime })
      }

      this.directions.setAnimationByDirection(_ballA)
      this.directions.setAnimationByDirection(_ballB)
    })
  }

  setAnimationByDirection(ball) {
    this.directions.setAnimationByDirection(ball)
  }

}
