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

app.post('/user/update/password', (req, res) => {
    const {id, password} = req.body;
    const table = new DataTable(connection, "profile");
    hashPassword(password, (hash) => {
        table.update({password: hash}, {id}, (result) => {
            if(result) {
                return res.json({status: true, message: "Updated successfully!"});
            }else {
                return res.json({status: false, message: "Failed to update details!"});
            }
        })
    })
})

app.post('/user/update/details', (req, res) => {
    const { id, firstname, lastname, contactNumber, designation } = req.body;
    const table = new DataTable(connection, "profile");
    table.update({ firstname, lastname, contactNumber, designation }, {id}, (result) => {
        if(result) {
            return res.json({status: true, message: "Updated successfully!"});
        }else {
            return res.json({status: false, message: "Failed to update details!"});
        }
    })
})

// Display Register Account
app.get('/account/data', (req, res) => {
    const table = new DataTable(connection, "profile");
    table.findAll((result) => {
        if (result && result.length > 0) {
            return res.json({ status: true, message: "Data fetched successfully", data: result });
        } else {
            return res.json({ status: false, message: "No data found" });
        }
    });
});


app.get('/category/data', (req, res) => {
    const { category } = req.query; 
    const table = new DataTable(connection, "categories");
    
    if (category) {
        table.findOne({ category }, (result) => {
            if (result) {
                return res.json({ status: true, message: "Data fetched successfully", data: result });
            } else {
                return res.json({ status: false, message: "No data found" });
            }
        });
    } else {
        table.findAll((results) => {
            return res.json({ status: true, message: "Data fetched successfully", data: results });
        });
    }
});


app.get('/borrowed/data', (req, res) => {
    const { status } = req.query; 
    const table = new DataTable(connection, "borrowed_books");
    
    if (status) {
        table.findOne({ status }, (result) => {
            if (result) {
                return res.json({ status: true, message: "Data fetched successfully", data: result });
            } else {
                return res.json({ status: false, message: "No data found" });
            }
        });
    } else {
        table.findAll((results) => {
            return res.json({ status: true, message: "Data fetched successfully", data: results });
        });
    }
});

app.get('/bookinfo/data', (req, res) => {
    const { title, author } = req.query; 
    const table = new DataTable(connection, "books");
    
    if (title && author) {
        table.findSome({ title, author }, (result) => {
            if (result) {
                return res.json({ status: true, message: "Data fetched successfully", data: result });
            } else {
                return res.json({ status: false, message: "No data found" });
            }
        });
    } else {
        table.findAll((results) => {
            return res.json({ status: true, message: "Data fetched successfully", data: results });
        });
    }
});



