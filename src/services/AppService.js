export const FIRST_QUESTION_COUNT = 20
export const SECOND_QUESTION_COUNT = 80

class AppService {
  constructor() {
    const historyJson = localStorage.getItem('history')
    this.history = historyJson ? JSON.parse(historyJson) : []
    this.countGames = 0
    this.firestore = window.firebase.firestore()
    this.bestScore = { totalPoints: 0, wave: 0, points: 0, time: 0 }

    this.onBoardingGameShowed = Number(localStorage.getItem('onBoarding')) || 0
    this.cookiesAccepted = Boolean(localStorage.getItem('cookiesAccepted')) || false
  }

  signInAnonymously = async () => {
    return new Promise(resolve => {
      window.firebase.auth().signInAnonymously()
      window.firebase.auth().onAuthStateChanged(async user => {
        if (user) {
          this.user = user
          resolve(this.user)

          const resp = await this.firestore
            .collection('users')
            .doc(user.uid)
            .get()

          this.countGames = (resp.data() && resp.data().countGames) || 0
        }
      })
    })
  }

  setNewPuntation = async ({ totalPoints, points, time, wave }) => {
    const { uid } = this.user
    const date = Date.now()

    const newHistoryItem = {
      totalPoints, 
      points, 
      time, 
      wave,
      date,
      ts: Date.now()
    }
    
    // TODO save in local storage if connection is lost
    this.firestore.collection('users').doc(uid).collection('history').add(newHistoryItem)
        
    return new Promise(resolve => {
      if (newHistoryItem.totalPoints > this.bestScore.totalPoints) {
        this.bestScore = newHistoryItem
        resolve(true)
      }
  
      resolve(false)
    })

  }

  getBestScore = async () => {
    const { uid } = this.user

    const querySnapshot = await this.firestore
      .collection('users')
      .doc(uid)
      .collection('history')
      .orderBy('totalPoints', 'desc')
      .limit(1)
      .get()

    querySnapshot.forEach(doc => 
      this.bestScore = doc.data()
    )

    return this.bestScore.totalPoints
  }

  onBoardingGameShowed() {
    return this.onBoardingGameShowed
  }

  getCookiesAccepted() {
    return this.cookiesAccepted
  }

  setCookiesAccepted() {
    this.cookiesAccepted = true
    localStorage.setItem('cookiesAccepted', this.cookiesAccepted)
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

  logEvent() {
    window.firebase.analytics().logEvent.apply(null, arguments)
  }

  getCountGames() {
    return this.countGames
  }

  incrementCountGames() {
    const { uid } = this.user
    this.countGames = this.countGames + 1
    this.firestore.collection('users').doc(uid).set({ countGames: this.countGames })
    return this.countGames
  }
}

export default new AppService()
