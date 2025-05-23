document.addEventListener('DOMContentLoaded', function () {
    updateUserDisplay();
    const tabs = document.querySelectorAll('[data-tab-target]');
    const tabContents = document.querySelectorAll('[data-tab-content]');

    tabs.forEach(tab => {
        tab.addEventListener('click', (event) => {
            const target = document.querySelector(tab.dataset.tabTarget);

            tabContents.forEach(tabContent => {
                tabContent.classList.remove('active');
            });

            target.classList.add('active');

            if (tab.classList.contains('button')) {
                event.preventDefault();
            }
        });
    });

    // SIDEBAR 
    const settingSidebar = document.getElementById('settingSidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    const logoutBtn = document.getElementById('logoutBtn');
    const SettingIconBtn = document.getElementById('settingIcon');
    const openImportOverlayBtn = document.getElementById('openImportOverlay');
    const importOverlay = document.getElementById('importOverlay');
    const closeImportOverlay = document.getElementById('closeImportOverlay');

    if (SettingIconBtn) {
        SettingIconBtn.addEventListener('click', function () {
            settingSidebar.classList.toggle('active');
        });
    }

    if (closeSidebar) {
        closeSidebar.addEventListener('click', function () {
            settingSidebar.classList.remove('active');
        });
    }

    if (openImportOverlayBtn && importOverlay) {
        openImportOverlayBtn.addEventListener('click', function () {
            importOverlay.classList.add('active');
        });
    }
    if (closeImportOverlay && importOverlay) {
        closeImportOverlay.addEventListener('click', function () {
            importOverlay.classList.remove('active');
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            localStorage.setItem('isLoggedIn', 'false');
            alert('Logged out successfully');
            window.location.href = 'index.html';
        });
    }
    const notificationSwitch = document.getElementById('switch-notification');
    if (notificationSwitch) {
        notificationSwitch.addEventListener('change', function () {
            if (this.checked) {
                if (Notification.permission !== 'granted') {
                    Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                            new Notification('Notifications enabled', {
                                body: 'You will now receive notifications from BPsync'
                            });
                        }
                    });
                }
            }
        });
    }

    const fileInputs = {
        facultyCsv: document.getElementById('facultyCsv'),
        sectionCsv: document.getElementById('sectionCsv'),
        roomCsv: document.getElementById('roomCsv'),
        subjectCsv: document.getElementById('subjectCsv')
    };

    Object.keys(fileInputs).forEach(key => {
        if (fileInputs[key]) {
            fileInputs[key].addEventListener('change', function (e) {
                if (this.files.length > 0) {
                    alert(`File selected for import: ${this.files[0].name}`);
                    // example: parseCSV(this.files[0]);
                }
            });
        }
    });
});

// 2. Faculty Management
function showFacultyForm() {
    // Ipakita ang overlay para magdagdag ng faculty
    document.getElementById('facultyOverlay').style.display = 'flex';
}

function hideFacultyForm() {
    document.getElementById('facultyOverlay').style.display = 'none';
}

function addFaculty() {
    const name = document.getElementById('facultyName').value.trim();
    const head = document.getElementById('facultyHead').value.trim();
    const isFullTime = document.getElementById('fullTime').checked;
    const isAM = document.getElementById('amShift').checked;
    const isPM = document.getElementById('pmShift').checked;

    // Validation
    if (!name || !head) {
        alert('Please fill up faculty name and head');
        return;
    }


    if (!isFullTime && !isAM && !isPM) {
        alert('Please select a shift (AM or PM) for part-time faculty');
        return;
    }

    // eto gagawa ng faculty object
    const faculty = {
        name,
        head,
        type: isFullTime ? 'Full Time' : 'Part Time',
        shift: isFullTime ? 'AM/PM' : (isAM ? 'AM' : 'PM'),
        id: Date.now().toString()
    };

    // didisplay sa  UI at i-save sa localStorage
    addFacultyToUI(faculty);
    saveFacultyToStorage(faculty);
    clearFacultyForm();
    hideFacultyForm();
}

function addFacultyToUI(faculty) {
    const facultyItem = document.createElement('div');
    facultyItem.className = 'faculty-item';
    facultyItem.dataset.id = faculty.id;
    facultyItem.innerHTML = `
        <span class="fac-name"> • ${faculty.name} </span><br>
        <span class="fac-head">• Faculty Head: ${faculty.head} </span><br>
        <span class="shift">${faculty.type} (${faculty.shift})</span>
        <div class="item-actions">
            <button class="edit-btn" onclick="editFaculty(this)"><i class="fas fa-edit"></i></button>
            <button class="remove-btn" onclick="removeItem(this)"><i class="fas fa-trash"></i></button>
        </div>
    `;
    document.getElementById('facultyList').appendChild(facultyItem);
}

