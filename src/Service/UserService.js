import axios from "axios";

const UserService = {
    signUp: (values) => {
        const user = {
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
            password: values.password,
        };
        axios.post('http://localhost:5000/users/signup', user)
            .then(response => {
                if (response.data.existed) {
                    console.log('existed');
                } else {
                    console.log('registered');
                }
            });
    }
}
