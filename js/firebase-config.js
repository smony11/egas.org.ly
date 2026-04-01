// EGAS NGO - Firebase Configuration
// Import at least the Firebase app and database services from the CDN in your HTML files.

const firebaseConfig = {
    apiKey: "AIzaSyAwaJuMqhDwqO7x5c5Ca5JT2woo8-l988A",
    authDomain: "egas-f6050.firebaseapp.com",
    projectId: "egas-f6050",
    storageBucket: "egas-f6050.firebasestorage.app",
    messagingSenderId: "239305720307",
    appId: "1:239305720307:web:4CAF01104f5719f3039286",
    measurementId: "G-R2Q9TV1N8G"
};

// Initialize Firebase (Compat)
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    const analytics = firebase.analytics();
}