function saveFacultyToStorage(faculty) {
    // kukunin neto yung currently na listahan ng faculty then dadagdag yung bago then boom ise-save
    const faculties = JSON.parse(localStorage.getItem('faculties')) || [];
    faculties.push(faculty);
    localStorage.setItem('faculties', JSON.stringify(faculties));
}

function clearFacultyForm() {
    document.getElementById('facultyName').value = '';
    document.getElementById('facultyHead').value = '';
    document.getElementById('fullTime').checked = false;
    document.getElementById('partTime').checked = false;
    document.getElementById('amShift').checked = false;
    document.getElementById('pmShift').checked = false;
    document.getElementById('amShift').disabled = false;
    document.getElementById('pmShift').disabled = false;
    document.getElementById('shiftGroup').style.opacity = '1';
}

function editFaculty(button) {
    const item = button.closest('.faculty-item');
    const id = item.dataset.id;
    const name = item.querySelector('.fac-name').textContent.replace('•', '').trim();
    const head = item.querySelector('.fac-head').textContent.replace('• Faculty Head:', '').trim();
    const shiftText = item.querySelector('.shift').textContent;

    const isFullTime = shiftText.includes('Full Time');
    const isAM = shiftText.includes('AM');
    const isPM = shiftText.includes('PM');

    document.getElementById('facultyName').value = name;
    document.getElementById('facultyHead').value = head;

    if (isFullTime) {
        document.getElementById('fullTime').checked = true;
        document.getElementById('amShift').checked = true;
        document.getElementById('pmShift').checked = true;
        document.getElementById('amShift').disabled = true;
        document.getElementById('pmShift').disabled = true;
        document.getElementById('shiftGroup').style.opacity = '0.7';
    } else {
        document.getElementById('partTime').checked = true;
        document.getElementById('amShift').checked = isAM;
        document.getElementById('pmShift').checked = isPM;
        document.getElementById('amShift').disabled = false;
        document.getElementById('pmShift').disabled = false;
        document.getElementById('shiftGroup').style.opacity = '1';
    }

    item.remove();
    removeFacultyFromStorage(id);
    
    showFacultyForm();
}

function removeFacultyFromStorage(id) {
    // eto taga remove ng faculty sa localStorage gamit id nila muwahahahahha
    const faculties = JSON.parse(localStorage.getItem('faculties')) || [];
    const updatedFaculties = faculties.filter(faculty => faculty.id !== id);
    localStorage.setItem('faculties', JSON.stringify(updatedFaculties));
}



// 3. Section Management
function showSectionForm() {
    document.getElementById('sectionOverlay').style.display = 'flex';
}

function hideSectionForm() {
    document.getElementById('sectionOverlay').style.display = 'none';
}

function addSection() {
    const name = document.getElementById('sectionName').value.trim();
    const adviser = document.getElementById('adviserName').value.trim();

    if (!name || !adviser) {
        alert('Please enter both section name and adviser name');
        return;
    }

    // eto ano uhm create section object
    const section = {
        name,
        adviser,
        id: Date.now().toString()
    };

    // eto call nanaman
    addSectionToUI(section);
    saveSectionToStorage(section);m
    clearSectionForm();
    hideSectionForm();
}

function addSectionToUI(section) {
    const sectionItem = document.createElement('div');
    sectionItem.className = 'section-item';
    sectionItem.dataset.id = section.id;
    sectionItem.innerHTML = `
        <span class="fac-name">• ${section.name} </span><br>
        <span class="fac-head">• Section adviser: ${section.adviser}</span>
        <div class="item-actions">
            <button class="edit-btn" onclick="editSection(this)"><i class="fas fa-edit"></i></button>
            <button class="remove-btn" onclick="removeItem(this)"><i class="fas fa-trash"></i></button>
        </div>
    `;
    document.getElementById('sectionList').appendChild(sectionItem);
}

function saveSectionToStorage(section) {
    const sections = JSON.parse(localStorage.getItem('sections')) || [];
    sections.push(section);
    localStorage.setItem('sections', JSON.stringify(sections));
}

function clearSectionForm() {
    document.getElementById('sectionName').value = '';
    document.getElementById('adviserName').value = '';
}

