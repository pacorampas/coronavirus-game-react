class CollectData {
  EVENTS = {
    ballInfected: 1,
    ballRecovered: 2,
    ballRecoveredByPlayer: 3,
    playerInfected: 4,
    resetBallsByWave: 5
  }

  data = {}

  totals = {
    length: 0,
    infected: 0,
    recovered: 0
  }

  length = 0

  initGame(length) {
    this.length = length
    this.resetAll()
    this.setTotals(length)
  }

  setTotals = length => {
    
    this.totals = {
      ...this.totals,
      length
    }
  }

  set({ event, gameTime }) {
    if (!Object.values(this.EVENTS).some(e => e === event)) {
      console.error('Collect Data event passed in set not deffined')
      return
    }

    switch(event) {
      case this.EVENTS.ballInfected:
        this.totals.infected += 1
        break
      case this.EVENTS.ballRecovered:
      case this.EVENTS.ballRecoveredByPlayer:
        this.totals.recovered += 1
        this.totals.infected -= 1
        break
      case this.EVENTS.playerInfected:
        this.totals.infected += 1
        break
      default:
        break
    }

    this.data[Date.now()] = {
      gameTime,
      event,
      ...this.totals
    }

    this._notifyChangeData(this.data)
  }

  resetWaveData({ gameTime }) {
    this.totals.infected = 0
    this.totals.recovered = this.totals.length

    this.data[Date.now()] = {
      gameTime,
      event: this.EVENTS.resetBallsByWave,
      ...this.totals
    }

    this._notifyChangeData(this.data)
  }

  resetAll() {
    this.data = {}
    this.totals = {
      length: this.length,
      infected: 0,
      recovered: 0
    }
  }

  getData() {
    return this.data
  }

  getEventsConst() {
    return this.EVENTS
  }

  onChangeCallbacks = []
  onChangeData(cb) {
    if (this.onChangeCallbacks.some(c => c === cb)) {
      return
    }
    this.onChangeCallbacks.push(cb)
  }

  offChangeData(cb) {
    const index = this.onChangeCallbacks.indexOf(cb)
    if (index === -1) {
      return
    }
    this.onChangeCallbacks.splice(index, 1)
  }

  _notifyChangeData(data) {
    this.onChangeCallbacks.forEach(cb => cb(data))
  }
  
}

const globalCollectData = new CollectData()
