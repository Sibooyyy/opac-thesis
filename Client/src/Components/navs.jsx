import { useState, useEffect, useContext, useRef } from "react";
import { FaAngleDown, FaAngleRight, FaRegUserCircle, FaPowerOff } from "react-icons/fa";
import { CiBellOn } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../App";
import Logo from "../assets/candaleria.png";

const Navs = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { handleLogout } = useContext(AuthContext);
  const notificationRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("http://localhost:8081/admin/notifications");
        if (response.data.status) {
          const unreadNotifications = response.data.notifications.filter(
            (notification) => notification.status === "unread"
          );
          setNotifications(response.data.notifications);
          setUnreadCount(unreadNotifications.length);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClick = (link) => {
    navigate(link);
  };

  const logout = () => {
    handleLogout();
    navigate("/home");
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen((prev) => !prev);
  };

  const toggleNotificationDropdown = () => {
    setNotificationDropdownOpen((prev) => !prev);
  };

  const handleNotificationClick = async (id) => {
    try {
      await axios.post("http://localhost:8081/admin/notifications/mark-read", { id });
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id ? { ...notification, status: "read" } : notification
        )
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await axios.delete("http://localhost:8081/admin/notifications/delete", { data: { id } });
      setNotifications((prev) => prev.filter((notification) => notification.id !== id));
      setUnreadCount((prev) =>
        notifications.find((notification) => notification.id === id)?.status ===
        "unread"
          ? Math.max(prev - 1, 0)
          : prev
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center bg-[#292A84] text-white border-b-2 shadow-lg rounded-lg gap-4 md:gap-8 w-full p-4 font-montserrat text-lg font-medium cursor-pointer">
      <div className="flex gap-2 items-center cursor-pointer" onClick={() => handleClick("/home/dashboard")}>
        <img src={Logo} alt="Logo" className="h-12 w-12 md:h-10 md:w-10 rounded-full" />
        <span className="hidden md:block text-sm md:text-[18px]">Library Staff</span>
      </div>
      <div className="flex flex-1 justify-center items-center mt-2 md:mt-0">
        <ul className="flex flex-col md:flex-row gap-4 md:gap-10 items-center text-center text-sm md:text-[16px]">
          <li className="hover:text-blue-500 transition duration-300" onClick={() => handleClick("/home/dashboard")}>
            Dashboard
          </li>
          <li className="relative">
            <div
              className="flex items-center gap-1 hover:text-blue-500 transition duration-300"
              onClick={toggleDropdown}
            >
              Manage Borrowing User <FaAngleDown />
            </div>
            {isDropdownOpen && (
              <ul className="absolute bg-white border rounded shadow-lg mt-2 p-2 w-40 md:w-48 text-sm z-10 text-black">
                <li
                  className="p-2 hover:bg-gray-200 cursor-pointer text-[15px]"
                  onClick={() => handleClick("/home/student/borrowing")}
                >
                  Student Borrowing
                </li>
                <li
                  className="p-2 hover:bg-gray-200 cursor-pointer text-[15px]"
                  onClick={() => handleClick("/home/faculty/borrowing")}
                >
                  Faculty Borrowing
                </li>
                <li
                  className="p-2 hover:bg-gray-200 cursor-pointer text-[15px]"
                  onClick={() => handleClick("/home/staff/borrowing")}
                >
                  Staff Borrowing
                </li>
              </ul>
            )}
          </li>
          <li className="hover:text-blue-500 transition duration-300" onClick={() => handleClick("/home/staff/category")}>
            Category
          </li>
          <li className="hover:text-blue-500 transition duration-300" onClick={() => handleClick("/home/staff/book")}>
            Books
          </li>
        </ul>
        <div className="relative flex gap-4 items-center mt-2 md:mt-0 md:absolute md:right-8">
          <button
            className="relative hover:text-blue-500 transition duration-300"
            onClick={toggleNotificationDropdown}
          >
            <CiBellOn size={24} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                {unreadCount}
              </span>
            )}
          </button>
          {isNotificationDropdownOpen && (
            <div
              ref={notificationRef}
              className="absolute right-0 top-8 w-80 bg-white text-black border rounded shadow-lg z-10"
            >
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">Notifications</h3>
              </div>
              <ul className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-center text-gray-500">No notifications</p>
                ) : (
                  notifications.map((notification) => (
                    <li
                      key={notification.id}
                      className={`p-4 hover:bg-gray-100 cursor-pointer ${
                        notification.status === "read" ? "opacity-50" : ""
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div onClick={() => handleNotificationClick(notification.id)} className="flex-grow">
                          <p className="text-gray-800 font-semibold">{notification.message}</p>
                        </div>
                        <button
                          className="text-red-500 hover:underline text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNotification(notification.id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
          <button className="hover:text-blue-500 transition duration-300" onClick={toggleUserDropdown}>
            <FaRegUserCircle size={24} />
          </button>
          {isUserDropdownOpen && (
            <ul className="absolute bg-white border rounded shadow-lg mt-2 md:mt-[100px] p-2 right-0 w-32 md:w-40 z-10 text-black">
              <li className="p-2 hover:bg-gray-200 cursor-pointer text-[15px] flex items-center gap-2" onClick={logout}>
                <FaPowerOff /> Sign Out
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navs;