function editSection(button) {
    const item = button.closest('.section-item');
    const id = item.dataset.id;
    const name = item.querySelector('.fac-name').textContent.replace('•', '').trim();
    const adviser = item.querySelector('.fac-head').textContent.replace('• Section adviser:', '').trim();

  
    document.getElementById('sectionName').value = name;
    document.getElementById('adviserName').value = adviser;

 
    item.remove();
    removeSectionFromStorage(id);
    
    showSectionForm();
}

function removeSectionFromStorage(id) {
    const sections = JSON.parse(localStorage.getItem('sections')) || [];
    const updatedSections = sections.filter(section => section.id !== id);
    localStorage.setItem('sections', JSON.stringify(updatedSections));
}




// 4. Room Management
function showRoomForm() {
    document.getElementById('roomOverlay').style.display = 'flex';
}

function hideRoomForm() {
    document.getElementById('roomOverlay').style.display = 'none';
}

function addRoom() {
    const name = document.getElementById('roomName').value.trim();

    if (!name) {
        alert('Please enter room name');
        return;
    }

    // create nanaman ng room object
    const room = {
        name,
        id: Date.now().toString()
    };


    addRoomToUI(room);
    saveRoomToStorage(room);
    clearRoomForm();
    hideRoomForm();
}

function addRoomToUI(room) {
    const roomItem = document.createElement('div');
    roomItem.className = 'room-item';
    roomItem.dataset.id = room.id;
    roomItem.innerHTML = `
        <span class="fac-name"> • ${room.name} </span>
        <div class="item-actions">
            <button class="edit-btn" onclick="editRoom(this)"><i class="fas fa-edit"></i></button>
            <button class="remove-btn" onclick="removeItem(this)"><i class="fas fa-trash"></i></button>
        </div>
    `;
    document.getElementById('roomList').appendChild(roomItem);
}

function saveRoomToStorage(room) {
    const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
    rooms.push(room);
    localStorage.setItem('rooms', JSON.stringify(rooms));
}

function clearRoomForm() {
    document.getElementById('roomName').value = '';
}

function editRoom(button) {
    const item = button.closest('.room-item');
    const id = item.dataset.id;
    const name = item.querySelector('.fac-name').textContent.replace('•', '').trim();


    document.getElementById('roomName').value = name;
    item.remove();
    removeRoomFromStorage(id);    
    showRoomForm();
}

function removeRoomFromStorage(id) {
    const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
    const updatedRooms = rooms.filter(room => room.id !== id);
    localStorage.setItem('rooms', JSON.stringify(updatedRooms));
}




// 6. remub aytem
function removeItem(button) {
    if (confirm('Are you sure you want to remove this item?')) {
        const item = button.closest('.faculty-item, .section-item, .room-item, .subject-item');
        const id = item.dataset.id;
        
        if (item.classList.contains('faculty-item')) {
            removeFacultyFromStorage(id);
        } else if (item.classList.contains('section-item')) {
            removeSectionFromStorage(id);
        } else if (item.classList.contains('room-item')) {
            removeRoomFromStorage(id);
        } else if (item.classList.contains('subject-item')) {
            const code = item.querySelector('.subj-code').textContent.replace('•', '').trim();
            removeSubjectFromStorage(code);
        }
        
        item.remove();
    }
}

// 7. deyta lowding
document.addEventListener('DOMContentLoaded', function() {
    // Load faculties
    const faculties = JSON.parse(localStorage.getItem('faculties')) || [];
    faculties.forEach(faculty => addFacultyToUI(faculty));
    
    // Load sections
    const sections = JSON.parse(localStorage.getItem('sections')) || [];
    sections.forEach(section => addSectionToUI(section));
    
    // Load rooms
    const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
    rooms.forEach(room => addRoomToUI(room));
    
    // Load subjects 
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    subjects.forEach(subject => addSubjectToUI(subject));
});



// 8. Employment Type & Shift
function handleShiftSelection(selectedShift) {
    const isFullTime = document.getElementById('fullTime').checked;
    if (isFullTime) return;
    const amCheckbox = document.getElementById('amShift');
    const pmCheckbox = document.getElementById('pmShift');

    if (selectedShift === 'amShift') {
        if (amCheckbox.checked) {
            pmCheckbox.checked = false;
        }
    } else {
        if (pmCheckbox.checked) {
            amCheckbox.checked = false;
        }
    }
}

