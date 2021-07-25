import { firebase } from '@firebase/app';
import 'firebase/auth'
import 'firebase/firestore'

// firebase init - add your own config here
var firebaseConfig = {
  apiKey: "AIzaSyCbHn748ThiXPUSefa6xpmwYkBsRHBXLTo",
  authDomain: "vue-mytime.firebaseapp.com",
  databaseURL: "https://vue-mytime-default-rtdb.firebaseio.com",
  projectId: "vue-mytime",
  storageBucket: "vue-mytime.appspot.com",
  messagingSenderId: "1034254839275",
  appId: "1:1034254839275:web:da532f9e743d6071633dae"
};
firebase.initializeApp(firebaseConfig)

// utils
const db = firebase.firestore()
const auth = firebase.auth()

auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
// collection references
const usersCollection = db.collection('users')
const postsCollection = db.collection('posts')
const commentsCollection = db.collection('comments')
const likesCollection = db.collection('likes')
const timesCollection = db.collection('times')

// export utils/refs
export {
  db,
  auth,
  usersCollection,
  postsCollection,
  commentsCollection,
  likesCollection,
  timesCollection
}