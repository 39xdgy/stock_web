import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';

const firebaseApp = firebase.initializeApp({
    apikey: null,
    authDomain: null,
    databaseUrl: null,
    projectId: null,
    storageBucket: null,
    messageingSenderId: null,
    appId: null,
});

const storage = firebase.storage();

export { storage, firebaseApp as default};