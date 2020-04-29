/* eslint-disable no-undef */
const timerNextItem = function(ballsLength) {
  this.time.addEvent({
    delay: 1000,
    callback: () => randomNextItem.bind(this)(ballsLength),
    //args: [],
    callbackScope: this,
    loop: false,
  })
}

const randomNextItem = function(ballsLength) {
  const rand = Phaser.Math.Between(0, 3)

  switch (rand) {
    case 0:
      setRespirator.bind(this)()
      return
    case 1:
      setMaskItem.bind(this)()
      return
    case 2:
      // more social distancing
      setSocialDistancingItem.bind(this)(Math.floor(ballsLength / 2), 1)
      return
    case 3:
      // social distancing
      setSocialDistancingItem.bind(this)(Math.floor(ballsLength / 4))
      return
    // case 4:
    //   setQuarentineWall.bind(this)()
    //   return
  }
}

const setMaskItem = function() {
  const player = this.ownVars.player
  const widthObject = 40
  const x = Phaser.Math.Between(0, this.game.config.width - widthObject)
  const y = Phaser.Math.Between(0, this.game.config.height - widthObject)

  const mask = this.physics.add.image(x, y, 'item_mask')
  mask.setDisplaySize(widthObject, widthObject)

  this.physics.add.overlap(player.get(), mask, (_player, _mask) => {
    const prevData = _player.getData('player')

    _player.setData('player', { ...prevData, mask: true })
    PlayerClass.updateTexture(_player)

    _mask.destroy()
    timerNextItem.bind(this)()
  })
}

const setRespirator = function() {
  const player = this.ownVars.player
  const widthObject = 40
  const x = Phaser.Math.Between(0, this.game.config.width - widthObject)
  const y = Phaser.Math.Between(0, this.game.config.height - widthObject)

  const respirator = this.physics.add.image(x, y, 'item_respirator')
  respirator.setDisplaySize(widthObject, widthObject)

  this.physics.add.overlap(player.get(), respirator, (_player, _respirator) => {
    const prevData = _player.getData('player')

    _player.setData('player', { ...prevData, respirator: true })

    PlayerClass.updateTexture(_player)

    _respirator.destroy()
    timerNextItem.bind(this)()
  })
}

const setSocialDistancingItem = function(
  howManyShouldBeStopped,
  textureImageForItem,
) {
  const player = this.ownVars.player
  const widthObject = 40
  const x = Phaser.Math.Between(0, this.game.config.width - widthObject)
  const y = Phaser.Math.Between(0, this.game.config.height - widthObject)

  let itemSocialDistancing
  if (textureImageForItem === 1) {
    itemSocialDistancing = this.physics.add.image(
      x,
      y,
      'item_more_social_distancing'
    )
  } else {
    itemSocialDistancing = this.physics.add.image(
      x,
      y,
      'item_social_distancing'
    )
  }
  itemSocialDistancing.setDisplaySize(widthObject, widthObject)
  itemSocialDistancing.setData(
    'socialDistancingIntensity',
    howManyShouldBeStopped
  )

  this.physics.add.overlap(
    player.get(),
    itemSocialDistancing,
    (_player, _itemSocialDistancing) => {
      const socialDistancingIntensity = _itemSocialDistancing.getData(
        'socialDistancingIntensity'
      )

      balls.getGroup().getChildren().forEach((ball, i) => {
        const howManyShouldBeStopped = socialDistancingIntensity

        if (howManyShouldBeStopped > i) {
          ball.setVelocity(0)
          ball.setImmovable(true)

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
      })
      _itemSocialDistancing.destroy()
      timerNextItem.bind(this)()
    }
  )
}

