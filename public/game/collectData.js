class CollectData {
  EVENTS = {
    ballInfected: 1,
    ballRecovered: 2,
    ballRecoveredByPlayer: 3,
    playerInfected: 4
  }

  data = {}

  reset() {
    this.data = {}
  }

  set({ event, gameTime }) {
    console.log('set ->', event, gameTime)
    if (!Object.values(this.EVENTS).some(e => e === event)) {
      console.error('Collect Data event passed in set not deffined')
      return
    }
    this.data[Date.now()] = {
      gameTime,
      event,
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
