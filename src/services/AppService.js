

class AppService {
  constructor() {
    const historyJson = localStorage.getItem('history')
    this.history = historyJson ? JSON.parse(historyJson) : []

    this.onBoardingGameShowed = localStorage.getItem('onBoardingGameShowed')
  }

  setNewPuntation(points) {
    // return true if is the new best
    const newHistoryItem = {
      points,
      date: Date.now()
    }

    if (!this.history.length) {
      this.history.push(newHistoryItem)
      this.saveInLocalStorage()
      return true
    }

    const index = this.history.findIndex(pointsItem => 
      points > pointsItem.points
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
    return this.history[0]
  }

  onBoardingGameShowed() {
    return this.onBoardingGameShowed
  }

  setOnBoardingGameShowed(value) {
    this.onBoardingGameShowed = !!value
    localStorage.setItem('onBoardingGameShowed', this.onBoardingGameShowed)
  }
}

export default new AppService()
