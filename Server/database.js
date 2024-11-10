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
            email VARCHAR(250) NOT NULL,
            designation VARCHAR(255) NOT NULL,
            username VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        )`
    )
    const staff = (
        `CREATE TABLE IF NOT EXISTS staff (
            id INT AUTO_INCREMENT,
            firstname VARCHAR(255) NOT NULL,
            lastname VARCHAR(255) NOT NULL,
            idNumber VARCHAR(255) NOT NULL,
            contactNumber VARCHAR(20) NOT NULL,
            email VARCHAR(250) NOT NULL,
            designation VARCHAR(255) NOT NULL,
            username VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        )`
    )
    const books = (
        `CREATE TABLE IF NOT EXISTS books (
            id INT AUTO_INCREMENT,
            title VARCHAR(255) NOT NULL,
            category VARCHAR(255) NOT NULL,   
            isbn_issn VARCHAR(50) NOT NULL,      
            author VARCHAR(255) NOT NULL,
            subject VARCHAR(255) NOT NULL,
            ddc_class VARCHAR(255) NOT NULL,
            publisher VARCHAR(255) NOT NULL,
            accession_number VARCHAR(50) NOT NULL,
            date_published DATE NOT NULL,
            mark_tags VARCHAR(255) NOT NULL,
            book_status ENUM('available', 'borrowed') DEFAULT 'available',
            status ENUM('active', 'inactive') DEFAULT 'active',
            PRIMARY KEY (id) 
        )`
    )
    const borrowedBooks = (
        `CREATE TABLE IF NOT EXISTS borrowed_books (
            id INT AUTO_INCREMENT,
            book_id INT,
            firstname VARCHAR(255) NOT NULL,
            lastname VARCHAR(255) NOT NULL,
            category VARCHAR(255) NOT NULL,
            designation VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            author VARCHAR(255) NOT NULL,
            isbn_issn VARCHAR(50) NOT NULL,
            idNumber VARCHAR(255) NOT NULL,
            pickup_date DATE NOT NULL,
            booking_date DATE NOT NULL,
            contactNumber VARCHAR(20) NOT NULL,
            status VARCHAR(255) NOT NULL,
            book_status ENUM('reserved', 'borrowed', 'returned') NOT NULL,
            PRIMARY KEY (id)
        )`
    )
    const categories = (
        `CREATE TABLE IF NOT EXISTS categories (
            id INT AUTO_INCREMENT,
            category VARCHAR(255) NOT NULL,
            status ENUM('active', 'inactive') DEFAULT 'active',
            date_update DATE NOT NULL,
            PRIMARY KEY (id)
        )`
    )
    const notification = (
        `CREATE TABLE IF NOT EXISTS notification (
            id INT AUTO_INCREMENT,
            idNumber VARCHAR(255) NOT NULL,
            message TEXT,
            link VARCHAR(255),
            status ENUM('unread', 'read') DEFAULT 'unread',
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY(id)
        )`
    )
    const tags = (
        `CREATE TABLE IF NOT EXISTS tags (
            id INT AUTO_INCREMENT,
            mark_tags VARCHAR(255) NOT NULL,
            PRIMARY KEY (id)
        )`
    )

    
    connection.query(profile, (error) => {
        if(error) throw error;
    });
    connection.query(staff, (error) => {
        if(error) throw error;
    });
    connection.query(books, (error) => {
        if(error) throw error;
    });
    connection.query(borrowedBooks, (error) => {
        if(error) throw error;
    });
    connection.query(categories, (error) => {
        if(error) throw error;
    });
    connection.query(notification, (error) => {
        if(error) throw error;
    });
    connection.query(tags, (error) => {
        if(error) throw error;
    });




}
module.exports = {
    connection,
    initTables,
    connect
}
