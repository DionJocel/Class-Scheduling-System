const WORKING_HOURS = {
    AM: { start: 7, end: 12 },
    PM: { start: 13, end: 20 }
};
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS = [
    '8:00 AM - 9:00 AM', '9:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM',
    '1:00 PM - 2:00 PM', '2:00 PM - 3:00 PM', '3:00 PM - 4:00 PM', '4:00 PM - 5:00 PM', '5:00 PM - 6:00 PM',
    '6:00 PM - 7:00 PM', '7:00 PM - 8:00 PM'
];

// 2. Semester/Preview Handlers
function handleSemesterSelection(selectedSemester) {
    const firstSem = document.getElementById("firstSemester");
    const secondSem = document.getElementById("secondSemester");
    if (selectedSemester === 'firstSemester') {
        if (firstSem.checked) secondSem.checked = false;
    } else if (selectedSemester === 'secondSemester') {
        if (secondSem.checked) firstSem.checked = false;
    }
    updatePreview();
}

function updatePreview() {
    const semesterInput = document.querySelector('input[name="semester"]:checked');
    const yearValue = document.getElementById("yrSemester").value;
    const course = document.getElementById("course").value;
    const section = document.getElementById("chooseSection").value;
    if (semesterInput) {
        document.getElementById("previewSemester").textContent =
            semesterInput.id === "firstSemester" ? "First Semester" : "Second Semester";
    }
    if (course && yearValue && section) {
        let yearNumber;
        switch (yearValue) {
            case "firstYear": yearNumber = 1; break;
            case "secondYear": yearNumber = 2; break;
            case "thirdYear": yearNumber = 3; break;
            case "fourthYear": yearNumber = 4; break;
            default: yearNumber = ""; break;
        }
        document.getElementById("previewCourseYearSection").textContent =
            `${course}${yearNumber}${section}`;
    }
    // acad year
    const currentYear = new Date().getFullYear();
    document.getElementById("previewAcademicYear").textContent = `${currentYear}-${currentYear + 1}`;
}

// 3. Schedule Generation & Display
function generateSchedules() {
    try {
        const semesterInput = document.querySelector('input[name="semester"]:checked');
        const yearValue = document.getElementById("yrSemester").value;
        const course = document.getElementById("course").value;
        const section = document.getElementById("chooseSection").value;

        if (!semesterInput) {
            alert("Please select a semester.");
            return;
        }

        let yearNumber;
        switch (yearValue) {
            case "firstYear": yearNumber = 1; break;
            case "secondYear": yearNumber = 2; break;
            case "thirdYear": yearNumber = 3; break;
            case "fourthYear": yearNumber = 4; break;
            default:
                alert("Please select a valid year.");
                return;
        }

        if (!course || !section) {
            alert("Please fill in all fields.");
            return;
        }

        const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
        const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
        const faculty = JSON.parse(localStorage.getItem('faculties')) || []; 
        const existingSchedules = JSON.parse(localStorage.getItem('schedules')) || [];

        const relevantSubjects = subjects.filter(subj => 
            subj.course === course && subj.year == yearNumber && subj.semester === semesterInput.id
        );

        if (relevantSubjects.length === 0) {
            alert("No subjects found for the selected course and year. Please add subjects first.");
            return;
        }

        if (rooms.length === 0) {
            alert("No rooms available. Please add rooms in the Update Data section.");
            return;
        }

        if (faculty.length === 0) {
            alert("No faculty available. Please add faculty in the Update Data section.");
            return;
        }

        // Generate conflict-free schedule
        const schedule = generateConflictFreeSchedule(
            relevantSubjects, 
            rooms, 
            faculty, 
            existingSchedules,
            `${course}${yearNumber}${section}`,
            semesterInput.id === "firstSemester" ? "First Semester" : "Second Semester"
        );

        displaySchedule(schedule, `${course}${yearNumber}${section}`, 
            semesterInput.id === "firstSemester" ? "First Semester" : "Second Semester",
            `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`
        );

        document.querySelector(".previewSchedule").style.display = "block";
    } catch (error) {
        console.error("Schedule generation error:", error);
        alert("Error generating schedule: " + error.message);
    }
}

