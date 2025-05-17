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
    sectionItem.innerHTML = `
    <span class="fac-name">• ${name} </span><br>
    <span class="fac-head">• Section adviser: ${adviser}</span>`;
    sectionList.appendChild(sectionItem);

    document.getElementById('sectionName').value = '';
    document.getElementById('adviserName').value = '';
    hideSectionForm();
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
    roomItem.innerHTML = `<span class="fac-name"> • ${name} </span>`;
    roomList.appendChild(roomItem);

    document.getElementById('roomName').value = '';
    hideRoomForm();
}

window.onclick = function (event) {
    if (event.target.className === 'overlay') {
        document.querySelectorAll('.overlay').forEach(overlay => {
            overlay.style.display = 'none';
        });
    }
}