function handleEmploymentTypeChange() {
    const isFullTime = document.getElementById('fullTime').checked;
    const amCheckbox = document.getElementById('amShift');
    const pmCheckbox = document.getElementById('pmShift');
    const shiftGroup = document.getElementById('shiftGroup');

    if (isFullTime) {
        amCheckbox.checked = true;
        pmCheckbox.checked = true;
        amCheckbox.disabled = true;
        pmCheckbox.disabled = true;
        shiftGroup.style.opacity = '0.7';
    } else {
        amCheckbox.checked = false;
        pmCheckbox.checked = false;
        amCheckbox.disabled = false;
        pmCheckbox.disabled = false;
        shiftGroup.style.opacity = '1';
    }
}

// 9. Dark Mode (DARK MODE SHEESHHH)
const darkModeToggle = document.getElementById('switch-light-dark');

if (localStorage.getItem('darkMode') === 'enabled') {
    enableDarkMode();
    darkModeToggle.checked = true;
}


darkModeToggle.addEventListener('change', () => {
    if (darkModeToggle.checked) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
});

function enableDarkMode() {
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'enabled');
}

function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'disabled');
}


if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('darkMode')) {
    enableDarkMode();
    darkModeToggle.checked = true;
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('darkMode')) {
        if (e.matches) {
            enableDarkMode();
            darkModeToggle.checked = true;
        } else {
            disableDarkMode();
            darkModeToggle.checked = false;
        }
    }
});

// 10. Profile Management
// Profile Popup 
const profilePopupOne = document.getElementById('profilePopupOne');
profilePopupOne.style.display = 'none';

function openProfile() {
    if (profilePopupOne.style.display == 'none') {
        profilePopupOne.style.display = 'block';
    }
}

function closePopup() {
    profilePopupOne.style.display = 'none';
}


const deleteAcc = document.getElementById('deleteAcc');
const deletePopup = document.getElementById('deletePopup');
const closeDelete = document.getElementById('closeDelete');
const permanentlyDelete = document.getElementById('permanentlyDelete');
const cancelDelete = document.getElementById('cancelDelete');
deletePopup.style.display = "none";

deleteAcc.addEventListener('click', function () {
    deletePopup.style.display = "block";
});

closeDelete.addEventListener('click', function () {
    deletePopup.style.display = "none";
});

permanentlyDelete.addEventListener('click', function () {
    alert('BYE BYE');
    localStorage.setItem('isLoggedIn', 'false');
    // here yung code ng delete account
    window.location.href = 'index.html';
});

cancelDelete.addEventListener('click', function () {
    alert('Account not deleted.');
    deletePopup.style.display = "none";
});

// mata profile 
const newPass = document.getElementById('password');
const confirmPass = document.getElementById('confirmPassword');
const eyeIcon = document.getElementById('eyeIcon');
const eyeIcon2 = document.getElementById('eyeIcon2');

function showPass() {
    if (newPass.type == 'password') {
        newPass.type = 'text';
    }
    else {
        newPass.type = 'password';
    }
    eyeIcon.classList.toggle('fa-eye');
    eyeIcon.classList.toggle('fa-eye-slash');
}

function showConfirmPass() {
    if (confirmPass.type == 'password') {
        confirmPass.type = 'text';
    }
    else {
        confirmPass.type = 'password';
    }
    eyeIcon2.classList.toggle('fa-eye');
    eyeIcon2.classList.toggle('fa-eye-slash');
}

// profile pic 
const profilePic = document.getElementById('profilePic');
profilePic.addEventListener('click', function () {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.addEventListener('change', function () {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profilePic.src = e.target.result;
            };
            reader.readAsDataURL(this.files[0]);
        }
    });

    fileInput.click();
});

// medyo working na save data for user login and signup 
document.querySelector('[data-tab-target="#profileTab"]').addEventListener('click', function () {
    const currentUser = localStorage.getItem('currentUser') || 'User';
    const userEmail = localStorage.getItem('userEmail') || 'No email registered';
    const userId = localStorage.getItem('userId') || 'No ID';
    const userRole = localStorage.getItem('userRole');

    document.getElementById('username').textContent = currentUser;
    document.getElementById('emailDisplay').textContent = userEmail;
    document.getElementById('idDisplay').textContent = `ID: ${userId}`;
    document.getElementById('email').value = userEmail;

    // pwede din naman lagyan ng admin ng role: Student / Teacher
    const roleElement = document.getElementById('role');
    if (userRole) {
        roleElement.textContent = userRole;
        roleElement.style.display = 'block';
    } else {
        roleElement.style.display = 'none';
    }

    document.getElementById('name').value = currentUser;

    document.getElementById('currentUser').textContent = currentUser;
});

