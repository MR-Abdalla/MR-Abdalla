// ✅ استيراد Firebase من CDN (لو بتستخدم بدون NPM)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";

// ✅ إعدادات Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB2Mqw0khgC17QEfvhLgw7RM40eSYHh-yA",
    authDomain: "abdalla-elsayd.firebaseapp.com",
    projectId: "abdalla-elsayd",
    storageBucket: "abdalla-elsayd.appspot.com",
    messagingSenderId: "419918533531",
    appId: "1:419918533531:web:a65d365cac57246872473e",
    measurementId: "G-946RK4Y853"
};

// ✅ تهيئة Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// يمكنك الآن استخدام `db` للوصول إلى البيانات
