const API_URL = ('https://easy-record.onrender.com/students');

let students = [];

async function fetchStudents() {
    try {
        const response = await fetch(API_URL);
        students = await response.json(); 
        renderTable();                    
        updateStats();                    
    } catch (error) {
        console.error('Error fetching students:', error);
        alert('Could not connect to the server. Is it running?');
    }
}

function renderTable(data = students) {
    const tbody = document.getElementById('student-table-body');
    tbody.innerHTML = ''; 

    data.forEach((student) => {
        const row = `
            <tr>
                <td>${student.id}</td>
                <td><strong>${student.name}</strong></td>
                <td>${student.course}</td>
                <td><span style="background: #E0F2F1; padding: 4px 8px; border-radius: 4px; color: #00695C;">${student.gpa}</span></td>
                <td>
                    <button class="btn btn-danger" style="padding: 5px 10px; font-size: 0.8rem;" onclick="deleteStudent('${student.id}')">Delete</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

document.getElementById('addStudentForm').addEventListener('submit', async function(e) {
    e.preventDefault(); 

    const newStudent = {
        id: document.getElementById('newIdx').value,
        name: document.getElementById('newName').value,
        course: document.getElementById('newCourse').value,
        gpa: document.getElementById('newGpa').value
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newStudent)
        });

        if (response.ok) {
            fetchStudents();
            closeModal();
            e.target.reset();
            alert('Student Added Successfully!');
        } else {
            alert('Error adding student');
        }

    } catch (error) {
        console.error('Error adding student:', error);
    }
});

async function deleteStudent(studentId) {
    if(confirm('Are you sure you want to remove this student?')) {
        try {
            await fetch(`${API_URL}/${studentId}`, {
                method: 'DELETE'
            });
            
            fetchStudents();
            
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    }
}

function filterStudents() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filtered = students.filter(s => 
        s.name.toLowerCase().includes(searchTerm) || 
        s.id.includes(searchTerm)
    );
    renderTable(filtered);
}

function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(sec => sec.style.display = 'none');
    document.getElementById(sectionId + '-section').style.display = 'block';
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));    

    const titles = { 'home': 'Student Records',
                     'profile': 'Admin Profile',
                    'courses': 'Course Management' };
    document.getElementById('page-title').innerText = titles[sectionId];

    const searchBox = document.querySelector('.search-box');
    if (sectionId == 'home') {
        searchBox.style.display = 'block';
    } 
    else {
        searchBox.style.display = 'none';
    }
}

function updateStats() {
    const count = students.length;
    document.getElementById('total-students-count').innerText = count;
    document.getElementById('profile-total-students').innerText = count;

    if (count == 0) {
        document.getElementById('average-gpa').innerText = '0.0';
    }
    else {
        const totalGpa = students.reduce((sum, students) => sum + parseFloat(students.gpa), 0);
        const average = totalGpa / count;
        document.getElementById('average-gpa').innerText = average.toFixed(2);
    }

    const uniqueCourses = new Set();

        students.forEach(student => {
            const courseName = String(student.course).toLowerCase().trim();
            
            if(courseName) {
                uniqueCourses.add(courseName);
            }
        });

        document.getElementById('profile-active-courses').innerText = uniqueCourses.size;
    }


// MODAL FUNCTIONS 
function openModal() { document.getElementById('studentModal').style.display = 'flex'; }
function closeModal() { document.getElementById('studentModal').style.display = 'none'; }
window.onclick = function(event) {
    const modal = document.getElementById('studentModal');
    if (event.target == modal) modal.style.display = "none";
}

// INITIALIZATION 
// When the page loads, fetch the data immediately
fetchStudents();