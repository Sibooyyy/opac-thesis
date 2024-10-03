import Header from "./header";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { IoIosNotifications } from "react-icons/io";
import axios from "axios";

const HeaderOption = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showBorrowUserDropdown, setShowBorrowUserDropdown] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const borrowUserDropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  const handleClick = (link) => {
    navigate(link);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleToggleBorrowUserDropdown = () => {
    setShowBorrowUserDropdown(!showBorrowUserDropdown);
  };

  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:8081/admin/notifications');
        const unreadNotifications = response.data.notifications.filter(notification => notification.status === 'unread');
        setNotifications(response.data.notifications);
        setUnreadCount(unreadNotifications.length); 
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await axios.post('http://localhost:8081/admin/notifications/mark-read', { id });
      setNotifications(notifications.map(notification => 
        notification.id === id ? { ...notification, status: 'read' } : notification
      ));
      setUnreadCount(prevCount => prevCount - 1);
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await axios.delete('http://localhost:8081/admin/notifications/delete', { data: { id } });
      setNotifications(notifications.filter(notification => notification.id !== id));
      const deletedNotification = notifications.find(notification => notification.id === id);
      if (deletedNotification.status === 'unread') {
        setUnreadCount(prevCount => prevCount - 1);
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current && !dropdownRef.current.contains(event.target) &&
      showDropdown
    ) {
      setShowDropdown(false);
    }
    if (
      borrowUserDropdownRef.current && !borrowUserDropdownRef.current.contains(event.target) &&
      showBorrowUserDropdown
    ) {
      setShowBorrowUserDropdown(false);
    }
    if (
      notificationsRef.current && !notificationsRef.current.contains(event.target) &&
      showNotifications
    ) {
      setShowNotifications(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown, showBorrowUserDropdown, showNotifications]);

  return (
    <>
      <Header />
      <div className="drop-shadow-md bg-[#F1F1F1] w-full font-poppins uppercase p-8 flex justify-center font-bold">
        <div className="flex items-center justify-between w-full max-w-screen-lg">
          <ul className="flex flex-wrap list-none gap-8 md:gap-16 lg:gap-20 items-center">
            <li className="cursor-pointer underline-animation" onClick={() => handleClick('/admin/home')}>Dashboard</li>
            <li ref={dropdownRef} className="relative cursor-pointer underline-animation" onClick={handleToggleDropdown}>
              Register Account
              {showDropdown && (
                <ul className="absolute bg-white shadow-md p-2 rounded-md w-[170px] flex flex-col gap-2">
                  <li className="text-[14px] cursor-pointer hover:bg-gray-100 p-1" onClick={() => handleClick('/admin/register')}>Add Student</li>
                  <li className="text-[14px] cursor-pointer hover:bg-gray-100 p-1" onClick={() => handleClick('/admin/account/record')}>Account Record</li>
                </ul>
              )}
            </li>
            <li className="cursor-pointer underline-animation" onClick={() => handleClick('/admin/category')}>Categories</li>
            <li className="cursor-pointer underline-animation" onClick={() => handleClick('/admin/books')}>Books</li>
            <li ref={borrowUserDropdownRef} className="relative cursor-pointer underline-animation" onClick={handleToggleBorrowUserDropdown}>
              Borrow Record
              {showBorrowUserDropdown && (
                <ul className="absolute bg-white shadow-md p-2 rounded-md w-[150px] flex flex-col gap-2">
                  <li className="text-[14px] cursor-pointer hover:bg-gray-100 p-1" onClick={() => handleClick('/admin/faculty/record')}>Faculty</li>
                  <li className="text-[14px] cursor-pointer hover:bg-gray-100 p-1" onClick={() => handleClick('/admin/student/record')}>Student</li>
                </ul>
              )}
            </li>
          </ul>
          <li ref={notificationsRef} className="relative cursor-pointer text-[30px] ml-4 flex items-center" onClick={handleToggleNotifications}>
            <div className="relative">
              <IoIosNotifications />
              {unreadCount > 0 && (
                <div className="absolute right-0 top-0 w-5 h-5 bg-red-600 text-white rounded-full text-xs flex items-center justify-center">
                  {unreadCount}
                </div>
              )}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 max-h-80 bg-white shadow-lg rounded-md p-4 text-sm border border-gray-200 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-center text-gray-500">No notifications</p>
                  ) : (
                    <ul className="space-y-2">
                      {notifications.map((notification, index) => (
                        <li
                          key={index}
                          className={`bg-gray-50 hover:bg-gray-100 p-3 rounded-md shadow-sm flex justify-between items-start transition duration-200 ease-in-out ${notification.status === 'read' ? 'opacity-50' : ''}`}
                          onClick={() => handleClick(notification.link)} // Use notification link here
                        >
                          <div className="flex-grow">
                            <p className="text-gray-800 font-semibold">{notification.message}</p>
                            <p className="text-gray-500 text-xs mt-1">ID: {notification.id}</p>
                          </div>
                          <div className="flex flex-col space-y-1">
                            {notification.status === 'unread' && (
                              <button className="text-blue-500 hover:underline text-xs" onClick={(e) => { e.stopPropagation(); handleMarkAsRead(notification.id); }}>
                                Mark as Read
                              </button>
                            )}
                            <button className="text-red-500 hover:underline text-xs" onClick={(e) => { e.stopPropagation(); handleDeleteNotification(notification.id); }}>
                              Delete
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </li>
        </div>
      </div>
    </>
  );
};

export default HeaderOption;
