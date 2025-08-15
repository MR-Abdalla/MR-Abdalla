// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC2xr8NaXeiYuwJQa7k6qHllRY0tiBcfh8",
    authDomain: "card-bcf12.firebaseapp.com",
    projectId: "card-bcf12",
    storageBucket: "card-bcf12.appspot.com",
    messagingSenderId: "482725905996",
    appId: "1:482725905996:web:a1eec0ac4730da8edfd6e9",
    measurementId: "G-46JJKN96ZE"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Check which page we're on
const isCardPage = document.getElementById('studentForm') !== null;
const isPaymentPage = document.getElementById('paymentForm') !== null;

// Function to generate a unique 14-digit card number
function generateCardNumber() {
    let cardNumber = '';
    const characters = '0123456789';
    
    // Generate first 13 digits randomly
    for (let i = 0; i < 13; i++) {
        cardNumber += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    // Calculate Luhn check digit (last digit)
    let sum = 0;
    for (let i = 0; i < 13; i++) {
        let digit = parseInt(cardNumber.charAt(i));
        
        if (i % 2 === 0) { // Double every other digit starting from first
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        
        sum += digit;
    }
    
    const checkDigit = (10 - (sum % 10)) % 10;
    cardNumber += checkDigit.toString();
    
    return cardNumber;
}

// Card Page Functionality
if (isCardPage) {
    const studentForm = document.getElementById('studentForm');
    const generateCardBtn = document.getElementById('generateCard');
    const cardNumberInput = document.getElementById('cardNumber');
    
    // Generate card number
    generateCardBtn.addEventListener('click', async () => {
        let cardNumber;
        let isUnique = false;
        
        // Keep generating until we get a unique number
        while (!isUnique) {
            cardNumber = generateCardNumber();
            
            // Check if this card number already exists
            const querySnapshot = await db.collection('students')
                .where('cardNumber', '==', cardNumber)
                .get();
                
            isUnique = querySnapshot.empty;
        }
        
        cardNumberInput.value = cardNumber;
    });
    
    // Submit form
    studentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const studentName = document.getElementById('studentName').value;
        const studentCode = document.getElementById('studentCode').value;
        const studentGrade = document.getElementById('studentGrade').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        const cardNumber = document.getElementById('cardNumber').value;
        
        if (!cardNumber) {
            alert('يرجى توليد رقم البطاقة أولاً');
            return;
        }
        
        try {
            // Check if student code already exists
            const querySnapshot = await db.collection('students')
                .where('studentCode', '==', studentCode)
                .get();
                
            if (!querySnapshot.empty) {
                alert('كود الطالب موجود بالفعل!');
                return;
            }
            
            // Add student to Firestore
            await db.collection('students').doc(studentCode).set({
                studentName,
                studentCode,
                studentGrade,
                phoneNumber,
                cardNumber,
                payments: [] // Initialize empty payments array
            });
            
            alert('تم حفظ بيانات الطالب بنجاح!');
            studentForm.reset();
            cardNumberInput.value = '';
        } catch (error) {
            console.error('Error adding document: ', error);
            alert('حدث خطأ أثناء حفظ البيانات');
        }
    });
}

// Payment Page Functionality
if (isPaymentPage) {
    const searchStudentBtn = document.getElementById('searchStudent');
    const searchCodeInput = document.getElementById('searchCode');
    const studentInfoDiv = document.getElementById('studentInfo');
    const paymentForm = document.getElementById('paymentForm');
    const displayName = document.getElementById('displayName');
    const displayGrade = document.getElementById('displayGrade');
    const displayCard = document.getElementById('displayCard');
    
    let currentStudentCode = '';
    
    // Search for student
    searchStudentBtn.addEventListener('click', async () => {
        const studentCode = searchCodeInput.value.trim();
        
        if (!studentCode) {
            alert('يرجى إدخال كود الطالب');
            return;
        }
        
        try {
            const doc = await db.collection('students').doc(studentCode).get();
            
            if (doc.exists) {
                const studentData = doc.data();
                currentStudentCode = studentCode;
                
                // Display student info
                displayName.textContent = studentData.studentName;
                displayGrade.textContent = studentData.studentGrade;
                displayCard.textContent = studentData.cardNumber;
                
                studentInfoDiv.style.display = 'block';
                paymentForm.style.display = 'block';
            } else {
                alert('لا يوجد طالب بهذا الكود');
                studentInfoDiv.style.display = 'none';
                paymentForm.style.display = 'none';
            }
        } catch (error) {
            console.error('Error searching for student: ', error);
            alert('حدث خطأ أثناء البحث عن الطالب');
        }
    });
    
    // Submit payment
    paymentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const purpose = document.getElementById('paymentPurpose').value;
        const amount = document.getElementById('paymentAmount').value;
        
        if (!currentStudentCode) {
            alert('يرجى البحث عن الطالب أولاً');
            return;
        }
        
        try {
            // Add payment to student's payments array
            await db.collection('students').doc(currentStudentCode).update({
                payments: firebase.firestore.FieldValue.arrayUnion({
                    purpose,
                    amount: parseFloat(amount),
                    date: new Date().toISOString()
                })
            });
            
            alert('تم تسجيل الدفع بنجاح!');
            paymentForm.reset();
        } catch (error) {
            console.error('Error adding payment: ', error);
            alert('حدث خطأ أثناء تسجيل الدفع');
        }
    });
}