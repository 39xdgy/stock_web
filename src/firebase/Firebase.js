import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyADpCYy5NTH_XfmPZ3aLBoy3kEVsdMqk-8",
    authDomain: "stock-web-19682.firebaseapp.com",
    databaseURL: "https://stock-web-19682-default-rtdb.firebaseio.com",
    projectId: "stock-web-19682",
    storageBucket: "stock-web-19682.appspot.com",
    messagingSenderId: "829141757660",
    appId: "1:829141757660:web:43e343088f8719efaace19",
    measurementId: "G-WXP8M5V4PM"
});

const storage = firebase.storage();

export { storage, firebaseApp as default};