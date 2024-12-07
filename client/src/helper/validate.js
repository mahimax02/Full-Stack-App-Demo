import toast from "react-hot-toast";

/** validate login page username */
export async function usernameValidate(values) {
    const errors = usernameVerify({}, values);

    return errors;
}

/** validate for password */
export async function passwordValidate(values) {
    const error = passwordVerify({}, values);

    return error;
}

/** validate reset password */
export async function resetPasswordValidation(values) {
    const errors = passwordVerify({}, values);

    if(values.password !== values.confirm_pwd){
        errors.exist = toast.error("Pasword not match...!")
    }
}


/** Validate for Register form */
export async function registerValidation(values) {
    const errors = usernameVerify({}, values);
    passwordVerify(errors, values);
    emailVerify(errors, values);

    return errors;
}

/** Validate profile page */
export async function profileValidation(values) {
    const errors = emailVerify({}, values);
    return errors;
}

/**********************************************  */

/** validate Password */
function passwordVerify(errors = {}, values ){
   
    const specialChars = /^(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).{8,}$/;
   
    if(!values.password) {
        errors.password = toast.error("Password Required...!");
    }else if(values.password.includes(" ")) {
        errors.password=toast.error("Wrong Password...!");
    }else if(values.password.length < 4) {
        errors.password=toast.error("Password must be more than 4 character long")
    }else if(!specialChars.test(values.password)){
        errors.password=toast.error("Password must have special character")
    }
    return errors;
}


/** Validate username */
function usernameVerify(error = {}, values){
    if(!values.username){
        error.username = toast.error('Username Required...!');
    }else if(values.username.includes(" ")) {
        error.username = toast.error('Invalid Username..!')

    }
    return error;
}

/**validate emai */

function emailVerify(error={}, values){
    if(!values.email) {
        error.email = toast.error("Email Required...!");
    }else if(values.email.includes(' ')) {
        error.email = toast.error("Wrong Email...!");
    }else if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(values.email)){
        error.email= toast.error("Invalid email address...!");
    }

    return error;
}