function generateConflictFreeSchedule(subjects, rooms, faculty, existingSchedules, courseSection, semester) {
    const newSchedule = [];
    const usedTimes = {}; 
    
    DAYS.forEach(day => {
        usedTimes[day] = [];
    });


    function findAvailableSlot(subject, day) {
        const hoursNeeded = parseInt(subject.hours) || 3; 
        const availableSlots = [];
        
        // eto taga hanap ng time slots para ma accomodate ang mga subjects
        for (let i = 0; i < TIME_SLOTS.length - hoursNeeded + 1; i++) {
            let isAvailable = true;
            
        
            for (let j = 0; j < hoursNeeded; j++) {
                const slotIndex = i + j;
                if (slotIndex >= TIME_SLOTS.length || 
                    usedTimes[day].includes(TIME_SLOTS[slotIndex])) {
                    isAvailable = false;
                    break;
                }
            }
            
            if (isAvailable) {
                availableSlots.push(i);
            }
        }
        
        if (availableSlots.length === 0) return null;
        
        // Random starting time slot
        const randomIndex = Math.floor(Math.random() * availableSlots.length);
        const startSlot = availableSlots[randomIndex];
        const selectedSlots = [];
        
        // Mark taym slots as used
        for (let i = 0; i < hoursNeeded; i++) {
            const slot = TIME_SLOTS[startSlot + i];
            usedTimes[day].push(slot);
            selectedSlots.push(slot);
        }
        
        return {
            day: day,
            slots: selectedSlots,
            timeString: selectedSlots.length > 1 
                ? `${selectedSlots[0].split(' - ')[0]} - ${selectedSlots[selectedSlots.length-1].split(' - ')[1]}`
                : selectedSlots[0]
        };
    }

    subjects.forEach(subject => {
     
        let assigned = false;
        const shuffledDays = [...DAYS].sort(() => 0.5 - Math.random()); // Randomize day order
        
        for (const day of shuffledDays) {
            const slotInfo = findAvailableSlot(subject, day);
            if (slotInfo) {
                // Find available room
                const availableRooms = [...rooms];
                const randomRoom = availableRooms[Math.floor(Math.random() * availableRooms.length)];
                
                // Find available faculty
                const availableFaculty = faculty.filter(f => 
                    f.type === 'Full Time' || 
                    (f.shift === 'AM' && slotInfo.timeString.includes('AM')) ||
                    (f.shift === 'PM' && slotInfo.timeString.includes('PM'))
                );
                const randomFaculty = availableFaculty[Math.floor(Math.random() * availableFaculty.length)];
                
                if (randomRoom && randomFaculty) {
                    newSchedule.push({
                        code: subject.code,
                        name: subject.name,
                        day: day,
                        time: slotInfo.timeString,
                        room: randomRoom.name,
                        faculty: randomFaculty.name
                    });
                    assigned = true;
                    break;
                }
            }
        }
        
        if (!assigned) {
            console.warn(`Could not assign time slot for subject: ${subject.code}`);
        }
    });

    return newSchedule;
}

function displaySchedule(schedule, courseYearSection, semester, academicYear) {
    document.getElementById("previewSemester").textContent = semester;
    document.getElementById("previewCourseYearSection").textContent = courseYearSection;
    document.getElementById("previewAcademicYear").textContent = academicYear;
    
    const tbody = document.querySelector("#previewTable tbody");
    tbody.innerHTML = "";
    
    schedule.forEach(item => {
        const row = document.createElement("tr");
        
        const codeCell = document.createElement("td");
        codeCell.textContent = item.code;
        
        const timeCell = document.createElement("td");
        timeCell.textContent = `${item.day}\n${item.time}`;
        
        const roomCell = document.createElement("td");
        roomCell.textContent = item.room;
        
        const facultyCell = document.createElement("td");
        facultyCell.textContent = item.faculty;
        
        row.appendChild(codeCell);
        row.appendChild(timeCell);
        row.appendChild(roomCell);
        row.appendChild(facultyCell);
        
        tbody.appendChild(row);
    });
}

function saveSchedule() {
    const tbody = document.querySelector("#previewTable tbody");
    if (!tbody || tbody.rows.length === 0) {
        alert("No schedule to save. Please generate a schedule first.");
        return;
    }
    
    const semester = document.getElementById("previewSemester").textContent;
    const courseYearSection = document.getElementById("previewCourseYearSection").textContent;
    const academicYear = document.getElementById("previewAcademicYear").textContent;
    
    const schedule = Array.from(tbody.rows).map(row => ({
        code: row.cells[0].textContent,
        dayTime: row.cells[1].textContent,
        room: row.cells[2].textContent,
        faculty: row.cells[3].textContent
    }));
    
    const existingSchedules = JSON.parse(localStorage.getItem('schedules')) || [];
    
    const existingIndex = existingSchedules.findIndex(s => 
        s.courseYearSection === courseYearSection && s.semester === semester
    );
    
    if (existingIndex !== -1) {
        if (!confirm("A schedule already exists for this course and semester. Overwrite?")) {
            return;
        }
        existingSchedules[existingIndex] = {
            semester,
            courseYearSection,
            academicYear,
            schedule,
            createdAt: new Date().toISOString()
        };
    } else {
        existingSchedules.push({
            semester,
            courseYearSection,
            academicYear,
            schedule,
            createdAt: new Date().toISOString()
        });
    }
    
    localStorage.setItem('schedules', JSON.stringify(existingSchedules));
    alert("Schedule saved successfully!");
}

