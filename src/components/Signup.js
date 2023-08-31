import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Signup(props) {
  const [credentials, setCredentials] = useState({name:"", email: "", password: "", cpassword: ""});
  const navigate = useNavigate();

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    // API CALL
//     const response = await ("https://noteit-backend-blje.onrender.com/api/auth/createuser", {
//         method: "POST", // *GET, POST, PUT, DELETE, etc.
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({name:credentials.name, email: credentials.email, password: credentials.password }), // body data type must match "Content-Type" header
//     });
//     const json = await response.json();
//     console.log(json);

//     if(json.success){
//         // Save the auth-token and redirect
//         localStorage.setItem('token', json.authtoken)
//         navigate('/');
//         props.showAlert("Account created successfully.","success ")
//     }else{
//         props.showAlert("Invalid Details.","danger")
//     }
// }
try {
    const response = await fetch("https://noteit-backend-blje.onrender.com/api/auth/createuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: credentials.name,
        email: credentials.email,
        password: credentials.password
      })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const json = await response.json();
    console.log(json);

    if (json.success) {
      // Save the auth-token and redirect
      localStorage.setItem('token', json.authtoken);
      navigate('/');
      props.showAlert("Account created successfully.", "success");
    } else {
      props.showAlert("Invalid Details.", "danger");
    }
  } catch (error) {
    console.error("Error:", error);
    props.showAlert("An error occurred.", "danger");
  }
};

const onChange = (e) => {
  setCredentials({ ...credentials, [e.target.name]: e.target.value });
}

  return (
    <div className='container'>
        <h2 className='my-3'>Singnup to use to NoteIt.</h2>
        <form onSubmit={handleOnSubmit}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input type="text" className="form-control" id="name" name='name' value={credentials.name} onChange={onChange} aria-describedby="emailHelp" />
            </div>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" className="form-control" id="email" name='email' value={credentials.email} onChange={onChange} aria-describedby="emailHelp" />
                <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" name='password' value={credentials.password} onChange={onChange} minLength={5} required />
            </div>
            <div className="mb-3">
                <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                <input type="password" className="form-control" id="cpassword" name='cpassword' value={credentials.cpassword} onChange={onChange} minLength={5} required />

                {credentials.password !== credentials.cpassword && <div id="emailHelp" className="form-text">Please enter same password in Password and Confirm Password field.</div> }
            </div>
            <button disabled={credentials.password !== credentials.cpassword} type="submit" className="btn btn-primary">Submit</button>
        </form>
    </div>
  )
}

export default Signup
