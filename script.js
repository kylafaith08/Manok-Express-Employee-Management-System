let allEmployees = [];
let editingEmployeeId = null;

// TIME
function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString("en-PH", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    });
//DATE
    const date = now.toLocaleDateString("en-PH", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    document.getElementById("headerClock").textContent = time;
    document.getElementById("pageDate").textContent = date;

}
updateClock();
setInterval(updateClock, 1000);
//FOR KIOSK CLOCK
function updateKioskClock() {
    const now = new Date();

    const time = now.toLocaleTimeString("en-PH", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    });

    const date = now.toLocaleDateString("en-PH", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    const kioskClock = document.getElementById("kioskClock");
    const kioskDate = document.getElementById("kioskDate");
    if (kioskClock) {
        kioskClock.textContent = time;
    }
    if (kioskDate) {
        kioskDate.textContent = date;
    }
}

updateKioskClock();
setInterval(updateKioskClock, 1000);

//EMPLOYEE INFORMATION
function openEmployeeModal() {
    document.getElementById("employeeModal").classList.remove("hidden");
}
function closeEmployeeModal() {
    document.getElementById("employeeModal").classList.add("hidden");
}
async function addEmployee(event) {
    event.preventDefault();
    const employee = {

        name: document.getElementById("newName").value,
        status: document.getElementById("newStatus").value,
        station: document.getElementById("newStation").value,
        position: document.getElementById("newPosition").value,
        email: document.getElementById("newEmaill").value,

        salaryGrade: document.getElementById("newGrade").value,

        phone: document.getElementById("phoneNo").value,

        dateHired: document.getElementById("dateHired").value
    };
    try {
        let response;

        // EDIT EMPLOYEE
        if (editingEmployeeId !== null) {

            response = await fetch(
                `/api/employees/${editingEmployeeId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(employee)
                }
            );

        }

        // ADD EMPLOYEE
        else {

            response = await fetch(
                "/api/employees",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(employee)
                }
            );

        }

        const result = await response.json("Hi");

        if (!response.ok) {
            alert(result.error || "Failed to save employee.");
            return;
        }

        // Show correct message
        if (editingEmployeeId !== null) {
            alert("Employee updated successfully!");
        } else {
            alert("Employee added successfully!");
        }


        // Close modal
        closeEmployeeModal();
        document.querySelector("#employeeModal form").reset();// Reset form
        editingEmployeeId = null; // Reset edit mode
        document.getElementById("modalTitle").textContent = "Add Employee";// Reset modal
        document.getElementById("modalSubmitButton").textContent ="Add Employee";
            
        // Reload employee table
        loadEmployees();

    }

    catch (error) {
        console.error("ERROR:", error);
        alert("Cannot connect to the server.");
    }
}

async function loadEmployees() {
    try {
        const response = await fetch("/api/employees");
        allEmployees = await response.json();
        renderEmployees(allEmployees);
    } catch (error) {
        console.error("Error loading employees:", error);
    }
}

function filterEmployees() {
    const search =
        document.getElementById("employeeSearch")
            .value
            .toLowerCase();

    const station =
        document.getElementById("departmentFilter")
            .value;

    const filteredEmployees =
        allEmployees.filter(employee => {

            const matchesSearch =
                employee.name.toLowerCase().includes(search) ||
                employee.id.toString().includes(search) ||
                employee.station.toLowerCase().includes(search);

            const matchesStation =
                station === "All" ||
                employee.station === station;

            return matchesSearch && matchesStation;
        });
    renderEmployees(filteredEmployees);
}

function renderEmployees(employees) {

    const employeeRows =
        document.getElementById("employeeRows");

    if (!employeeRows) {
        return;
    }

    employeeRows.innerHTML = "";


    employees.forEach(employee => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${employee.id}</td>

            <td>${employee.name}</td>

            <td>${employee.station}</td>

            <td>${employee.status}</td>

            <td>${employee.salaryGrade}</td>

            <td>${employee.email}</td>

            <td>${employee.phone}</td>

            <td>${employee.dateHired}</td>

            <td>

    <button
        class="action-btn"
        onclick="editEmployee(${employee.id})">
        Edit
    </button>

    <button
        class="action-btn"
        onclick="deleteEmployee(${employee.id})">
        Delete
    </button>

</td>

        `;


        employeeRows.appendChild(row);

    });


    document.getElementById(
        "employeeTotal"
    ).textContent =
        `Total Employees: ${employees.length}`;
}

function editEmployee(id) {

    // Find the employee
    const employee = allEmployees.find(
        employee => employee.id === id
    );

    if (!employee) {
        alert("Employee not found.");
        return;
    }

    // Store the employee ID
    editingEmployeeId = id;

    // Change modal title
    document.getElementById("modalTitle").textContent =
        "Edit Employee";

    // Change button text
    document.getElementById("modalSubmitButton").textContent =
        "Save Changes";

    // Put existing information into the form
    document.getElementById("newName").value =
        employee.name;

    document.getElementById("newStatus").value =
        employee.status;

    document.getElementById("newStation").value =
        employee.station;

    document.getElementById("newPosition").value =
        employee.position;

    document.getElementById("newEmaill").value =
        employee.email;

    document.getElementById("newGrade").value =
        employee.salaryGrade;

    document.getElementById("phoneNo").value =
        employee.phone;

    document.getElementById("dateHired").value =
        employee.dateHired;

    // Open modal
    document.getElementById("employeeModal")
        .classList.remove("hidden");
}

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadEmployees();

    }
);

async function deleteEmployee(id) {

    const employee = allEmployees.find(
        employee => employee.id === id
    );

    if (!employee) {
        return;
    }


    const confirmDelete = confirm(
        `Are you sure you want to delete ${employee.name}?`
    );


    if (!confirmDelete) {
        return;
    }


    try {

        const response = await fetch(
            `/api/employees/${id}`,
            {
                method: "DELETE"
            }
        );


        const result = await response.json();


        if (response.ok) {

            alert("Employee deleted successfully!");

            loadEmployees();

        } else {

            alert(
                result.error ||
                "Failed to delete employee."
            );

        }

    } catch (error) {

        console.error(error);

        alert("Cannot connect to the server.");

    }
}
