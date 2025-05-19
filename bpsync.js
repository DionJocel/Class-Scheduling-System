document.addEventListener('DOMContentLoaded', function () {
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



// Update Data !!!

function showFacultyForm() {
    document.getElementById('facultyOverlay').style.display = 'flex';
}

function hideFacultyForm() {
    document.getElementById('facultyOverlay').style.display = 'none';
}

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

function addFaculty() {
    const name = document.getElementById('facultyName').value;
    const head = document.getElementById('facultyHead').value;
    const isFullTime = document.getElementById('fullTime').checked;
    const isAM = document.getElementById('amShift').checked;
    const isPM = document.getElementById('pmShift').checked;

    if (!name || !head) {
        alert('Please fill up faculty name and head');
        return;
    }

    if (!isFullTime && !isAM && !isPM) {
        alert('Please select a shift (AM or PM) for part-time faculty');
        return;
    }

    let type = isFullTime ? 'Full Time' : 'Part Time';
    let shift = isFullTime ? 'AM/PM' : (isAM ? 'AM' : 'PM');

    const facultyList = document.getElementById('facultyList');
    const facultyItem = document.createElement('div');
    facultyItem.className = 'faculty-item';
    facultyItem.innerHTML = `
                <span class="fac-name"> • ${name} </span><br>
                <span class="fac-head">• Faculty Head: ${head} </span><br>
                <span class="shift">${type} (${shift})</span>
                <div class="item-actions">
                    <button class="edit-btn" onclick="editFaculty(this)"><i class="fas fa-edit"></i></button>
                    <button class="remove-btn" onclick="removeItem(this)"><i class="fas fa-trash"></i></button>
                </div>
            `;
    facultyList.appendChild(facultyItem);

    document.getElementById('facultyName').value = '';
    document.getElementById('facultyHead').value = '';
    document.getElementById('fullTime').checked = false;
    document.getElementById('partTime').checked = false;
    document.getElementById('amShift').checked = false;
    document.getElementById('pmShift').checked = false;
    document.getElementById('amShift').disabled = false;
    document.getElementById('pmShift').disabled = false;
    document.getElementById('shiftGroup').style.opacity = '1';

    hideFacultyForm();
}

function editFaculty(button) {
    const item = button.closest('.faculty-item');
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
    showFacultyForm();
}

function showSectionForm() {
    document.getElementById('sectionOverlay').style.display = 'flex';
}

function hideSectionForm() {
    document.getElementById('sectionOverlay').style.display = 'none';
}

function addSection() {
    const name = document.getElementById('sectionName').value;
    const adviser = document.getElementById('adviserName').value;

    if (!name || !adviser) {
        alert('Please enter both section name and adviser name');
        return;
    }

    const sectionList = document.getElementById('sectionList');
    const sectionItem = document.createElement('div');
    sectionItem.className = 'section-item';
    sectionItem.innerHTML = `
                <span class="fac-name">• ${name} </span><br>
                <span class="fac-head">• Section adviser: ${adviser}</span>
                <div class="item-actions">
                    <button class="edit-btn" onclick="editSection(this)"><i class="fas fa-edit"></i></button>
                    <button class="remove-btn" onclick="removeItem(this)"><i class="fas fa-trash"></i></button>
                </div>
            `;
    sectionList.appendChild(sectionItem);

    document.getElementById('sectionName').value = '';
    document.getElementById('adviserName').value = '';
    hideSectionForm();
}

function editSection(button) {
    const item = button.closest('.section-item');
    const name = item.querySelector('.fac-name').textContent.replace('•', '').trim();
    const adviser = item.querySelector('.fac-head').textContent.replace('• Section adviser:', '').trim();

    document.getElementById('sectionName').value = name;
    document.getElementById('adviserName').value = adviser;

    item.remove();
    showSectionForm();
}

function showRoomForm() {
    document.getElementById('roomOverlay').style.display = 'flex';
}

function hideRoomForm() {
    document.getElementById('roomOverlay').style.display = 'none';
}

function addRoom() {
    const name = document.getElementById('roomName').value;

    if (!name) {
        alert('Please enter room name');
        return;
    }

    const roomList = document.getElementById('roomList');
    const roomItem = document.createElement('div');
    roomItem.className = 'room-item';
    roomItem.innerHTML = `
                <span class="fac-name"> • ${name} </span>
                <div class="item-actions">
                    <button class="edit-btn" onclick="editRoom(this)"><i class="fas fa-edit"></i></button>
                    <button class="remove-btn" onclick="removeItem(this)"><i class="fas fa-trash"></i></button>
                </div>
            `;
    roomList.appendChild(roomItem);

    document.getElementById('roomName').value = '';
    hideRoomForm();
}

function editRoom(button) {
    const item = button.closest('.room-item');
    const name = item.querySelector('.fac-name').textContent.replace('•', '').trim();

    document.getElementById('roomName').value = name;

    item.remove();
    showRoomForm();
}

function removeItem(button) {
    if (confirm('Are you sure you want to remove this item?')) {
        const item = button.closest('.faculty-item, .section-item, .room-item');
        item.remove();
    }
}

window.onclick = function (event) {
    if (event.target.className === 'overlay') {
        document.querySelectorAll('.overlay').forEach(overlay => {
            overlay.style.display = 'none';
        });
    }
}

// DARK MODE SHEESH 

const darkModeToggle = document.getElementById('switch-light-dark');

// check localstorage saved user preference
if (localStorage.getItem('darkMode') === 'enabled') {
    enableDarkMode();
    darkModeToggle.checked = true;
}

// mismong toggle dark mode function
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

// optional lang to for system preference detection
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

