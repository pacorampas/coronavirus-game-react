class CollectData {
  EVENTS = {
    ballInfected: 1,
    ballRecovered: 2,
    ballRecoveredByPlayer: 3,
    playerInfected: 4
  }

  data = {}

  totals = {
    length: 0,
    infected: 0,
    recovered: 0
  }

  setTotals = (length) => {
    this.totals = {
      ...this.totals,
      length
    }
  }

  reset() {
    this.data = {}
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
  }

  getData() {
    return this.data
  }

  getEventsConst() {
    return this.EVENTS
  }
  
}

const globalCollectData = new CollectData()
