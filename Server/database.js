const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'opac'
});

const connect = () => {
    connection.connect(error => {
        if(error) throw error;
        initTables();
        console.log('Connected to database!')
    });
}

const initTables = () => {

    const profile = (
        `CREATE TABLE IF NOT EXISTS profile (
            id INT AUTO_INCREMENT,
            firstname VARCHAR(255) NOT NULL,
            lastname VARCHAR(255) NOT NULL,
            idNumber VARCHAR(255) NOT NULL,
            contactNumber VARCHAR(20) NOT NULL,
            designation VARCHAR(255) NOT NULL,
            username VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            PRIMARY KEY (id),
            UNIQUE KEY (username),
            UNIQUE KEY (idNumber)
        )`
    )
    const books = (
        `CREATE TABLE IF NOT EXISTS books (
            id INT AUTO_INCREMENT,
            title VARCHAR(255) NOT NULL,
            category VARCHAR(255) NOT NULL,
            isbn_issn VARCHAR(50) NOT NULL,
            author VARCHAR(255) NOT NULL,
            publisher VARCHAR(255) NOT NULL,
            accession_number VARCHAR(50) NOT NULL,
            date_published DATE NOT NULL,
            PRIMARY KEY (id)
        )`
    )
    const borrowedBooks = (
        `CREATE TABLE IF NOT EXISTS borrowed_books (
            id INT AUTO_INCREMENT,
            accession_number VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            date_pubslished DATE NOT NULL,
            idNumber VARCHAR(255) NOT NULL,
            pickup_date DATE NOT NULL,
            contactNumber VARCHAR(20) NOT NULL,
            PRIMARY KEY (id)
        )`
    )
    
    
    
    connection.query(profile, (error) => {
        if(error) throw error;
    });
    connection.query(books, (error) => {
        if(error) throw error;
    });
    connection.query(borrowedBooks, (error) => {
        if(error) throw error;
    });
}
module.exports = {
    connection,
    initTables,
    connect
}