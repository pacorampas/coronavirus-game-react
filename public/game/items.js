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
  const rand = Phaser.Math.Between(0, 2)

  switch (rand) {
    case 0:
      setRespirator.bind(this)()
      return
    case 1:
      setMaskItem.bind(this)()
      return
  }
}

const setMaskItem = function() {
  const player = this.ownVars.player
  const widthObject = 24
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
  const widthObject = 24
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