document.querySelector('[data-tab-target="#profileTab"]').addEventListener('click', updateUserDisplay);

const editProfile = document.getElementById('editProfile');
editProfile.addEventListener('submit', function (e) {
    e.preventDefault();
    const newPassword = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const newName = document.getElementById('name').value;
    const newEmail = document.getElementById('email').value;

    if (!newEmail.includes('@')) {
        alert('Please enter a valid email address');
        return;
    }
    if (!newEmail.includes('bpc.edu.ph')) {
        alert('Please use the official bpc email');
        return;
    }

    else if (newPassword && newPassword !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    localStorage.setItem('currentUser', newName || newEmail.split('@')[0]);
    localStorage.setItem('userEmail', newEmail);

    if (newPassword && confirmPassword && newPassword === confirmPassword) {
        // leave ko to blank, database to backend
         alert('Your Password has been changed successfully.')
    }

    updateUserDisplay();
    alert('Profile updated successfully!');
});

function updateUserDisplay() {
    const currentUser = localStorage.getItem('currentUser') || 'User';
    const userEmail = localStorage.getItem('userEmail') || 'No email registered';
    const userId = localStorage.getItem('userId') || 'No ID';
    const userRole = localStorage.getItem('userRole');

    document.getElementById('username').textContent = currentUser;
    document.getElementById('emailDisplay').textContent = userEmail;
    document.getElementById('idDisplay').textContent = `ID: ${userId}`;
    document.getElementById('email').value = userEmail;

    const roleElement = document.getElementById('role');
    if (userRole) {
        roleElement.textContent = userRole;
        roleElement.style.display = 'block';
    } else {
        roleElement.style.display = 'none';
    }

    document.getElementById('name').value = currentUser;
    document.getElementById('currentUser').textContent = currentUser;
}

// 11. CSV Import
function parseCSV(file, type) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const content = e.target.result;
                const lines = content.split('\n').filter(line => line.trim() !== '');
                
                if (lines.length < 2) {
                    throw new Error('CSV file is empty or has no data rows');
                }
                
                const headers = lines[0].split(',').map(h => h.trim());
                const data = [];
                
                for (let i = 1; i < lines.length; i++) {
                    const values = lines[i].split(',');
                    const item = {};
                    
                    for (let j = 0; j < headers.length; j++) {
                        if (j < values.length) {
                            item[headers[j]] = values[j].trim();
                        }
                    }
                    
                    data.push(item);
                }
                
                
                const processedData = processImportedData(data, type);
                resolve(processedData);
            } catch (error) {
                reject(error);
            }
        };
        
        reader.onerror = function() {
            reject(new Error('Error reading file'));
        };
        
        reader.readAsText(file);
    });
}

function processImportedData(data, type) {
    switch (type) {
        case 'faculty':
            return data.map(item => ({
                name: item.Name || item.name || '',
                head: item.Head || item.head || item.Department || '',
                type: item.Type || item.type || 'Part Time',
                shift: item.Shift || item.shift || (item.Type === 'Full Time' ? 'AM/PM' : 'PM'),
                id: Date.now().toString() + Math.floor(Math.random() * 1000)
            }));
            
        case 'section':
            return data.map(item => ({
                name: item.Name || item.name || item.Section || '',
                adviser: item.Adviser || item.adviser || '',
                id: Date.now().toString() + Math.floor(Math.random() * 1000)
            }));
            
        case 'room':
            return data.map(item => ({
                name: item.Name || item.name || item.Room || '',
                id: Date.now().toString() + Math.floor(Math.random() * 1000)
            }));
            
        case 'subject':
            return data.map(item => {
                // Normalize semester values
                let semester = item.Semester || item.semester || '1';
                semester = semester.toString().includes('1') ? 'firstSemester' : 'secondSemester';
                
                return {
                    code: item.Code || item.code || '',
                    name: item.Name || item.name || '',
                    course: item.Course || item.course || 'BSIS',
                    year: item.Year || item.year || '1',
                    semester: semester,
                    hours: item.Hours || item.hours || '3'
                };
            });
            
        default:
            throw new Error('Unknown import type');
    }
}

