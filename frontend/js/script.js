const authForm = document.getElementById('auth-form');
const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');
const errorMsg = document.getElementById('error-message');
const submitBtn = document.getElementById('submit-btn');

let isLogin = true;

// Tabs
loginTab.addEventListener('click', () => {
    isLogin = true;
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    submitBtn.textContent = 'Login';
});

signupTab.addEventListener('click', () => {
    isLogin = false;
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    submitBtn.textContent = 'Sign Up';
});

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.classList.add('hidden');

    // Get values from the input fields
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;

    const url = `http://127.0.0.1:8000${isLogin ? '/login' : '/signup'}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: usernameInput, // CHANGED: username -> user_id
                password: passwordInput
            })
        });

        const data = await response.json();

        if (response.ok) {
            if (isLogin) {
                // Store the JWT token
                localStorage.setItem('token', data.access_token);
                window.location.href = 'dashboard.html';
            } else {
                alert("Signup successful! Please login.");
                loginTab.click();
            }
        } else {
            // Meaningful error message handling
            let displayError = "An error occurred";

            if (data.detail) {
                if (typeof data.detail === 'string') {
                    displayError = data.detail;
                } else if (Array.isArray(data.detail)) {
                    // Extract the specific field error from FastAPI array
                    displayError = `${data.detail[0].loc[1]}: ${data.detail[0].msg}`;
                }
            }

            errorMsg.textContent = displayError;
            errorMsg.classList.remove('hidden');
        }
    } catch (err) {
        errorMsg.textContent = "Server connection failed. Is the backend running?";
        errorMsg.classList.remove('hidden');
    }
});