/* eslint-disable no-unused-vars */
const socialDistancigAction = function(howManyShouldBeStopped, timer) {
  console.log('pepeee', howManyShouldBeStopped, timer)
  balls.getGroup().getChildren().forEach((ball, i) => {
    if (howManyShouldBeStopped > i) {
      ball.setVelocity(0)
      ball.setImmovable(true)
      
      if (timer && timer > 0) {
        console.log('pasooo!!!')
        this.time.addEvent({
          delay: 5000,
          callback: () => {
            const isPositive = Phaser.Math.Between(0, 1)
            ball.setVelocity(
              isPositive ? this.ownVars.velocity * -1 : this.ownVars.velocity
            )
            ball.setImmovable(false)
          },
          //args: [],
          callbackScope: this,
          loop: false,
        })
      }

    }
  })

}
