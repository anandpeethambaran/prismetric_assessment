import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import axios from "axios";
import Config from "../config/development.json";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        textChange: "Sign Up",
    });

    const { name, email, password, textChange } = formData;

    const handleChange = (text) => (e) => {
        setFormData({ ...formData, [text]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
        if (name && email && password) {
            if (!pattern.test(email)) {
                return toast.error("Please enter valid email");
            }

            setFormData({ ...formData, textChange: "submitting" });
            axios
                .post(`${Config.baseUrl}/users`, {
                    name,
                    email,
                    password,
                })
                .then((result) => {
                    setFormData({
                        ...formData,
                        name: "",
                        email: "",
                        password: "",
                        textChange: "Submitted",
                    });
                    if (result.data) {
                        toast.success("Account added. Please Login!");
                    }
                    setFormData({
                        ...formData,
                        name: "",
                        email: "",
                        password: "",
                        textChange: "Sign Up",
                    });
                })
                .catch((err) => {
                    setFormData({
                        ...formData,
                        name: "",
                        email: "",
                        password: "",
                        textChange: "Sign Up",
                    });
                    console.log(err.response);
                    toast.error(err.response.data.message);
                });
        } else {
            toast.error("Please fill required fields");
        }
    };

    return (
        <div className="container form-wrapper-register">
            <ToastContainer />
            <div className="row">
                <div className="col-md-12">
                    <h2 className="text-center">Sign Up</h2>

                    <form className="register-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input className="form-control" type="text" placeholder="Enter Name" onChange={handleChange("name")} value={name} />
                        </div>

                        <div className="form-group">
                            <input className="form-control" type="text" placeholder="Enter Email" onChange={handleChange("email")} value={email} />
                        </div>
                        <div className="form-group">
                            <input className="form-control" type="password" placeholder="Enter Password" onChange={handleChange("password")} value={password} />
                        </div>

                        <div className="form-group">
                            <button type="submit" className="btn btn-success btn-block login-btn">
                                <i className="fas fa-user-plus fa 1x w-6 -ml-2" />
                                <span className="ml-3">{textChange}</span>
                            </button>
                        </div>

                        <div className="message hint-text small">
                            <Link className="text-success" to="/">
                                <span className="ml-4">Already Member</span>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
