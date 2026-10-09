const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const databaseFile = path.join(__dirname, "employees.json");

app.use(express.json());
app.use(express.static(__dirname));


// GET EMPLOYEES
app.get("/api/employees", (req, res) => {

    fs.readFile(databaseFile, "utf8", (err, data) => {

        if (err) {
            return res.status(500).json({
                error: "Could not read employees.json"
            });
        }

        const database = JSON.parse(data);

        res.json(database.employees);
    });

});


// ADD EMPLOYEE
app.post("/api/employees", (req, res) => {

    fs.readFile(databaseFile, "utf8", (err, data) => {

        if (err) {
            return res.status(500).json({
                error: "Could not read employees.json"
            });
        }

        const database = JSON.parse(data);

        const newId =
            database.employees.length > 0
                ? database.employees[database.employees.length - 1].id + 1
                : 1;

        const newEmployee = {
            id: newId,
            name: req.body.name,
            status: req.body.status,
            station: req.body.station,
            position: req.body.position,
            email: req.body.email,
            salaryGrade: req.body.salaryGrade,
            phone: req.body.phone,
            dateHired: req.body.dateHired
        };

        database.employees.push(newEmployee);

        fs.writeFile(
            databaseFile,
            JSON.stringify(database, null, 4),
            err => {

                if (err) {
                    return res.status(500).json({
                        error: "Could not save employee"
                    });
                }

                res.json({
                    message: "Employee added successfully!",
                    employee: newEmployee
                });

            }
        );

    });

});

// ==========================================
// EDIT EMPLOYEE
// ==========================================

app.put("/api/employees/:id", (req, res) => {

    fs.readFile(databaseFile, "utf8", (err, data) => {

        if (err) {
            return res.status(500).json({
                error: "Cannot read database"
            });
        }

        const database = JSON.parse(data);

        const id = parseInt(req.params.id);

        const employeeIndex = database.employees.findIndex(
            employee => employee.id === id
        );

        if (employeeIndex === -1) {
            return res.status(404).json({
                error: "Employee not found"
            });
        }

        // Update employee
        database.employees[employeeIndex] = {
            id: id,
            name: req.body.name,
            status: req.body.status,
            station: req.body.station,
            position: req.body.position,
            email: req.body.email,
            salaryGrade: req.body.salaryGrade,
            phone: req.body.phone,
            dateHired: req.body.dateHired
        };

        fs.writeFile(
            databaseFile,
            JSON.stringify(database, null, 4),
            err => {

                if (err) {
                    return res.status(500).json({
                        error: "Cannot update employee"
                    });
                }

                res.json({
                    message: "Employee updated successfully!",
                    employee: database.employees[employeeIndex]
                });

            }
        );

    });

});


// ==========================================
// DELETE EMPLOYEE
// ==========================================

app.delete("/api/employees/:id", (req, res) => {

    fs.readFile(databaseFile, "utf8", (err, data) => {

        if (err) {
            return res.status(500).json({
                error: "Cannot read database"
            });
        }

        const database = JSON.parse(data);

        const id = parseInt(req.params.id);

        const employeeIndex = database.employees.findIndex(
            employee => employee.id === id
        );

        if (employeeIndex === -1) {
            return res.status(404).json({
                error: "Employee not found"
            });
        }

        // Remove employee
        database.employees.splice(employeeIndex, 1);

        fs.writeFile(
            databaseFile,
            JSON.stringify(database, null, 4),
            err => {

                if (err) {
                    return res.status(500).json({
                        error: "Cannot delete employee"
                    });
                }

                res.json({
                    message: "Employee deleted successfully!"
                });

            }
        );

    });

});


app.listen(PORT, () => {
    console.log(
        `Manok Express HR System running at http://localhost:${PORT}`
    );
});