app.get('/bookinfo/data', (req, res) => {
    const {title, author } = req.query; 
    if (!author || !id) {
        return res.json({ status: false, message: "Author and Category are required" });
    }
    const table = new DataTable(connection, "books");
    table.findSome({title, author }, (result) => {
        if (result) {
            return res.json({ status: true, message: "Data fetched successfully", data: result });
        } else {
            return res.json({ status: false, message: "No data found" });
        }
    });
});




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
    const { title, category, isbn_issn, author, publisher, accession_number, date_published } = req.body;
    const table = new DataTable(connection, "books");
    table.insert({ title, category, isbn_issn, author, publisher, accession_number, date_published, book_status: "Available" }, (result) => {
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

app.get('/categories/data', (req, res) => {
    const table = new DataTable(connection, "categories");
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
    const { category, status, id, date_update } = req.body;
    if (!id) {
        return res.status(400).json({ status: false, message: "ID is required to update status." });
    }
    const table = new DataTable(connection, "categories");
    table.update({ category, status, date_update }, { id }, (result) => {
        if (result) {
            const booksTable = new DataTable(connection, "books");
            booksTable.update({ status }, { category }, (bookResult) => {
                if (bookResult) {
                    return res.json({ status: true, message: "Category and related books updated successfully." });
                } else {
                    return res.json({ status: true, message: "Category updated, but failed to update related books." });
                }
            });
        } else {
            return res.json({ status: false, message: "Failed to update category status." });
        }
    });
})

// Insert book data
app.post('/add/books', (req, res) => {
    const { title, category, isbn_issn, author, publisher, accession_number, date_published } = req.body;
    const table = new DataTable(connection, "books");
    table.insert({ title, category, isbn_issn, author, publisher, accession_number, date_published }, (result) => {
        if (result) {
            return res.json({ status: true, message: "Book added successfully" });
        } else {
            return res.json({ status: false, message: "Failed to add book" });
        }
    });
});

// Insert category data
app.post('/add/category', (req, res) => {
    const { category, status } = req.body;
    const date_update = new Date().toISOString();
    const table = new DataTable(connection, "categories");  
    table.insert({ category, status, date_update }, (result) => {
        if (result) {
            return res.json({ status: true, message: "Category added successfully" });
        } else {
            return res.json({ status: false, message: "Failed to add category" });
        }
    });
});

// Fetch categories
app.get('/get/categories', (req, res) => {
    const table = new DataTable(connection, "categories");
    table.findAll((result) => {
        if (result) {
            return res.json({ status: true, message: "Data fetched successfully", data: result });
        } else {
            return res.json({ status: false, message: "No data found" });
        }
    })
});

// Display books when searching
app.post('/search/book', (req, res) => {
    const { field, expression, conditions, operator } = req.body;
    const fieldMapping = {
        'Title': 'title',
        'Author': 'author',
        'Accession Number': 'accession_number',
        'Publisher': 'publisher',
        'ISBN/ISSN': 'isbn_issn',
        'Category': 'category',
        'Book Status': 'book_status',
        'Status': 'status'
    };

    if (field && expression) {

        const dbField = fieldMapping[field];
        if (!dbField) {
            return res.json({ status: false, message: "Invalid search field" });
        }

        const query = `SELECT * FROM books WHERE \`${dbField}\` = ?`;
        connection.query(query, [expression], (err, result) => {
            if (err) {
                return res.json({ status: false, message: "Error fetching data", error: err });
            }
            return res.json({
                status: result.length > 0,
                message: result.length > 0 ? "Data fetched successfully" : "No data found",
                data: result
            });
        });
    } else if (conditions && operator) {

        let whereClauses = [];
        let values = [];

        conditions.forEach(({ field, expression }) => {
            const dbField = fieldMapping[field];
            if (dbField && expression) {
                if (operator === 'NOT') {
                    whereClauses.push(`\`${dbField}\` != ?`);
                } else {
                    whereClauses.push(`\`${dbField}\` = ?`);
                }
                values.push(expression);
            }
        });

        if (whereClauses.length === 0) {
            return res.json({ status: false, message: "Invalid search conditions" });
        }

        const whereClause = operator === 'NOT' ? whereClauses.join(' AND ') : whereClauses.join(` ${operator} `);


        const query = `SELECT * FROM books WHERE ${whereClause}`;
        connection.query(query, values, (err, result) => {
            if (err) {
                return res.json({ status: false, message: "Error fetching data", error: err });
            }
            return res.json({
                status: result.length > 0,
                message: result.length > 0 ? "Data fetched successfully" : "No data found",
                data: result
            });
        });
    } else {
        return res.json({ status: false, message: "Invalid request. Provide either a simple search (field and expression) or advanced search (conditions and operator)." });
    }
});





app.post('/user/book', (req, res) => {
    const { firstname, lastname, designation, title, idNumber, pickup_date, author, isbn_issn, booking_date, contactNumber } = req.body;
    const table = new DataTable(connection, "borrowed_books");
    

    const getBookIdQuery = `SELECT id FROM books WHERE isbn_issn = ? AND book_status = 'available' LIMIT 1`;
    connection.query(getBookIdQuery, [isbn_issn], (err, results) => {
        if (err) {
            return res.json({ status: false, message: "Failed to retrieve book ID." });
        }
        if (results.length === 0) {
            return res.json({ status: false, message: "Book not available or invalid ISBN/ISSN." });
        }
        const book_id = results[0].id;
        table.insert({
            book_id, 
            firstname, 
            lastname, 
            designation, 
            title, 
            idNumber, 
            pickup_date, 
            author, 
            isbn_issn, 
            booking_date, 
            contactNumber, 
            status: "Pending", 
            book_status: 'borrowed'
        }, (insertResult) => {
            if (insertResult) {
                const updateBookStatusQuery = `UPDATE books SET book_status = 'borrowed' WHERE id = ?`;
                connection.query(updateBookStatusQuery, [book_id], (updateErr) => {
                    if (updateErr) {
                        return res.json({ status: false, message: "Failed to update book status." });
                    }
                    const message = `${firstname} ${lastname} with ID number ${idNumber} with ${designation} has borrowed the book(s) titled "${title}" for pickup on ${pickup_date}.`;
                    const notificationQuery = `INSERT INTO notification (idNumber, message) VALUES (?, ?)`;
                    connection.query(notificationQuery, [idNumber, message], (notificationErr) => {
                        if (notificationErr) {
                            return res.json({ status: true, message: "Book borrowed successfully, but failed to create notification." });
                        }
                        return res.json({ status: true, message: "Book borrowed successfully and notification created." });
                    });
                });
            } else {
                return res.json({ status: false, message: "Failed to borrow book" });
            }
        });
    });
});


app.post('/user/booked', (req, res) => {
    const { idNumber } = req.body; 
    const table = new DataTable(connection, "borrowed_books");
    if (idNumber) {
        table.findSome({ idNumber }, (result) => {
            if (result && result.length > 0) {
                return res.json({ status: true, message: "Data fetched successfully", data: result });
            } else {
                return res.json({ status: false, message: "No data found for this user" });
            }
        });
    } else {
        table.findAll((result) => {
            if (result && result.length > 0) {
                return res.json({ status: true, message: "Data fetched successfully", data: result });
            } else {
                return res.json({ status: false, message: "No data found" });
            }
        });
    }
});



app.get('/admin/notifications', (req, res) => {
    const query = `SELECT * FROM notification WHERE status = 'unread' ORDER BY timestamp DESC`;
    connection.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ status: false, message: `Error fetching notifications: ${err.message}` });
      }
      res.json({ status: true, notifications: results });
    });
  });

  app.post('/admin/notifications/mark-read', (req, res) => {
    const { id } = req.body;
    const query = `UPDATE notification SET status = 'read' WHERE id = ?`;
    connection.query(query, [id], (err, results) => {
      if (err) {
        return res.status(500).json({ status: false, message: `Error marking as read: ${err.message}` });
      }
      res.json({ status: true, message: 'Notification marked as read.' });
    });
  });


  // Route to delete notification
