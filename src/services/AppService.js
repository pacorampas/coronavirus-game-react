class AppService {
  constructor() {
    const historyJson = localStorage.getItem('history')
    this.history = historyJson ? JSON.parse(historyJson) : []
    this.firestore = window.firebase.firestore()

    this.onBoardingGameShowed = Number(localStorage.getItem('onBoarding')) || 0

    window.firebase.auth().signInAnonymously()

    window.firebase.auth().onAuthStateChanged(function(user) {
      console.log(user.uid)
      // const { uid } = user
      // this.firestore.collection('users').doc(uid).then(function(doc) {
      //   // Document was found in the cache. If no cached document exists,
      //   // an error will be returned to the 'catch' block below.
      //   console.log(doc.data());
      // }).catch(function(error) {
      //     console.log("Error getting cached document:", error);
      // });
    })
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
    // if (window.location.hostname.includes('localhost')) {
    //   return
    // }
    window.firebase.analytics().logEvent(null, arguments)
  }
}

export default new AppService()
