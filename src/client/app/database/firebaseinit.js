import Vue from 'vue';
import VueFire from 'vuefire';
import Firebase from 'firebase';

Vue.use(VueFire);
const firebaseApp = Firebase.initializeApp({
    databaseURL: "https://testvue-d8cf9.firebaseio.com/",
});
const db = firebaseApp.database();

const communitiesDB = db.ref('communities');
const membersDB = db.ref('members');
const projectsDB = db.ref('projects');


export { firebaseApp, db, communitiesDB, membersDB, projectsDB };
