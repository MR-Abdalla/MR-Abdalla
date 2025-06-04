        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        
        loginBtn.addEventListener('click', function() {
            loginBtn.classList.add('active');
            signupBtn.classList.remove('active');
        });
        
        signupBtn.addEventListener('click', function() {
            signupBtn.classList.add('active');
            loginBtn.classList.remove('active');
        });