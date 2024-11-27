
import axios from 'axios';
import moment from 'moment';

export const registrationForm = () => {
    return {
        firstname: "",
        lastname: "",
        idNumber: "",
        contactNumber: "",
        email: "",
        designation: "",
        position: "",
        username: "",
        password: "",
        confirm_password: ""
    }
}

export const loginForm = () => {
    return {
        username: "",
        password: ""
    }
}


export const bookForm = () => {
    return {
        id: "",
        title: "",
        subject: "",
        ddc_class: "",
        category: "",
        isbn_issn: "",
        author: "",
        publisher: "",
        accession_number: "",
        tag: "",
        date_published: "",
        status: "",
        date_update: "",
        mark_tags: []
    }
}


export const fetchData = async (url, setData, setLoading, setError) => {
    setLoading(true);
    try {
      const response = await axios.get(url);
      if (response.data.status) {
        setData(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to format dates using moment
  export const formatDate = (date, fallback = 'No data') => {
    return date ? moment(date).format('MM-DD-YYYY') : fallback ? moment(date).format('YYYY-MM-DD') : fallback;
  };


export const generateRandomPassword = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};