document.addEventListener('DOMContentLoaded', function () {

    const fileInputs = {
        facultyCsv: document.getElementById('facultyCsv'),
        sectionCsv: document.getElementById('sectionCsv'),
        roomCsv: document.getElementById('roomCsv'),
        subjectCsv: document.getElementById('subjectCsv')
    };

    Object.keys(fileInputs).forEach(key => {
        if (fileInputs[key]) {
            fileInputs[key].addEventListener('change', function (e) {
                if (this.files.length > 0) {
                    const type = key.replace('Csv', '');
                    importCSVData(this.files[0], type);
                }
            });
        }
    });
});

// Main import function
async function importCSVData(file, type) {
    try {

        const importButton = document.querySelector(`.${type}-import button`);
        if (importButton) {
            importButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Importing...';
            importButton.disabled = true;
        }
        
        // Parse CSV
        const importedData = await parseCSV(file, type);
        
        // Validate data
        if (importedData.length === 0) {
            throw new Error('No valid data found in CSV');
        }
        
        // Process and save data
        switch (type) {
            case 'faculty':
                importedData.forEach(faculty => {
                    addFacultyToUI(faculty);
                    saveFacultyToStorage(faculty);
                });
                break;
                
            case 'section':
                importedData.forEach(section => {
                    addSectionToUI(section);
                    saveSectionToStorage(section);
                });
                break;
                
            case 'room':
                importedData.forEach(room => {
                    addRoomToUI(room);
                    saveRoomToStorage(room);
                });
                break;
                
            case 'subject':
                importedData.forEach(subject => {
                    addSubjectToUI(subject);
                    saveSubjectToStorage(subject);
                });
                break;
        }
        
        alert(`Successfully imported ${importedData.length} ${type} records`);
        
    } catch (error) {
        console.error(`Error importing ${type}:`, error);
        alert(`Error importing ${type}: ${error.message}`);
    } finally {
        // Reset button state
        const importButton = document.querySelector(`.${type}-import button`);
        if (importButton) {
            importButton.innerHTML = type.charAt(0).toUpperCase() + type.slice(1);
            if (type === 'room') {
                importButton.innerHTML += '<br>Facility';
            }
            importButton.disabled = false;
        }
        
        // Reset file input
        const fileInput = document.getElementById(`${type}Csv`);
        if (fileInput) {
            fileInput.value = '';
        }
    }
}

// 12. Monitor Rooms
function updateMonitorRooms() {
    const allRooms = JSON.parse(localStorage.getItem('rooms')) || [];
    const schedules = JSON.parse(localStorage.getItem('schedules')) || [];
    const now = new Date();
    const currentDay = now.toLocaleString('en-US', { weekday: 'long' });

    // ETO HAHANAP NG MGA IN USE NA ROOMS YES THATS RIGHT
    const inUseRooms = new Set();
    schedules.forEach(sched => {
        sched.schedule.forEach(item => {
            // basically "ngayon ba yon?""
            if (item.day === currentDay) {
                inUseRooms.add(item.room);
            }
        });
    });

    // Prepare containers
    const allContainer = document.querySelector('#monitorTab #All');
    const availableContainer = document.querySelector('#monitorTab #Available');
    const unavailableContainer = document.querySelector('#monitorTab #Unavailable');

    // Clear containers
    allContainer.innerHTML = '';
    availableContainer.innerHTML = '';
    unavailableContainer.innerHTML = '';

    allRooms.forEach((room, idx) => {
        // Room box element
        const roomBox = document.createElement('div');
        roomBox.className = 'room-box';
        roomBox.innerHTML = `<h1 class="roomNumber">${room.name}</h1>`;

        // Add to All Rooms
        allContainer.appendChild(roomBox.cloneNode(true));

        // Add to Available or Unavailable
        if (inUseRooms.has(room.name)) {
            const unavailableBox = roomBox.cloneNode(true);
            unavailableBox.classList.add('unavailable');
            unavailableContainer.appendChild(unavailableBox);
        } else {
            const availableBox = roomBox.cloneNode(true);
            availableBox.classList.add('available');
            availableContainer.appendChild(availableBox);
        }
    });

    if (allRooms.length === 0) {
        allContainer.innerHTML = '<div style="padding:20px;text-align:center;">No rooms found.</div>';
        availableContainer.innerHTML = '';
        unavailableContainer.innerHTML = '';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const monitorTabBtn = document.querySelector('[data-tab-target="#monitorTab"]');
    if (monitorTabBtn) {
        monitorTabBtn.addEventListener('click', updateMonitorRooms);
    }
    if (document.getElementById('monitorTab').classList.contains('active')) {
        updateMonitorRooms();
    }
});
