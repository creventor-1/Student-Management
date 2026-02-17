// script.js - The Waiter (Talks to the Backend)

// The address of your server
const API_URL = 'http://localhost:3000/students';

// This array will hold the data we get from the database
let students = [];

// --- 1. FETCH DATA (READ) ---
// This function asks the server for the list of students
async function fetchStudents() {
    try {
        const response = await fetch(API_URL);
        students = await response.json(); // Convert text to a JavaScript Array
        renderTable();                    // Update the screen
        updateStats();                    // Update the numbers
    } catch (error) {
        console.error('Error fetching students:', error);
        alert('Could not connect to the server. Is it running?');
    }
}

// --- 2. RENDER TABLE (DISPLAY) ---
function renderTable(data = students) {
    const tbody = document.getElementById('student-table-body');
    tbody.innerHTML = ''; // Clear the table first

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

// --- 3. ADD STUDENT (CREATE) ---
document.getElementById('addStudentForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Stop the page from reloading

    // Bundle the form data into an object
    const newStudent = {
        id: document.getElementById('newIdx').value,
        name: document.getElementById('newName').value,
        course: document.getElementById('newCourse').value,
        gpa: document.getElementById('newGpa').value
    };

    try {
        // Send the object to the server
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newStudent)
        });

        if (response.ok) {
            // If successful, refresh the list
            fetchStudents();
            closeModal();
            // Clear the form inputs
            e.target.reset();
            alert('Student Added Successfully!');
        } else {
            alert('Error adding student');
        }

    } catch (error) {
        console.error('Error adding student:', error);
    }
});

// --- 4. DELETE STUDENT (DELETE) ---
async function deleteStudent(studentId) {
    if(confirm('Are you sure you want to remove this student?')) {
        try {
            // Tell the server to delete the student with this ID
            await fetch(`${API_URL}/${studentId}`, {
                method: 'DELETE'
            });
            
            // Refresh the list automatically
            fetchStudents();
            
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    }
}

// --- 5. SEARCH LOGIC (LOCAL FILTER) ---
function filterStudents() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    // We filter the local 'students' array because we already fetched the data
    const filtered = students.filter(s => 
        s.name.toLowerCase().includes(searchTerm) || 
        s.id.includes(searchTerm)
    );
    renderTable(filtered);
}

// --- 6. NAVIGATION & UI ---
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(sec => sec.style.display = 'none');
    // Show the clicked section
    document.getElementById(sectionId + '-section').style.display = 'block';

    // Update Sidebar Active Class
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    // Note: We need to pass 'this' from HTML or handle event differently. 
    // To keep it simple, we just rely on visual toggle for now or you can add 'event' logic back.
    
    // Update Header
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


// --- MODAL FUNCTIONS ---
function openModal() { document.getElementById('studentModal').style.display = 'flex'; }
function closeModal() { document.getElementById('studentModal').style.display = 'none'; }
window.onclick = function(event) {
    const modal = document.getElementById('studentModal');
    if (event.target == modal) modal.style.display = "none";
}

// --- INITIALIZATION ---
// When the page loads, fetch the data immediately
fetchStudents();