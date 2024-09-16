const express = require('express');
const cors = require('cors');
const database = require('./database.js');
const DataTable = require('./data-query.js');
const {connection} = database;
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
const saltRounds = 10;



const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());



database.connect();

const hashPassword = (password, callback) => {
    bcrypt.hash(password, saltRounds, (error, hash) => {
        if(error ) throw error;
        return callback(hash);
    })
}

app.post('/auth/register', (req, res) => {
    const { firstname, lastname, idNumber, contactNumber, designation, username, password } = req.body;
    let table = new DataTable(connection, "profile");
    table.findOne({ idNumber }, (result) => {
      if (result) return res.json({ status: false, message: "ID Number already exists" });
  
      hashPassword(password, (hash) => {
        const datas = { firstname, lastname, idNumber, contactNumber, designation, username, password: hash };
        table.insert(datas, (result) => {
          if (result) {
            return res.json({ status: true, message: "Registration successful", data: result });
          } else {
            return res.json({ status: false, message: "Registration failed" });
          }
        }, (error) => {
          console.error(error);
          return res.json({ status: false, message: "Registration failed" });
        });
      });
    });
});


app.post('/auth/login', (req, res) => {
    const { username, password } = req.body;
    const table = new DataTable(connection, "profile");
    table.findOne({ username }, (result) => {
        if (!result) {
            return res.json({
                status: false,
                message: "Username not registered"
            });
        }
        bcrypt.compare(password, result.password, (error, data) => {
            if (error) {throw error;}if (!data) {
                return res.json({
                    status: false,
                    message: "Invalid Password"
                });
            }
            res.json({
                status: true,
                message: "Login successful",
                data: result
            });
        });
    });
});
// Display Register Account
app.get('/account/data', (req, res) => {
    const table = new DataTable(connection, "profile");
    table.findAll((result) => {
        if (result && result.length > 0) {
            return res.json({ status: true, message: "Data fetched successfully", data: result });
        } else {
            return res.json({ status: false, message: "No data found" });
        }
    })
})
// Delete Register Account
app.delete('/account/data/:idNumber', (req, res) => {
    const idNUmber = req.params.idNumber;
    const table = new DataTable(connection, "profile");
    table.delete({ idNUmber }, (result) => {
        if (result) {
            return res.json({ status: true, message: "Data deleted successfully" });
        } else {
            return res.json({ status: false, message: "Data not found" });
        }
    })
})
// Add Books in DB
app.post('/add/book', (req, res) => {
    const { title, category, isbn_issn, author, publisher, accession_number, date_published} = req.body;
    const table = new DataTable(connection, "books");
    table.insert({ title, category, isbn_issn, author, publisher, accession_number, date_published }, (result) => {
        if (result) {
            return res.json({ status: true, message: "Book added successfully" });
        } else {
            return res.json({ status: false, message: "Failed to add book" });
        }
    })

})
// DISPLAY BOOK DATA from Table
app.get('/book/data', (req, res) => {
    const table = new DataTable(connection, "books");
    table.findAll((result) => {
        if (result) {
            return res.json({ status: true, message: "Data fetched successfully", data: result });
        } else {
            return res.json({ status: false, message: "No data found" });
        }
    })
})
// Delete Author in Table
app.delete('/book/data/:author', (req, res) => {
    const author = req.params.author;
    const table = new DataTable(connection, "books");
    table.delete({ author }, (result) => {
        if (result) {
            return res.json({ status: true, message: "Data deleted successfully" });
        } else {
            return res.json({ status: false, message: "Data not found" });
        }
    })
})


// Display data from registration table
app.get('/register/data', (req, res) => {
    const table = new DataTable(connection, "profile", "books");
    table.findAll((result) => {
        if (result && result.length > 0) {
            return res.json({ status: true, message: "Data fetched successfully", data: result });
        } else {
            return res.json({ status: false, message: "No data found" });
        }
    })
})

// Edit Books Details 
app.post('/edit/books', (req, res) => {
    const { title, category, isbn_issn, author, publisher, accession_number, date_published} = req.body;
    const table = new DataTable(connection, "books");
    table.update({ title, category, isbn_issn, author, publisher, date_published},{ accession_number },(result) => {
            if (result) {
                return res.json({ status: true, message: "Book edited successfully" });
            } else {
                return res.json({ status: false, message: "Failed to edit book" });
            }
        }
    );
});
app.post('/update/status', (req, res) => {
    const { category, status, date_update,  accession_number } = req.body;
    const table = new DataTable(connection, "books");
    table.update({category, status, date_update }, { accession_number },(result) => {
        if(result) {
            return res.json({ status: true, message: "Status updated successfully" });
        } else {
            return res.json({ status: false, message: "Failed to update status" });
        }
    })
})

app.post('/search/book', (req, res) => {
    const table = new DataTable(connection, "books");
    const { field, expression } = req.body;

    if (!field || !expression) {
        return res.json({ status: false, message: "Search field and expression are required" });
    }
    const allowedFields = ['Title', 'Author', 'Accession Number', 'Publisher', 'ISBN/ISSN', 'Category'];
    if (!allowedFields.includes(field)) {
        return res.json({ status: false, message: "Invalid search field" });
    }
    let searchCondition = {};
    searchCondition[field] = expression;
    table.findSome(searchCondition, (result, err) => {
        if (err) {
            return res.json({ status: false, message: "Error fetching data", error: err });
        }
        if (result.length > 0) {
            return res.json({ status: true, message: "Data fetched successfully", data: result });
        } else {
            return res.json({ status: false, message: "No data found" });
        }
    });
});





app.listen(8081, () => console.log("Server has been enabled!"));