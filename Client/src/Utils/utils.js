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
        title: "",
        category: "",
        isbn_issn: "",
        author: "",
        publisher: "",
        accession_number: "",
        date_published: "",
    }
}

export const profileData = (id, firstname, last, idNumber, contact, designation, token, avatar, url,   []) => {
    return {id, firstname, last, idNumber, contact, designation, token, avatar, url};
}

export const fetchProfile = (data) => {
    const {id, firstname, last, idNumber, contact, designation, token, avatar, url} = data;
    return profileData(id, firstname, last, idNumber, contact, designation, token, avatar, url);
}


