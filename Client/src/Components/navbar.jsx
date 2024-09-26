import Header from "./header";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { IoIosNotifications } from "react-icons/io";
import { AuthContext } from "../App";
import axios from "axios";

const HeaderOption = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0); // Track unread count separately
  const [showNotifications, setShowNotifications] = useState(false);

  const navigate = useNavigate();
  const handleClick = (link) => { navigate(link); };
  const [showDropdown, setShowDropdown] = useState(false);
  const [showBorrowUserDropdown, setShowBorrowUserDropdown] = useState(false);
  const handleToggleDropdown = () => setShowDropdown(!showDropdown);
  const handleToggleBorrowUserDropdown = () => { setShowBorrowUserDropdown(!showBorrowUserDropdown); };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:8081/admin/notifications');
        const unreadNotifications = response.data.notifications.filter(notification => notification.status === 'unread');
        setNotifications(response.data.notifications);
        setUnreadCount(unreadNotifications.length); // Set unread count
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axios.post('http://localhost:8081/admin/notifications/mark-read', { id });
      // Update the state to change the status of the specific notification to "read"
      setNotifications(notifications.map(notification => 
        notification.id === id ? { ...notification, status: 'read' } : notification
      ));
      setUnreadCount(prevCount => prevCount - 1); // Decrease the unread count
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await axios.delete('http://localhost:8081/admin/notifications/delete', { data: { id } });
      setNotifications(notifications.filter(notification => notification.id !== id));
      // Decrease unread count only if the deleted notification was unread
      const deletedNotification = notifications.find(notification => notification.id === id);
      if (deletedNotification.status === 'unread') {
        setUnreadCount(prevCount => prevCount - 1);
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="drop-shadow-md bg-[#F1F1F1] w-full font-poppins uppercase p-8 flex justify-center font-bold">
        <ul className="flex flex-wrap justify-between list-none gap-8 md:gap-16 lg:gap-20">
          <li className="cursor-pointer" onClick={() => handleClick('/admin/home')}>Dashboard</li>
          <li className="relative cursor-pointer" onClick={handleToggleDropdown}>Register Account
            {showDropdown && (
              <ul className="absolute bg-white shadow-md p-2 rounded-md w-[170px] flex flex-col gap-2">
                <li className="text-[14px] cursor-pointer hover:bg-gray-100 p-1" onClick={() => handleClick('/admin/register')}>Add Student</li>
                <li className="text-[14px] cursor-pointer hover:bg-gray-100 p-1" onClick={() => handleClick('/admin/account/record')}>Account Record</li>
              </ul>
            )}
          </li>
          <li className="cursor-pointer" onClick={() => handleClick('/admin/category')}>Categories</li>
          <li className="cursor-pointer" onClick={() => handleClick('/admin/books')}>Books</li>
          <li className="relative cursor-pointer" onClick={handleToggleBorrowUserDropdown}>Borrow User
            {showBorrowUserDropdown && (
              <ul className="absolute bg-white shadow-md p-2 rounded-md w-[150px] flex flex-col gap-2">
                <li className="text-[14px]  cursor-pointer hover:bg-gray-100 p-1" onClick={() => handleClick('/admin/faculty/record')}>Faculty</li>
                <li className="text-[14px] cursor-pointer hover:bg-gray-100 p-1" onClick={() => handleClick('/admin/student/record')}>Student</li>
              </ul>
            )}
          </li>
          <li className="relative cursor-pointer text-[30px]" onClick={handleToggleNotifications}>
            <IoIosNotifications />
            {unreadCount > 0 && ( 
              <div className="absolute right-0 top-0 w-5 h-5 bg-red-600 text-white rounded-full text-xs flex items-center justify-center">
                {unreadCount}
              </div>
            )}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-md p-4 text-sm border border-gray-200">
                {notifications.length === 0 ? (
                  <p className="text-center text-gray-500">No notifications</p>
                ) : (
                  <ul className="space-y-2">
                    {notifications.map((notification, index) => (
                      <li
                        key={index}
                        className={`bg-gray-50 hover:bg-gray-100 p-3 rounded-md shadow-sm flex justify-between items-start transition duration-200 ease-in-out ${
                          notification.status === 'read' ? 'opacity-50' : ''
                        }`}
                      >
                        <div className="flex-grow">
                          <p className="text-gray-800 font-semibold">{notification.message}</p>
                          <p className="text-gray-500 text-xs mt-1">ID: {notification.id}</p>
                        </div>
                        <div className="flex flex-col space-y-1">
                          {notification.status === 'unread' && (
                            <button
                              className="text-blue-500 hover:underline text-xs"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              Mark as Read
                            </button>
                          )}
                          <button
                            className="text-red-500 hover:underline text-xs"
                            onClick={() => handleDeleteNotification(notification.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </li>
        </ul>
      </div>
    </>
  );
};

export default HeaderOption;
