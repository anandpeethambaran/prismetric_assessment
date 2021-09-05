import React from "react";
import { withRouter } from "react-router-dom";
import { signOut } from "../services/auth";
import "./navbar.css";

const Navbar = ({ history }) => {
    const SignOut = () => {
        signOut(() => {
            history.push("/");
        });
    };

    return (
        <div>
            <nav>
                <div className="container">
                    <div className="navbar-header">
                        <p style={{ color: "white", padding: "5px", fontSize: "30px" }}>Employee Details</p>
                    </div>
                </div>
                <ul className="nav-links">
                    <div>
                        <button onClick={SignOut} className="btn btn-danger float-right" style={{marginRight : "15px"}}>
                            Logout
                        </button>
                    </div>
                </ul>
            </nav>
        </div>
    );
};

export default withRouter(Navbar);
