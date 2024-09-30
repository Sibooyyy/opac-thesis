
import axios from 'axios';
import moment from 'moment';

export const registrationForm = () => {
    return {
        firstname: "",
        lastname: "",
        idNumber: "",
        contactNumber: "",
        designation: "",
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
