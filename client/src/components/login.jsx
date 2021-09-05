import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import Config from "../config/development.json";
import { authenticate, isAuth } from "../services/auth";

const Login = () => {
    const history = useHistory();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        textChange: "Sign In",
    });

    const { name, email, password, textChange } = formData;

    const handleChange = (text) => (e) => {
        setFormData({ ...formData, [text]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
        if (email && password) {
            if (!pattern.test(email)) {
                return toast.error("Please enter valid email");
            }
            setFormData({ ...formData, textChange: "submitting" });
            axios
                .post(`${Config.baseUrl}/authentication`, {
                    strategy: "local",
                    email,
                    password,
                })
                .then((result) => {
                    console.log(result);

                    if (result.data) {
                        authenticate(result.data, () => {
                            setFormData({
                                ...formData,
                                email: "",
                                password: "",
                                textChange: "Submitted",
                            });
                            if (isAuth) {
                                history.push("/home");
                            } else {
                                toast.error("Internal Server Error");
                            }
                        });
                    } else {
                        toast.error("Internal Server Error");
                    }
                })
                .catch((err) => {
                    setFormData({
                        ...formData,
                        email: "",
                        password: "",
                        textChange: "Sign In",
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
                    <h2 className="text-center">Sign In</h2>

                    <form className="register-form" onSubmit={handleSubmit}>
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
                            <Link className="text-success" to="/register">
                                <span className="ml-4">Not registered ?</span>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