function printSchedule() {
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
        <html>
            <head>
                <title>BULACAN POLYTECHNIC COLLEGE</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    .header { margin-bottom: 20px; }
                    .header h2 { margin: 5px 0; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h2>${document.getElementById("previewSemester").textContent}</h2>
                    <h2>${document.getElementById("previewCourseYearSection").textContent}</h2>
                    <h2>Academic Year: ${document.getElementById("previewAcademicYear").textContent}</h2>
                </div>
                ${document.querySelector("#previewTable").outerHTML}
                <script>
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                            window.close();
                        }, 200);
                    };
                </script>
            </body>
        </html>
    `);
    printWindow.document.close();
}

// 4. Subject Management
function showSubjectForm() {
    document.getElementById('subjectOverlay').style.display = 'flex';
}

function hideSubjectForm() {
    document.getElementById('subjectOverlay').style.display = 'none';
}

function addSubject() {
    const code = document.getElementById('subjectCode').value.trim();
    const name = document.getElementById('subjectName').value.trim();
    const course = document.getElementById('subjectCourse').value;
    const year = document.getElementById('subjectYear').value;
    const semester = document.getElementById('subjectSemester').value;
    const hours = document.getElementById('subjectHours').value;

    if (!code || !name || !course || !year || !semester || !hours) {
        alert('Please fill all required fields');
        return;
    }

    const subject = {
        code,
        name,
        course,
        year,
        semester,
        hours
    };

    addSubjectToUI(subject);
    saveSubjectToStorage(subject);
    clearSubjectForm();
    hideSubjectForm();
}

function addSubjectToUI(subject) {
    const subjectItem = document.createElement('div');
    subjectItem.className = 'subject-item';
    subjectItem.innerHTML = `
        <span class="subj-code"> • ${subject.code} </span><br>
        <span class="subj-name">${subject.name}</span><br>
        <span class="subj-details">${subject.course} Year ${subject.year}, ${subject.semester === 'firstSemester' ? '1st' : '2nd'} Semester (${subject.hours} hrs)</span>
        <div class="item-actions">
            <button class="edit-btn" onclick="editSubject(this)"><i class="fas fa-edit"></i></button>
            <button class="remove-btn" onclick="removeItem(this)"><i class="fas fa-trash"></i></button>
        </div>
    `;
    document.getElementById('subjectList').appendChild(subjectItem);
}

function saveSubjectToStorage(subject) {
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    subjects.push(subject);
    localStorage.setItem('subjects', JSON.stringify(subjects));
}

function clearSubjectForm() {
    document.getElementById('subjectCode').value = '';
    document.getElementById('subjectName').value = '';
    document.getElementById('subjectCourse').value = '';
    document.getElementById('subjectYear').value = '';
    document.getElementById('subjectSemester').value = '';
    document.getElementById('subjectHours').value = '';
}

function editSubject(button) {
    const item = button.closest('.subject-item');
    const code = item.querySelector('.subj-code').textContent.replace('•', '').trim();
    const name = item.querySelector('.subj-name').textContent;
    const details = item.querySelector('.subj-details').textContent;
    
    const [course, yearData, semesterData, hoursData] = details.split(', ');
    const courseValue = course.split(' ')[0];
    const yearValue = yearData.split(' ')[1];
    const semesterValue = semesterData.includes('1st') ? 'firstSemester' : 'secondSemester';
    const hoursValue = hoursData.match(/\d+/)[0];

    document.getElementById('subjectCode').value = code;
    document.getElementById('subjectName').value = name;
    document.getElementById('subjectCourse').value = courseValue;
    document.getElementById('subjectYear').value = yearValue;
    document.getElementById('subjectSemester').value = semesterValue;
    document.getElementById('subjectHours').value = hoursValue;

    item.remove();
    removeSubjectFromStorage(code);
    
    showSubjectForm();
}

function removeSubjectFromStorage(code) {
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    const updatedSubjects = subjects.filter(subj => subj.code !== code);
    localStorage.setItem('subjects', JSON.stringify(updatedSubjects));
}

// 5. Remove Item 
function removeItem(button) {
    if (confirm('Are you sure you want to remove this item?')) {
        const item = button.closest('.faculty-item, .section-item, .room-item, .subject-item');
        if (item.classList.contains('subject-item')) {
            const code = item.querySelector('.subj-code').textContent.replace('•', '').trim();
            removeSubjectFromStorage(code);
        }
        item.remove();
    }
}

// 6. Sample Data
function initializeSampleData() {
    if (!localStorage.getItem('subjects') || localStorage.getItem('subjects') === '[]') {
        const sampleSubjects = [
            {
                code: "IS-FIS 123",
                name: "Fundamentals of Information Systems",
                course: "BSIS",
                year: "1",
                semester: "firstSemester",
                hours: 3
            },
            {
                code: "CP2 123",
                name: "Computer Programming 2",
                course: "BSIS",
                year: "1",
                semester: "firstSemester",
                hours: 3
            },
            {
                code: "OOP 123",
                name: "Object Oriented Programming",
                course: "BSIS",
                year: "1",
                semester: "firstSemester",
                hours: 3
            },
            {
                code: "CC-IC 123",
                name: "Introduction To Computing",
                course: "BSIS",
                year: "1",
                semester: "firstSemester",
                hours: 3
            },
            {
                code: "PE 123",
                name: "Physical Education",
                course: "BSIS",
                year: "1",
                semester: "firstSemester",
                hours: 3
            },
            {
                code: "TCW 123",
                name: "The Contemporary World",
                course: "BSIS",
                year: "1",
                semester: "firstSemester",
                hours: 3
            },
            {
                code: "DSA 223",
                name: "Data Structures and Algorithm",
                course: "BSIS",
                year: "1",
                semester: "firstSemester",
                hours: 3
            }
        ];
        localStorage.setItem('subjects', JSON.stringify(sampleSubjects));
    }
    
    if (!localStorage.getItem('rooms') || localStorage.getItem('rooms') === '[]') {
        const sampleRooms = [
            { name: "Room 101", id: "room101" },
            { name: "Room 102", id: "room102" },
            { name: "NTT Lab", id: "nttlab" },
            { name: "Computer Lab 1", id: "complab1" },
            { name: "Computer Lab 2", id: "complab2" },
            { name: "Computer Lab 3", id: "complab3" },
            { name: "Computer Lab 4", id: "complab4" },
            { name: "PE Room", id: "peroom" }            
        ];
        localStorage.setItem('rooms', JSON.stringify(sampleRooms));
    }
    
    if (!localStorage.getItem('faculties') || localStorage.getItem('faculties') === '[]') {
        const sampleFaculty = [
            { 
                name: "Prof. Dion Tenorio", 
                head: "BTVTED Dept", 
                type: "Full Time", 
                shift: "AM/PM",
                id: "fac1"
            },
            { 
                name: "Prof. Krizan Takeda", 
                head: "BSIS Dept", 
                type: "Full Time", 
                shift: "AM/PM",
                id: "fac2"
            },
            { 
                name: "Prof. Dheniel Cruz", 
                head: "BTVTED Dept", 
                type: "Full Time", 
                shift: "AM/PM",
                id: "fac3"
            },
            { 
                name: "Prof. Aron Pangiligan", 
                head: "BSIS Dept", 
                type: "Full Time", 
                shift: "AM/PM",
                id: "fac4"
            },
            { 
                name: "Prof. Mark Lacatan", 
                head: "BTVTED Dept", 
                type: "Full Time", 
                shift: "AM/PM",
                id: "fac5"
            },
            { 
                name: "Prof. Narvie Pham", 
                head: "BSIS Dept", 
                type: "Full Time", 
                shift: "AM/PM",
                id: "fac6"
            },
            { 
                name: "Prof. Russel Escote", 
                head: "BSIS Dept", 
                type: "Part Time", 
                shift: "PM",
                id: "fac7"
            }
        ];
        localStorage.setItem('faculties', JSON.stringify(sampleFaculty));
    }
    
    if (!localStorage.getItem('sections') || localStorage.getItem('sections') === '[]') {
        const sampleSections = [
            {
                name: "BSIS1A",
                adviser: "Prof. Russel Escote",
                id: "sec1"
            },
            {
                name: "BTVTED2B",
                adviser: "Prof. Dion Tenorio",
                id: "sec2"
            }
        ];
        localStorage.setItem('sections', JSON.stringify(sampleSections));
    }
}

// 7. Saved Schedules 
function loadSavedSchedules() {
    const scheduleList = document.getElementById('scheduleList');
    const schedules = JSON.parse(localStorage.getItem('schedules')) || [];
    scheduleList.innerHTML = '';

    if (schedules.length === 0) {
        scheduleList.innerHTML = '<p>No saved schedules found.</p>';
        return;
    }

    schedules.forEach((sched, idx) => {
        const btn = document.createElement('button');
        btn.textContent = `${sched.courseYearSection} | ${sched.semester} | ${sched.academicYear}`;
        btn.style.margin = '5px 0';
        btn.onclick = () => previewSchedule(idx);
        scheduleList.appendChild(btn);
    });
}

// Preview a selected schedule
function previewSchedule(index) {
    const schedules = JSON.parse(localStorage.getItem('schedules')) || [];
    const sched = schedules[index];
    if (!sched) return;

    document.getElementById('schedulePreviewContainer').style.display = 'block';
    document.getElementById('schedulePreviewHeader').innerHTML = `
        <h3>${sched.courseYearSection}</h3>
        <h4>${sched.semester}</h4>
        <h4>Academic Year: ${sched.academicYear}</h4>
    `;

    const tbody = document.querySelector('#schedulePreviewTable tbody');
    tbody.innerHTML = '';
    sched.schedule.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.code}</td>
            <td style="white-space:pre-line">${item.dayTime}</td>
            <td>${item.room}</td>
            <td>${item.faculty}</td>
        `;
        tbody.appendChild(row);
    });

    document.getElementById('printScheduleBtn').onclick = function() {
        printSchedulePreview(sched);
    };
}

