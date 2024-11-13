import { BrowserRouter, Route, Routes } from "react-router-dom"
import { createContext, useState, useEffect } from "react";
import Login from "./Auth/login.jsx"
import AdvanceSearch from './UsePage/advance.jsx'
import Borrow from './UsePage/borrow.jsx'
import Profile from "./UsePage/profile.jsx";
import PrivateRoute from "./utils/privateroute.jsx";
import HomePage from "./UsePage/homepage.jsx";
import Dashboard from "./SuperAdmin/Dashboard/dashboard.jsx";
import StudentRegister from './SuperAdmin/Register/student-register.jsx'
import StaffRegister from "./SuperAdmin/Register/staff-register.jsx";
import CategoryRegister from "./SuperAdmin/Category/cat.jsx";
import BookRegister from "./SuperAdmin/Books/book.jsx";
import StaffDashboard from './LibraryStaff/Dashboard/staffdashboard.jsx'
import UserTable from './SuperAdmin/Register/usertable.jsx'
import StaffTable from './SuperAdmin/Register/stafftable.jsx'
import ClientTable from './LibraryStaff/Record/student-rec.jsx'
import FacultyTable from './LibraryStaff/Record/faculty-rec.jsx'
import StaffLogin from './Auth/staff.jsx'
import Category from './LibraryStaff/Categories/Category.jsx'
import Book from './LibraryStaff/Books/book.jsx'
import ScrollToTop from "../src/utils/scroll.jsx";



const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [reservedBooks, setReservedBooks] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  
  

  useEffect(() => {
    const data = localStorage.getItem("isLoggedIn");
    const storedUser = localStorage.getItem("user");
    
    if (data && JSON.parse(data)) {
      const parsedUser = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setUser(parsedUser);

      const userBooks = localStorage.getItem(`reservedBooks_${parsedUser.id}`);
      if (userBooks) {
        setReservedBooks(JSON.parse(userBooks));
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`reservedBooks_${user.id}`, JSON.stringify(reservedBooks));
    }
  }, [reservedBooks, user]);



  const handleLogin = (userData) => {
    const updatedUserData = { ...userData, role: 'admin' };
    setUser(updatedUserData);
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", JSON.stringify(true));
    localStorage.setItem("user", JSON.stringify(updatedUserData));
    const userBooks = localStorage.getItem(`reservedBooks_${updatedUserData.id}`);
    if (userBooks) {
      setReservedBooks(JSON.parse(userBooks));
    } else {
      setReservedBooks([]);
    }
  }

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setReservedBooks([])
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

  }

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem("user", JSON.stringify(updatedUserData));
  };

  const addReservedBook = (book) => {
    if(!user) return;
    setReservedBooks((prevBooks) => {
      const updatedBooks = [...prevBooks, book];
      localStorage.setItem(`reservedBooks_${user.id}`, JSON.stringify(updatedBooks)); 
      return updatedBooks;
    });
  }

  const removeReservedBook = (bookId) => {
    setReservedBooks((prevBooks) => {
      const updatedBooks = prevBooks.filter((book) => book.id !== bookId);
      localStorage.setItem(`reservedBooks_${user.id}`, JSON.stringify(updatedBooks)); 
      return updatedBooks;
    });
  }

  const forceUpdate = useState()[1].bind(null, {});
  const updateBookStatus = (bookId, newStatus) => {
    setReservedBooks((prevBooks) => {
      if(!user) return;
      const updatedBooks = prevBooks.map((book) =>
        book.id === bookId ? { ...book, book_status: newStatus } : book
      );
      localStorage.setItem(`reservedBooks_${user.id}`, JSON.stringify(updatedBooks));
      forceUpdate(); // Force a re-render
      return updatedBooks;
    });
  };


  const triggerBookingSuccess = () => {
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
    }, 3000);
  };


return (
  <AuthContext.Provider value={{ isLoggedIn, handleLogin, handleLogout, user, reservedBooks, addReservedBook, removeReservedBook, bookingSuccess, triggerBookingSuccess, setReservedBooks, updateUser, updateBookStatus }}>
    
    <BrowserRouter>
    <ScrollToTop />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/librarian" element={<StaffLogin />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/home/advance" element={<AdvanceSearch />} />
          <Route path="/home/borrow"element={<Borrow/>}/>


         {/* Super Admin */}
         <Route path="/admin/home/dashboard" element={<Dashboard />} />
          <Route path="/admin/register/client" element={<StudentRegister />} />
          <Route path="/admin/register/staff" element={<StaffRegister />} />
          <Route path="/admin/home/category" element={<CategoryRegister />} />
          <Route path="/admin/home/books" element={<BookRegister />} />
          <Route path="/admin/home/client/table" element={<UserTable />} />
          <Route path="/admin/home/staff/table" element={<StaffTable />} />

          {/* Library Staff */}
          <Route path="/home/dashboard" element={<StaffDashboard />} />
          <Route path="/home/student/borrowing" element={<ClientTable />} />
          <Route path="/home/faculty/borrowing" element={<FacultyTable />} />
          <Route path="/home/staff/category" element={<Category />} />
          <Route path="/home/staff/book" element={<Book />} />



          <Route path="/home/profile" element={<PrivateRoute><Profile /></PrivateRoute>}/>
            



        </Routes>
      </BrowserRouter> 
    </AuthContext.Provider>
  )
}

export const AuthContext = createContext();

export default App