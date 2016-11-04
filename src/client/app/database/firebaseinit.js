import Vue from 'vue';
import VueFire from 'vuefire';
import Firebase from 'firebase';

Vue.use(VueFire);
const firebaseApp = Firebase.initializeApp({
    apiKey: "AIzaSyDU6PNV3PkW90L8RowwWVXxpwAIDwIO4WM",
    authDomain: "testvue-d8cf9.firebaseapp.com",
    databaseURL: "https://testvue-d8cf9.firebaseio.com",
    storageBucket: "testvue-d8cf9.appspot.com",
    messagingSenderId: "797307358776"
});
const db = firebaseApp.database();

const communitiesDB = db.ref('communities');
const membersDB = db.ref('members');
const projectsDB = db.ref('projects');



export { firebaseApp, db, communitiesDB, membersDB, projectsDB, Firebase };
