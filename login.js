const tabs = document.querySelectorAll('[data-tab-target]');
const tabContents = document.querySelectorAll('[data-tab-content]');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = document.querySelector(tab.dataset.tabTarget);
        tabContents.forEach(tabContent => {
            tabContent.classList.remove('active');
        });
        target.classList.add('active');
    });
});

function showPass() {
    let pass = document.getElementById("password");

    if (pass.type == "password") {
        pass.type = "text";
    }
    else {
        pass.type = "password";
    }
}

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
    var newUserId= document.register.id.value; 
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