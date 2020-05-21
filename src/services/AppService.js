class AppService {
  constructor() {
    const historyJson = localStorage.getItem('history')
    this.history = historyJson ? JSON.parse(historyJson) : []

    this.onBoardingGameShowed = Number(localStorage.getItem('onBoarding')) || 0
  }

  setNewPuntation({ totalPoints, points, time, wave }) {
    // return true if is the new best
    const newHistoryItem = {
      totalPoints, 
      points, 
      time, 
      wave,
      date: Date.now()
    }

    if (!this.history.length) {
      this.history.push(newHistoryItem)
      this.saveInLocalStorage()
      return true
    }

    const index = this.history.findIndex(pointsItem => 
      totalPoints > pointsItem.totalPoints
    )
    
    if (index > -1) {
      this.history.splice(index, 0, newHistoryItem)
    } else {
      this.history.push(newHistoryItem)
    }

    if (this.history.length > 10) {
      this.history.pop()
    }

    this.saveInLocalStorage()

    return index === 0
  }

  saveInLocalStorage() {
    localStorage.setItem('history', JSON.stringify(this.history))
  }

  getBestScore() {
    return this.history[0] && this.history[0].totalPoints
  }

  onBoardingGameShowed() {
    return this.onBoardingGameShowed
  }

  // 0
  // 1 goal, directions and waves
  // 2 sprint and socialDistancing
  // 3 mask, medical, shop and dog
  setOnBoardingGameShowed(value) {
    this.onBoardingGameShowed = value
    localStorage.setItem('onBoarding', this.onBoardingGameShowed)
  }

  showTip() {
    return this.onBoardingGameShowed
  }

  gtag() {
    if (window.location.hostname.includes('localhost')) {
      return
    }
    window.gtag.apply(null, arguments)
  }
}

export default new AppService()
