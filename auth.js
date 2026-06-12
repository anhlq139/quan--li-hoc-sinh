const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('auth-container');

// Forms
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');

// Modals
const emailModal = document.getElementById('email-modal');
const closeEmailBtn = document.getElementById('close-email-btn');
const displayEmail = document.getElementById('display-email');

// Animations
signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

// Register Logic (Log in dành cho người chưa có tk theo yêu cầu)
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('reg-email').value.trim();
    const name = document.getElementById('reg-name').value.trim();
    const age = parseInt(document.getElementById('reg-age').value);
    const password = document.getElementById('reg-password').value;
    const errorMsg = document.getElementById('reg-error');
    const btn = document.getElementById('reg-btn');

    errorMsg.textContent = '';

    // Validate Age
    if (age < 22) {
        errorMsg.textContent = "Bạn phải từ 22 tuổi trở lên mới được đăng ký.";
        return;
    }

    // Check existing
    let users = JSON.parse(localStorage.getItem('eduUsers')) || [];
    if (users.find(u => u.name === name)) {
        errorMsg.textContent = "Tên đăng nhập này đã tồn tại!";
        return;
    }

    // Save user
    const newUser = { email, name, age, password };
    users.push(newUser);
    localStorage.setItem('eduUsers', JSON.stringify(users));

    // Show loading state
    btn.classList.add('loading');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang xử lý...';

    // Simulate sending email
    setTimeout(() => {
        btn.classList.remove('loading');
        btn.innerHTML = 'Đăng Kí';
        
        // Show success modal
        displayEmail.textContent = email;
        emailModal.classList.add('active');
        
        registerForm.reset();
    }, 1500);
});

// Close Email Modal
closeEmailBtn.addEventListener('click', () => {
    emailModal.classList.remove('active');
    // Switch back to login panel after success
    container.classList.remove("right-panel-active");
});

// Login Logic (Sign in dành cho người đã có tk)
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('login-name').value.trim();
    const password = document.getElementById('login-password').value;
    const errorMsg = document.getElementById('login-error');

    errorMsg.textContent = '';

    let users = JSON.parse(localStorage.getItem('eduUsers')) || [];
    
    // Check credentials
    const validUser = users.find(u => u.name === name && u.password === password);

    if (validUser) {
        // Success
        localStorage.setItem('eduActiveUser', JSON.stringify(validUser));
        window.location.href = 'index.html';
    } else {
        errorMsg.textContent = "Sai tên đăng nhập hoặc mật khẩu!";
    }
});

// Check if already logged in
window.addEventListener('DOMContentLoaded', () => {
    const activeUser = localStorage.getItem('eduActiveUser');
    if (activeUser) {
        window.location.href = 'index.html';
    }
});
