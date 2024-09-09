import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./UsePage/homepage.jsx"
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







const App = () => {


return (
        <BrowserRouter>
          <Routes>
            <Route index element={<Home/>}/>
            <Route path="/home" element={<Home />} />
            <Route path="/home/advance" element={<AdvanceSearch />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home/borrow" element={<Borrow />} />


            <Route path="/admin/register" element={<Register />} />
            <Route path="/admin/home" element={<AdminHome />} />
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin/category" element={<Category />} />
            <Route path="/admin/books" element={<Books />} />
            <Route path="/admin/student/record" element={<StudentRecord/>} />
            <Route path="/admin/faculty/record" element={<FacultyRecord/>} />
            <Route path="/admin/account/record" element={<AccountRecord/>} />
          </Routes>
        </BrowserRouter>
  )
}


export default App