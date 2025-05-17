document.addEventListener('DOMContentLoaded', function () {
    const tabLinks = document.querySelectorAll('[data-tab-target]');
    const tabsContainer = document.querySelector('.main-section');
    let isAnimating = false;

    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isAnimating) return;

            const target = document.querySelector(link.dataset.tabTarget);
            const currentActiveTab = document.querySelector('.tab.active');

            if (target === currentActiveTab) return;

            isAnimating = true;

            const isSignup = target.id === 'registerTab';

            target.classList.add(isSignup ? 'slide-in-right' : 'slide-in-left');
            currentActiveTab.classList.add(isSignup ? 'slide-out-left' : 'slide-out-right');

            setTimeout(() => {
                currentActiveTab.classList.remove('active', 'slide-out-left', 'slide-out-right');
                target.classList.remove('slide-in-right', 'slide-in-left');
                target.classList.add('active');
                isAnimating = false;
            }, 200);
        });
    });
    const modal = document.getElementById('policyModal');
    const closeBtn = document.querySelector('.close');
    const policyContent = document.getElementById('policyContent');
    const policyLinks = document.querySelectorAll('.claim span');

    // policy content ilalagay dito
    const policies = {
        userAgreement: `
            <h2>BPsync User Agreement</h2>
            <p>Last Updated: May 17, 2025</p>
            <h3>1. Introduction</h3>
            <p>This User Agreement and Privacy Policy Agreement governs your use of the Bulacan Polytechnic College Class Scheduling System "BPsync". By accessing or using the System, you agree to comply with this Agreement. If you do not agree, please do not use the System. <br>
            This System is designed for BPC students, faculty, and administrators to manage class schedules efficiently.</p>
            
            <h3>2. User Responsibilities</h3>
            <p>By using the System, you agree to:</p>
            <ul>
                <li>• Provide accurate and up-to-date information.</li>
                <li>• Not share your login credentials with others.</li>
                <li>• Use the System only for lawful and school-related purposes.</li>
                <li>• Not attempt to disrupt, hack, or misuse the System.</li>
                <li>• Comply with all school policies and applicable laws.</li>
            </ul>
            
            <h3>3. System Availability</h3>
            <p>The System is provided "as is" without warranties.<br>
            The school is not liable for any scheduling conflicts or technical issues.<br>
            Maintenance or outages may occur without prior notice.</p>

            <h3>The school may update this Agreement. Users will be notified of significant changes. Continued use implies acceptance.</h3>
            <p>For questions or concerns, contact: <br>
            BPC Faculty Head Sir Paulo Victoria / BSIS Department <br>
            (Email niya dito / Phone Number dito) <br> <br>

            By using the BPC Class Scheduling System, you acknowledge that you have read, understood, and agreed to this User Agreement and Privacy Policy.</p>
        `,
        privacyPolicy: `
            <h2>BPsync Privacy Policy</h2>
            <h3>1. Information We Collect</h3>
            <p>The System may collect and store:</p>
            <ul>
                <li>• Personal details (name, student ID, email)</li>
                <li>• Class schedules and course selections</li>
                <li>• Login credentials (securely stored)</li>
                <li>• Usage data</li>
            </ul>
            
            <h3>2. How We Use Your Data</h3>
            <p>Your information is used to:</p>
            <ul>
                <li>• Manage class schedules</li>
                <li>• Communicate important school updates</li>
                <li>• Improve the System's functionality</li>
                <li>• Ensure security and prevent misuse</li>
            </ul>
            
            <h3>3. Data Security</h3>
            <ul>
                <li>• Your data will only be accessible to authorized school staff.
                <li>• We do not sell or share your data with third parties unless required by law.
                <li>• Security measures (encryption, access controls) are in place to protect your data.
            </ul>

            <h3>4. Your Rights</h3>
            <p>You may request access to or correction of your data. <br>
            Account deletion requests must go through school administration.</p> <br>

            <p>By using the BPC Class Scheduling System, you acknowledge that you have read, understood, and agreed to this User Agreement and Privacy Policy.</p>
            `
    };

    policyLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const policyType = link.textContent.includes('User Agreement') ? 'userAgreement' : 'privacyPolicy';
            policyContent.innerHTML = policies[policyType];
            modal.style.display = 'flex';
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});


function showPass(event) {
    const eyeIcon = event.currentTarget;
    const passwordField = document.getElementById('password');

    if (passwordField.type === 'password') {
        passwordField.type = 'text';
    } else {
        passwordField.type = 'password';
    }
    eyeIcon.classList.toggle('fa-eye');
    eyeIcon.classList.toggle('fa-eye-slash');
}

document.querySelectorAll('.fa-eye, .fa-eye-slash').forEach(icon => {
    icon.addEventListener('click', showPass);
});

var attempts = 3;
var usernameIdArray = ["SuperAdminMIS", "VPAA", "AdminStaff"];
var usernameArray = ["SuperAdminMIS", "VPAA", "AdminStaff"];
var passwordArray = ["@bpconlypass01", "@bpconlypass01", "@bpconlypass01"];
var valid = false;

function validate() {
    var user = document.login.username.value;
    var password = document.login.password.value;

    if (user === '' || password === '') {
        alert('Please fill in the form.');
    }
    else {
        for (var i = 0; i < usernameArray.length; i++) {
            if (user == usernameArray[i] && password == passwordArray[i]) {
                valid = true;
                break;
            }
            else {
                valid = false;
                break
            }
        }
        for (var i = 0; i < usernameIdArray.length; i++) {
            if (user == usernameIdArray[i] && password == passwordArray[i]) {
                valid = true;
                break;
            }
            else {
                valid = false;
            }
        }
        if (valid == true && attempts > 0) {
            let code = Math.floor(Math.random() * 899999) + 100000;
            let codeAttempt = prompt('Enter this 6 digit authentication code to continue: ' + code);
            if (codeAttempt == code) {
                alert("Login Successful");
                window.location.href = "bpsync.html";
                return false;
            }
            else {
                alert('Wrong code try again.');
            }
        }
        if (valid == false) {
            if (attempts >= 1) {
                attempts--;
                alert("Wrong Username or Password. Attempts Left: " + attempts);
            }
            else if (attempts == 0) {
                alert("Sorry, You have ran out of attempts");
            }
        }
        if (valid == true && attempts == 0) {
            alert("Sorry, You have ran out of attempts.\nTry to come back later");
        }
    }
}

function signup() {
    var newUser = document.register.username.value;
    var newUserId = document.register.id.value;
    var newPass = document.register.password.value;
    var confirmPass = document.register.confirmPassword.value;
    var validUser = false;
    var numReq = /.[0,1,2,3,4,5,6,7,8,9]/;
    var spcReq = /.[!,@,#,$,%,^,&,*,?,_,-,~,]/;

    if (newUser === '' || newPass === '' || newUserId === '') {
        alert('Please fill in the form.');
    }
    else if (newPass.match(numReq) && newPass.match(spcReq)) {
        if (newPass == confirmPass) {
            for (var i = 0; i < usernameArray.length; i++) {
                if (newUser == usernameArray[i]) {
                    validUser = false;
                    break;
                }
                else {
                    validUser = true;
                    break;
                }
            }
            if (validUser == false) {
                alert('Username or Email already exists please choose a new one.');
            }
            else {
                usernameArray.push(newUser);
                passwordArray.push(newPass);
                usernameIdArray.push(newUserId);
                alert('You have registered successfully!');
            }
        }
        else {
            alert('Password does not match. Please try again');
        }
    }
    else {
        alert('Password too weak! Password should consist of atleast a number and a special character.');
    }
}