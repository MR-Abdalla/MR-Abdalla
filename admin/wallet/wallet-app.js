import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, addDoc, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBu1tQfkvavnVsWBfXr5wV1j6QFDmmeCw0",
  authDomain: "wallet-cf1bb.firebaseapp.com",
  projectId: "wallet-cf1bb",
  storageBucket: "wallet-cf1bb.firebasestorage.app",
  messagingSenderId: "729732138811",
  appId: "1:729732138811:web:5cfa382f358c869e47d91e",
  measurementId: "G-KYBPBZKHQ6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM elements
const studentForm = document.getElementById('studentForm');
const messageDiv = document.getElementById('message');

// Show message function
function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// Check if student ID already exists
async function checkStudentIdExists(studentId) {
    try {
        const studentDoc = await getDoc(doc(db, 'students', studentId));
        return studentDoc.exists();
    } catch (error) {
        console.error('Error checking student ID:', error);
        return false;
    }
}

// Create new wallet
async function createWallet(studentData) {
    try {
        // Check if student ID already exists
        const exists = await checkStudentIdExists(studentData.studentId);
        if (exists) {
            throw new Error('رقم الطالب موجود مسبقاً!');
        }

        // Create student document
        await setDoc(doc(db, 'students', studentData.studentId), {
            fullName: studentData.fullName,
            phone: studentData.phone,
            email: studentData.email || '',
            password: studentData.password, // In production, hash this!
            securityQuestion: studentData.securityQuestion,
            securityAnswer: studentData.securityAnswer,
            balance: studentData.initialBalance,
            createdAt: new Date(),
            status: 'active'
        });

        // Create initial transaction record if balance > 0
        if (studentData.initialBalance > 0) {
            await addDoc(collection(db, 'transactions'), {
                studentId: studentData.studentId,
                type: 'deposit',
                amount: studentData.initialBalance,
                description: 'رصيد أولي',
                timestamp: new Date(),
                balanceAfter: studentData.initialBalance
            });
        }

        return true;
    } catch (error) {
        console.error('Error creating wallet:', error);
        throw error;
    }
}

// Form submission handler
studentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form values
    const formData = {
        fullName: document.getElementById('fullName').value.trim(),
        studentId: document.getElementById('studentId').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        initialBalance: parseFloat(document.getElementById('initialBalance').value) || 0,
        securityQuestion: document.getElementById('securityQuestion').value,
        securityAnswer: document.getElementById('securityAnswer').value.trim()
    };

    // Validation
    if (formData.password !== formData.confirmPassword) {
        showMessage('كلمة السر غير متطابقة!', 'error');
        return;
    }

    if (formData.password.length < 6) {
        showMessage('كلمة السر يجب أن تكون 6 أحرف على الأقل!', 'error');
        return;
    }

    if (formData.initialBalance < 0) {
        showMessage('الرصيد لا يمكن أن يكون سالباً!', 'error');
        return;
    }

    try {
        // Show loading
        const submitBtn = studentForm.querySelector('button');
        submitBtn.disabled = true;
        submitBtn.textContent = 'جاري إنشاء المحفظة...';

        // Create wallet
        await createWallet(formData);
        
        showMessage(`✅ تم إنشاء المحفظة بنجاح للطالب ${formData.fullName}`, 'success');
        studentForm.reset();
        
    } catch (error) {
        showMessage(`❌ خطأ: ${error.message}`, 'error');
    } finally {
        // Reset button
        const submitBtn = studentForm.querySelector('button');
        submitBtn.disabled = false;
        submitBtn.textContent = 'إنشاء المحفظة';
    }
});

// Real-time validation for student ID
document.getElementById('studentId').addEventListener('blur', async function() {
    const studentId = this.value.trim();
    if (studentId) {
        const exists = await checkStudentIdExists(studentId);
        if (exists) {
            showMessage('⚠️ رقم الطالب موجود مسبقاً!', 'error');
        }
    }
});