import { Component } from "react";
import { withRouter } from "react-router";
import Navbar from "../partials/navbar";
import Employee from "./employee";

class Home extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    render() {
        return (
            <div>
                <Navbar />
                <div className="container">
                    <Employee />
                </div>
            </div>
        );
    }
}

export default withRouter(Home);
