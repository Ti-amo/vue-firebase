// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAGP_1dIZtKqpyiVUOi9dMi3dA94wsPhz8",
  authDomain: "electric-report-da493.firebaseapp.com",
  databaseURL: "https://electric-report-da493.firebaseio.com",
  projectId: "electric-report-da493",
  storageBucket: "electric-report-da493.appspot.com",
  messagingSenderId: "537583038916",
  appId: "1:537583038916:web:3c53ab6efd431d5a957491",
  measurementId: "G-K8JCEXR9TV"
};

  firebase.initializeApp(firebaseConfig)

// utils
const db = firebase.firestore()
const auth = firebase.auth()

// collection references
const usersCollection = db.collection('users')
const postsCollection = db.collection('posts')
const commentsCollection = db.collection('comments')
const likesCollection = db.collection('likes')

// export utils/refs
export {
  db,
  auth,
  usersCollection,
  postsCollection,
  commentsCollection,
  likesCollection
}