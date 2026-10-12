const API_URL = 'http://localhost:5000/api/applications';
const jobForm = document.getElementById('jobForm');
const applicationTableBody = document.getElementById('applicationTableBody');
const searchBar = document.getElementById('searchBar');

let allApplications = [];

// 1. Fetch live records from server database
async function fetchApplications() {
    try {
        const res = await fetch(API_URL);
        allApplications = await res.json();
        renderApplications(allApplications);
    } catch (err) {
        console.error("Failed to load operations:", err);
    }
}

// 2. Clear out container and print fresh arrays into table element
function renderApplications(data) {
    applicationTableBody.innerHTML = '';
    data.forEach(app => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong id="name-${app._id}">${app.company_name}</strong></td>
            <td id="role-${app._id}">${app.role_profile}</td>
            <td>
                <select onchange="updateStatus('${app._id}', this.value)">
                    <option value="Applied" ${app.status === 'Applied' ? 'selected' : ''}>Applied</option>
                    <option value="Interviewing" ${app.status === 'Interviewing' ? 'selected' : ''}>Interviewing</option>
                    <option value="Selected" ${app.status === 'Selected' ? 'selected' : ''}>Selected</option>
                    <option value="Rejected" ${app.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                </select>
            </td>
            <td>
                <button class="btn-edit" onclick="editApplication('${app._id}', '${app.status}')" style="background-color: #f39c12; color: white; padding: 6px 12px; border: none; border-radius: 5px; cursor: pointer; margin-right: 5px;">Edit</button>
                <button class="btn-delete" onclick="deleteApplication('${app._id}')">Delete</button>
            </td>
        `;
        applicationTableBody.appendChild(tr);
    });
}

// 3. Post a fresh setup payload form object
jobForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const company_name = document.getElementById('companyName').value;
    const role_profile = document.getElementById('roleProfile').value;
    const status = document.getElementById('status').value;

    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ company_name, role_profile, status })
        });
        jobForm.reset();
        fetchApplications();
    } catch (err) {
        console.error("Failed storing request items:", err);
    }
});

// 4. EDIT FEATURE: Full Data Update Trigger
async function editApplication(id, currentStatus) {
    const currentName = document.getElementById(`name-${id}`).innerText;
    const currentRole = document.getElementById(`role-${id}`).innerText;

    // Browser input alerts to fetch new input text data
    const newCompanyName = prompt("Enter New Company Name:", currentName);
    if (newCompanyName === null) return; // Process cancel safety

    const newRoleProfile = prompt("Enter New Role Profile:", currentRole);
    if (newRoleProfile === null) return; // Process cancel safety

    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                company_name: newCompanyName.trim(), 
                role_profile: newRoleProfile.trim(),
                status: currentStatus 
            })
        });
        fetchApplications(); // Reload values on UI interface instantly
    } catch (err) {
        console.error("Failed updating custom record inputs:", err);
    }
}

// 5. PUT: Change status field real time inside dropdown collection
async function updateStatus(id, newStatus) {
    const company_name = document.getElementById(`name-${id}`).innerText;
    const role_profile = document.getElementById(`role-${id}`).innerText;

    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ company_name, role_profile, status: newStatus })
        });
    } catch (err) {
        console.error("Failed writing change actions:", err);
    }
}

// 6. DELETE: Remove single specific data record from list row
async function deleteApplication(id) {
    if (confirm("Are you sure you want to delete this job record completely?")) {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            fetchApplications();
        } catch (err) {
            console.error("Error executing destroy sequence:", err);
        }
    }
}

// 7. Instantly filter data locally inside state
searchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = allApplications.filter(app => 
        app.company_name.toLowerCase().includes(searchTerm)
    );
    renderApplications(filtered);
});

// Run automatically on first launch standard
fetchApplications();