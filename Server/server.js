const express = require('express');
const cors = require('cors');
const database = require('./database.js');
const DataTable = require('./data-query.js');
const {connection} = database;
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
const saltRounds = 10;
const nodemailer = require('nodemailer');





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
    const { firstname, lastname, idNumber, contactNumber, email, designation, username, password } = req.body;
    let table = new DataTable(connection, "profile");
  
    table.findOne({ username }, (result) => {
      if (result) return res.json({ status: false, message: "Username already exists" });
  
      hashPassword(password, (hash) => {
        const datas = { firstname, lastname, idNumber, contactNumber, email, designation, username, password: hash };
  
        table.insert(datas, (result) => {
          if (result) {
            let transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'eyce0x@gmail.com', 
                pass: 'losq ejdn upgd vngt', 
              },
            });
  
            let mailOptions = {
              from: 'your-email@gmail.com', 
              to: email, 
              subject: 'Registration Sucessful for Online Public Access Catalog (OPAC)',  
              text: `Hi ${firstname},\n\nYou have successfully registered with the following details:\n
                     First Name: ${firstname}
                     Last Name: ${lastname}
                     ID Number: ${idNumber}
                     Contact Number: ${contactNumber}
                     Designation: ${designation}
                     Username: ${username}
                     Password: ${password} 
                     
                     \n\nThank you for registering!`,
            };
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.error('Error sending email:', error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
  
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
    const { status, book_status } = req.query; 
    const table = new DataTable(connection, "borrowed_books");
    
    if (status) {
        table.findOne({ status, book_status }, (result) => {
            if (result) {
                return res.json({ status: true, message: "Data fetched successfully", data: result });
            } else {
                return res.json({ status: false, message: "No data found" });
            }
        });
    } else {
        table.findAll((results) => {
            const filteredResults = results.filter(book => book.book_status !== "Returned");
            console.log("Filtered results:", filteredResults);
            return res.json({ status: true, message: "Data fetched successfully", data: filteredResults });
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


app.post('/add/book', (req, res) => {
    const { title, category, isbn_issn, author, publisher, accession_number, date_published, mark_tags, subject, ddc_class } = req.body;
    const markTagsString = Array.isArray(mark_tags) ? mark_tags.join(', ') : mark_tags;
    const table = new DataTable(connection, "books");
    table.insert({ title, category, isbn_issn, author, publisher, accession_number, date_published, mark_tags: markTagsString, book_status: "Available", subject, ddc_class }, (result) => {
        if (result) {
            return res.json({ status: true, message: "Book added successfully" });
        } else {
            return res.json({ status: false, message: "Failed to add book" });
        }
    })

})


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
    const { title, category, isbn_issn, author, publisher, accession_number, date_published, status, subject, ddc_class } = req.body;
    
    const table = new DataTable(connection, "books");
    
    // Update book details, including status
    table.update(
        { title, category, isbn_issn, author, publisher, date_published, status, subject, ddc_class },  // The updated fields including status
        { accession_number },  // Where condition to find the book by accession number
        (result) => {
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

    // Convert date_update to MySQL compatible format
    const formattedDateUpdate = new Date(date_update).toISOString().slice(0, 19).replace('T', ' ');

    const table = new DataTable(connection, "categories");
    table.update({ category, status, date_update: formattedDateUpdate }, { id }, (result) => {
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
        'Subject': 'subject',
        'DDC Classification': 'ddc_class',
        'Accession Number': 'accession_number',
        'Publisher': 'publisher',
        'ISBN/ISSN': 'isbn_issn',
        'Category': 'category',
        'Tags': 'mark_tags',
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

app.get('/suggestions', (req, res) => {
    const { field, query } = req.query;

    if (!field || !query) {
        return res.status(400).json({ message: "Missing search field or query" });
    }

    const fieldMapping = {
        'Title': 'title',
        'Author': 'author',
        'Subject': 'subject',
        'DDC Classification': 'ddc_class',
        'Accession Number': 'accession_number',
        'Publisher': 'publisher',
        'ISBN/ISSN': 'isbn_issn',
        'Category': 'category',
        'Tags': 'mark_tags',
        'Book Status': 'book_status',
        'Status': 'status'
    };

    const dbField = fieldMapping[field];
    if (!dbField) {
        return res.status(400).json({ message: "Invalid search field" });
    }

    const queryString = `SELECT DISTINCT \`${dbField}\` FROM books WHERE \`${dbField}\` LIKE ? LIMIT 10`;
    connection.query(queryString, [`%${query}%`], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }
        return res.json(result.map(row => row[dbField]));
    });
});




app.post('/user/book', (req, res) => {
    const { 
        firstname, 
        lastname, 
        designation, 
        title, 
        idNumber, 
        pickup_date, 
        author, 
        isbn_issn, 
        booking_date, 
        contactNumber 
    } = req.body;

    const getBookIdQuery = `SELECT id FROM books WHERE isbn_issn = ? AND book_status = 'available' LIMIT 1`;
    
    connection.query(getBookIdQuery, [isbn_issn], (err, results) => {
        if (err) {
            return res.status(500).json({ status: false, message: "Failed to retrieve book ID.", error: err });
        }
        if (results.length === 0) {
            return res.status(404).json({ status: false, message: "Book not available or invalid ISBN/ISSN." });
        }

        const book_id = results[0].id;

        const insertBorrowedBookQuery = `
            INSERT INTO borrowed_books (
                book_id, firstname, lastname, designation, title, idNumber, 
                pickup_date, author, isbn_issn, booking_date, contactNumber, 
                status, book_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', 'borrowed')`;

        connection.query(insertBorrowedBookQuery, [
            book_id, firstname, lastname, designation, title, idNumber,
            pickup_date, author, isbn_issn, booking_date, contactNumber
        ], (insertErr) => {
            if (insertErr) {
                return res.status(500).json({ status: false, message: "Failed to borrow book.", error: insertErr });
            }

            const updateBookStatusQuery = `UPDATE books SET book_status = 'borrowed' WHERE id = ?`;

            connection.query(updateBookStatusQuery, [book_id], (updateErr) => {
                if (updateErr) {
                    return res.status(500).json({ status: false, message: "Failed to update book status.", error: updateErr });
                }

                const notificationMessage = `${firstname} ${lastname} with ID number ${idNumber} and the ${designation} has borrowed the book titled "${title}" for pickup on ${pickup_date}.`;
                const insertNotificationQuery = `INSERT INTO notification (idNumber, message) VALUES (?, ?)`;

                connection.query(insertNotificationQuery, [idNumber, notificationMessage], (notificationErr) => {
                    if (notificationErr) {
                        return res.status(500).json({ status: true, message: "Book borrowed successfully, but failed to create notification.", error: notificationErr });
                    }
                    return res.status(200).json({ status: true, message: "Book borrowed successfully and notification created." });
                });
            });
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
    const query = `SELECT id, message, status, link, timestamp FROM notification WHERE status = 'unread' ORDER BY timestamp DESC`;
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

app.post('/add/tag', (req, res) => {
    const { mark_tags } = req.body;  // Ensure you're sending the correct field from the front end

    if (!mark_tags || mark_tags.trim() === '') {
        return res.json({ status: false, message: "Tag name cannot be empty" });
    }

    const table = new DataTable(connection, "tags");
    
    table.insert({ mark_tags }, (result) => {
        if (result) {
            return res.json({ status: true, message: "Tag added successfully" });
        } else {
            return res.json({ status: false, message: "Failed to add tag" });
        }
    });
})

app.get('/get/tag', (req, res) => {
    const table = new DataTable(connection, "tags");
    table.findAll((result) => {
        if (result && result.length > 0) {
            return res.json({ status: true, message: "Data fetched successfully", data: result });
        } else {
            return res.json({ status: false, message: "No data found" });
        }
    })
})




app.listen(8081, () => console.log("Server has been enabled!"));