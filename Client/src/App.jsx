import { BrowserRouter, json, Route, Routes } from "react-router-dom"
import { createContext, useState, useEffect } from "react";
import Login from "./Auth/login.jsx"
import Register from "./AdminPage/Register/register.jsx"
import AdvanceSearch from './UsePage/advance.jsx'
import Borrow from './UsePage/borrow.jsx'
import AdminHome from './AdminPage/Admin-Home/admin-home.jsx'
import Category from './AdminPage/Categories/category.jsx'
import Books from './AdminPage/Books/books.jsx'
import StudentRecord from './AdminPage/Record/student-rec.jsx'
import FacultyRecord from './AdminPage/Record/faculty.jsx'
import AccountRecord from './AdminPage/Register/account-record.jsx'
import Profile from "./UsePage/profile.jsx";
import PrivateRoute from "./utils/privateroute.jsx";
import HomePage from "./UsePage/homepage.jsx";




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



  const handleLogin = (data) => {
    setUser(data);
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", JSON.stringify(true));
    localStorage.setItem("user", JSON.stringify(data));
    const userBooks = localStorage.getItem(`reservedBooks_${data.id}`);
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
  const triggerBookingSuccess = () => {
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
    }, 3000);
  };


return (
  <AuthContext.Provider value={{ isLoggedIn, handleLogin, handleLogout, user, reservedBooks, addReservedBook, removeReservedBook, bookingSuccess, triggerBookingSuccess, setReservedBooks, updateUser }}>
    <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/home/advance" element={<AdvanceSearch />} />
          <Route path="/home/borrow"element={<Borrow/>}/>
  

        
          {/* Client protected routes */}

          <Route path="/home/profile" element={<PrivateRoute><Profile /></PrivateRoute>}/>
            
          {/* Admin protected routes */}
          <Route path="/admin/home"element={<PrivateRoute><AdminHome /></PrivateRoute>}/>
          <Route path="/admin/register"element={<PrivateRoute><Register /></PrivateRoute>}/>
          <Route path="/admin/category"element={<PrivateRoute><Category /></PrivateRoute>}/>
          <Route path="/admin/books" element={<PrivateRoute><Books /></PrivateRoute>}/>
          <Route path="/admin/student/record" element={<PrivateRoute><StudentRecord /></PrivateRoute> }/>
          <Route path="/admin/faculty/record"element={<PrivateRoute><FacultyRecord /></PrivateRoute>}/>
          <Route path="/admin/account/record" element={<PrivateRoute><AccountRecord /></PrivateRoute>}/>

        </Routes>
      </BrowserRouter> 
    </AuthContext.Provider>
  )
}

export const AuthContext = createContext();

export default App