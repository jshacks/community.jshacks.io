import Firebase from 'firebase'

const db = Firebase.initializeApp({
  databaseURL: "https://testvue-d8cf9.firebaseio.com/",
}).database()

export default db
