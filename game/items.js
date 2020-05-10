/* eslint-disable no-undef */
let timerNextItemInstance
const ITEMS_ID = {
  respirator: 1,
  mask: 2
}
let itemsInWorld = []
const timerNextItem = function(minTime, maxTime) {
  const milliseconds = Phaser.Math.Between(minTime, maxTime)

  timerNextItemInstance = this.time.addEvent({
    delay: milliseconds,
    callback: () => {
      randomNextItem.bind(this)()
      timerNextItem.bind(this)(minTime, maxTime)
    },
    //args: [],
    callbackScope: this,
    loop: false,
  })
}

const randomNextItem = function() {
  const itemsRandom = []
  const player = this.ownVars.player
  
  const hasRespirator = player.hasRespirator()
  const hasMask = player.hasMask()
  const respiratorInWorld = itemsInWorld.some(item => item.id === ITEMS_ID.respirator)
  const maskInWorld = itemsInWorld.some(item => item.id === ITEMS_ID.mask)
  
  if (!hasRespirator && !respiratorInWorld) {
    itemsRandom.push(ITEMS_ID.respirator)
  }
  if (!hasMask && !maskInWorld) {
    itemsRandom.push(ITEMS_ID.mask)
  }

  if (!itemsRandom.length) {
    return
  }

  const randIndex = Phaser.Math.Between(0, itemsRandom.length - 1)

  switch (itemsRandom[randIndex]) {
    case ITEMS_ID.respirator:
      setRespirator.bind(this)()
      return
    case ITEMS_ID.mask:
      setMaskItem.bind(this)()
      return
  }
}

const setMaskItem = function() {
  const player = this.ownVars.player
  const widthObject = 34
  const x = Phaser.Math.Between(0, this.game.config.width - widthObject)
  const y = Phaser.Math.Between(0, this.game.config.height - widthObject)

  const mask = this.physics.add.image(x, y, 'item_mask')
  mask.setDisplaySize(widthObject, widthObject)

  itemsInWorld.push({
    gameObject: mask,
    id: ITEMS_ID.mask
  })

  this.physics.add.overlap(player.get(), mask, (_player, _mask) => {
    const prevData = _player.getData('player')

    _player.setData('player', { ...prevData, mask: true })
    PlayerClass.updateTexture(_player)

    _mask.destroy()
    itemsInWorld = itemsInWorld.filter(item => item.id !== ITEMS_ID.mask)
  })
}

const setRespirator = function() {
  const player = this.ownVars.player
  const widthObject = 34
  const x = Phaser.Math.Between(0, this.game.config.width - widthObject)
  const y = Phaser.Math.Between(0, this.game.config.height - widthObject)

  const respirator = this.physics.add.image(x, y, 'item_respirator')
  respirator.setDisplaySize(widthObject, widthObject)

  itemsInWorld.push({
    gameObject: respirator,
    id: ITEMS_ID.respirator
  })

  this.physics.add.overlap(player.get(), respirator, (_player, _respirator) => {
    const prevData = _player.getData('player')

    _player.setData('player', { ...prevData, respirator: true })

    PlayerClass.updateTexture(_player)

    _respirator.destroy()
    itemsInWorld = itemsInWorld.filter(item => item.id !== ITEMS_ID.respirator)
  })
}

const timerNextItemReset = function() {
  itemsInWorld.forEach(item => {
    item.gameObject.destroy()
  })
  itemsInWorld = []
  timerNextItemInstance && timerNextItemInstance.remove()
}

const setPointIcon = function() {
  const player = this.ownVars.player
  const widthObject = 34
  const x = Phaser.Math.Between(0, this.game.config.width - widthObject)
  const y = Phaser.Math.Between(0, this.game.config.height - widthObject)

  const itemsName = ['item_dog', 'item_shop']
  const randomIndex = Phaser.Math.Between(0, itemsName.length - 1)

  const item = this.physics.add.image(x, y, itemsName[randomIndex])
  item.setDisplaySize(widthObject, widthObject)

  this.physics.add.overlap(player.get(), item, (_player, _item) => {
    this.ownVars.wavesManager.sumPoints()
    _item.destroy()
    setPointIcon.bind(this)()
  })
}