app.delete('/admin/notifications/delete', (req, res) => {
    const { id } = req.body;
    const query = `DELETE FROM notification WHERE id = ?`;
    connection.query(query, [id], (results) => {
      if (results) {
        return res.status(500).json({ status: false, message: `Error deleting notification: ${err.message}` });
      }
      res.json({ status: true, message: 'Notification deleted successfully.' });
    });
  });




  app.post('/user/update-status', (req, res) => {
    const { id, status } = req.body;
    const updateBorrowedBookQuery = `
        UPDATE borrowed_books SET status = ?, book_status = CASE  WHEN ? = 'Returned' THEN 'returned' ELSE book_status END  WHERE id = ?`;
    connection.query(updateBorrowedBookQuery, [status, status, id], (err, result) => {
        if (err) {
            console.error("Error updating borrowed book status:", err);
            return res.json({ status: false, message: "Failed to update borrowed book status" });
        }
        if (result.affectedRows === 0) {
            return res.json({ status: false, message: "No record found with the provided ID" });
        }

        if (status === 'Returned') {
            const getBookIdQuery = `SELECT book_id FROM borrowed_books WHERE id = ?`;
            connection.query(getBookIdQuery, [id], (bookErr, bookResult) => {
                if (bookErr || bookResult.length === 0) {
                    console.error("Error retrieving book ID:", bookErr);
                    return res.json({ status: false, message: "Failed to retrieve book ID" });
                }

                const book_id = bookResult[0].book_id;

                const updateBookStatusQuery = `UPDATE books SET book_status = 'available' WHERE id = ?`;
                connection.query(updateBookStatusQuery, [book_id], (updateErr) => {
                    if (updateErr) {
                        console.error("Error updating book status in books table:", updateErr);
                        return res.json({ status: false, message: "Failed to update book status in books table" });
                    }

                    return res.json({ status: true, message: "Status updated successfully and book is now available" });
                });
            });
        } else {
            return res.json({ status: true, message: "Status updated successfully" });
        }
    });
});





app.listen(8081, () => console.log("Server has been enabled!"));