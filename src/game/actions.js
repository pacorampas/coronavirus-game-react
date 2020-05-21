/* eslint-disable no-unused-vars */
import Phaser from 'phaser'

export const socialDistancigAction = function(howManyShouldBeStopped, timer, balls) {
  balls.getGroup().getChildren().forEach((ball, i) => {
    if (howManyShouldBeStopped > i) {
      ball.setVelocity(0)
      ball.setImmovable(true)
      
      if (timer && timer > 0) {
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

export const quarentineWallAction = function(cb, balls) {
  const max = this.game.config.width - 200
  const x = Phaser.Math.Between(200, max)
  // const x = this.game.config.width / 2

  const w = 24 
  const h = this.game.config.height / 2

  // x, y, w, h
  var r1 = this.add.rectangle(0, 0, w, h, 0xd4d6dc)
  var r2 = this.add.rectangle(0, 0, w, h, 0xd4d6dc)

  this.physics.add.existing(r1);
  this.physics.add.existing(r2);
  
  r1.x = x
  r1.y = h * -1
  r1.body.velocity.x = 0;
  r1.body.velocity.y = 100;
  r1.body.bounce.x = 1;
  r1.body.bounce.y = 1;
  // r1.body.collideWorldBounds = true;

  r2.x = x
  r2.y = h + this.game.config.height 
  r2.body.velocity.x = 0;
  r2.body.velocity.y = -100;
  r2.body.bounce.x = 1;
  r2.body.bounce.y = 1;
  // r2.body.collideWorldBounds = true;

  r1.body.setImmovable(true)
  r2.body.setImmovable(true)
  
  const colliderRects = this.physics.add.collider(r1, r2, (_r1, _r2) => {
    r1.body.setVelocity(0)
    r2.body.setVelocity(0)
    this.physics.world.removeCollider(colliderRects)
  })
  
  const colliders = []
  colliders.push(this.physics.add.collider(r1, this.ownVars.player.get(), (_r1, _player) => {
    this.ownVars.player.setDefaultVelocity()
  }))
  colliders.push(this.physics.add.collider(r2, this.ownVars.player.get(), (_r1, _player) => {
    this.ownVars.player.setDefaultVelocity()
  }))
  colliders.push(this.physics.add.collider(r1, balls.getGroup(), (_r1, _ball) => {
    balls.setDefaultVelocity(_ball)
  }))
  colliders.push(this.physics.add.collider(r2, balls.getGroup(), (_r1, _ball) => {
    balls.setDefaultVelocity(_ball)
  }))

  this.time.addEvent({
    delay: 10000,
    callback: () => {
      r1.body.velocity.y = -100;
      r2.body.velocity.y = 100;
      this.time.addEvent({
        delay: 10000,
        callback: () => {
          colliderRects && this.physics.world.removeCollider(colliderRects)
          colliders.forEach(coll => this.physics.world.removeCollider(coll))
          cb && cb()
        }
      })
    },
    //args: [],
    callbackScope: this,
    loop: false,
  })
}
