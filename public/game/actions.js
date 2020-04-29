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

const quarentineWallAction = function(cb) {
  const max = this.game.config.width - 200
  const x = Phaser.Math.Between(200, max)

  const w = 4 
  const h = this.game.config.height / 2

  // x, y, w, h
  var r1 = this.add.rectangle(0, 0, w, h, 0x333333)
  var r2 = this.add.rectangle(0, 0, w, h, 0x333333)

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
  colliders.push(this.physics.add.collider(r1, this.ownVars.player.get()))
  colliders.push(this.physics.add.collider(r2, this.ownVars.player.get()))
  colliders.push(this.physics.add.collider(r1, balls.getGroup()))
  colliders.push(this.physics.add.collider(r2, balls.getGroup()))

  this.time.addEvent({
    delay: 30000,
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