function printSchedulePreview(sched) {
    const win = window.open('', '', 'width=900,height=700');
    const isDark = document.body.classList.contains('dark-mode');
    win.document.write(`
        <html>
        <head>
            <title>Print or Save Schedule as PDF</title>
            <style>
                body { font-family: Arial, sans-serif; background: ${isDark ? '#222' : '#fff'}; color: ${isDark ? '#fff' : '#222'}; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: ${isDark ? '#333' : '#f2f2f2'}; }
                h3, h4 { margin: 5px 0; }
            </style>
        </head>
        <body>
            <h3>${sched.courseYearSection}</h3>
            <h4>${sched.semester}</h4>
            <h4>Academic Year: ${sched.academicYear}</h4>
            <table>
                <thead>
                    <tr>
                        <th>Subject Code</th>
                        <th>Day/Time</th>
                        <th>Room</th>
                        <th>Faculty</th>
                    </tr>
                </thead>
                <tbody>
                    ${sched.schedule.map(item => `
                        <tr>
                            <td>${item.code}</td>
                            <td style="white-space:pre-line">${item.dayTime}</td>
                            <td>${item.room}</td>
                            <td>${item.faculty}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <script>
                window.onload = function() {
                    setTimeout(function() {
                        window.print();
                        window.close();
                    }, 200);
                };
            </script>
        </body>
        </html>
    `);
    win.document.close();
}

// 8. Event Listeners & DOMContentLoaded
function initScheduleGeneration() {
    document.getElementById("course").addEventListener("change", updatePreview);
    document.getElementById("yrSemester").addEventListener("change", updatePreview);
    document.getElementById("chooseSection").addEventListener("change", updatePreview);
    const generateBtn = document.getElementById("generateBtn");
    if (generateBtn) {
        generateBtn.addEventListener("click", function(e) {
            e.preventDefault();
            generateSchedules();
        });
    }
    const previewButtons = document.querySelector(".preview-buttons");
    if (previewButtons) {
        previewButtons.innerHTML = `
            <button onclick="saveSchedule()">Save Schedule</button>
            <button onclick="printSchedule()">Print</button>
        `;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    initScheduleGeneration();
    initializeSampleData();
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    subjects.forEach(subject => addSubjectToUI(subject));
    // Check Schedules tab
    const checkTabBtn = document.querySelector('[data-tab-target="#checkTab"]');
    if (checkTabBtn) {
        checkTabBtn.addEventListener('click', function () {
            loadSavedSchedules();
            document.getElementById('schedulePreviewContainer').style.display = 'none';
        });
    }
    if (document.getElementById('checkTab').classList.contains('active')) {
        loadSavedSchedules();
        document.getElementById('schedulePreviewContainer').style.display = 'none';
    }
});