import { Component } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Table, Button } from "react-bootstrap";
import { withRouter } from "react-router";
import { getCookie, signOut } from "../services/auth";
import axios from "axios";
import config from "../config/development.json";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

class Employee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            employeeId: "",
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            salary: "",
            employeeList: [],
            newForm: false,
            updateForm: false,
            bonusCard: false,
            bonusData: {},
        };
    }

    componentDidMount() {
        this.getEmployeeList();
    }

    closeform = () => {
        this.setState({
            newForm: false,
            updateForm: false,
            bonusCard: false,
            bonusData: {},
        });
    };

    getEmployeeList() {
        const token = getCookie("token");
        if(!token){
            return this.props.history.push('/')
        }
        axios
            .get(`${config.baseUrl}/employee`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((result) => {
                console.log(result.data);
                if (result.data.total > 0) {
                    this.setState({ employeeList: result.data.data });
                } else {
                    this.setState({ employeeList: [] });
                }
            })
            .catch((err) => {
                console.log(err.response);
                toast.error(err.response.data.message);
                if (err.response.data.code === 401) {
                    signOut(() => {
                        this.props.history.push("/");
                    });
                }
            });
    }

    showEditForm = (id, type) => {
        this.setState({
            newForm: false,
            updateForm: type === "edit" ? true : false,
            bonusCard: type === "bonus" ? true : false,
        });
        const token = getCookie("token");
        if(!token){
            return this.props.history.push('/')
        }
        axios
            .get(`${config.baseUrl}/employee/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((result) => {
                const { data } = result;
                console.log(data);
                if (data) {
                    this.setState({
                        id: data._id,
                        employeeId: data.employeeId,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        phone: data.phone,
                        salary: data.salary,
                    });
                    if (type === "bonus") {
                        let { salary } = data;
                        salary = parseInt(salary);
                        let bonus;
                        if (salary <= 10000) {
                            bonus = 7.5;
                        } else if (salary > 10000 && salary <= 20000) {
                            bonus = 15;
                        } else if (salary > 20000) {
                            bonus = 18;
                        }
                        let bonusAmount = parseFloat((salary * bonus) / 100);
                        let totalAmount = salary + bonusAmount;
                        let bonusData = {
                            salary,
                            bonus,
                            bonusAmount,
                            totalAmount,
                        };
                        this.setState({
                            bonusData: bonusData,
                        });
                    }
                } else {
                    toast.error("Internal Server Error");
                }
            })
            .catch((err) => {
                console.log(err.response);
                toast.error(err.response.data.message);
                if (err.response.data.code === 401) {
                    signOut(() => {
                        this.props.history.push("/");
                    });
                }
            });
    };

    showNewForm = () => {
        this.setState({
            id: "",
            employeeId: "",
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            salary: "",
            newForm: true,
            updateForm: false,
            bonusCard: false,
            bonusData: {},
        });
    };

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const token = getCookie("token");
        if(!token){
            return this.props.history.push('/')
        }
        let pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
        const empObj = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            phone: this.state.phone,
            salary: this.state.salary,
        };
        if (empObj.firstName === "" || !empObj.firstName) {
            return toast.error("Please enter first name");
        }
        if (empObj.email === "" || !empObj.email) {
            return toast.error("Please enter Email");
        }
        if (empObj.phone === "" || !empObj.phone) {
            return toast.error("Please enter Phone");
        }
        if (empObj.salary === "" || !empObj.salary) {
            return toast.error("Please enter Salary");
        }

        if (!pattern.test(empObj.email)) {
            return toast.error("Please enter valid email");
        }

        if (this.state.updateForm) {
            confirmAlert({
                title: "Confirm",
                message: "Sure to update employee?",
                buttons: [
                    {
                        label: "Yes",
                        onClick: () => {
                            axios
                                .patch(`${config.baseUrl}/employee/${this.state.id}`, empObj, {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                })
                                .then((result) => {
                                    const { data } = result;
                                    console.log(data);
                                    if (data) {
                                        this.setState({
                                            id: "",
                                            employeeId: "",
                                            firstName: "",
                                            lastName: "",
                                            email: "",
                                            phone: "",
                                            salary: "",
                                        });
                                        this.closeform();
                                        this.getEmployeeList();
                                        return toast.success("Update Succefull");
                                    } else {
                                        toast.error("Internal Server Error");
                                    }
                                })
                                .catch((err) => {
                                    console.log(err.response);
                                    toast.error(err.response.data.message);
                                    if (err.response.data.code === 401) {
                                        signOut(() => {
                                            this.props.history.push("/");
                                        });
                                    }
                                });
                        },
                    },
                    {
                        label: "No",
                    },
                ],
            });
        }
        if (this.state.newForm) {
            axios
                .post(`${config.baseUrl}/employee`, empObj, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((result) => {
                    const { data } = result;
                    console.log(data);
                    if (data) {
                        this.setState({
                            id: "",
                            employeeId: "",
                            firstName: "",
                            lastName: "",
                            email: "",
                            phone: "",
                            salary: "",
                        });
                        this.closeform();
                        this.getEmployeeList();
                        return toast.success("Employee added");
                    } else {
                        toast.error("Internal Server Error");
                    }
                })
                .catch((err) => {
                    console.log(err.response);
                    toast.error(err.response.data.message);
                    if (err.response.data.code === 401) {
                        signOut(() => {
                            this.props.history.push("/");
                        });
                    }
                });
        }
    };

    deleteEmployee(id) {
        const token = getCookie("token");
        if(!token){
            return this.props.history.push('/')
        }
        axios
            .delete(`${config.baseUrl}/employee/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((result) => {
                const { data } = result;
                console.log(data);
                if (data) {
                    this.setState({
                        id: "",
                        employeeId: "",
                        firstName: "",
                        lastName: "",
                        email: "",
                        phone: "",
                        salary: "",
                    });
                    this.closeform();
                    this.getEmployeeList();
                    return toast.success("Employee Deleted");
                } else {
                    toast.error("Internal Server Error");
                }
            })
            .catch((err) => {
                console.log(err.response);
                toast.error(err.response.data.message);
                if (err.response.data.code === 401) {
                    signOut(() => {
                        this.props.history.push("/");
                    });
                }
            });
    }

    render() {
        const { employeeList, updateForm, newForm, bonusCard } = this.state;

        let formHead;
        let submitButton;
        if (updateForm) {
            formHead = "Edit Details";
            submitButton = "Update";
        }
        if (newForm) {
            formHead = "Add Employee";
            submitButton = "Add";
        }
        return (
            <div>
                <div className="container">
                    <ToastContainer />
                    {(updateForm || newForm) && (
                        <div className="form-wrapper-register" style={{ marginTop: "10px" }}>
                            <div className="row">
                                <div className="card col-md-4">
                                    <h4 style={{ textAlign: "center" }}>
                                        {formHead}
                                        <button onClick={this.closeform} className="btn btn-danger float-right btn-sm login-btn">
                                            <i className="fa fa-times" />
                                        </button>
                                    </h4>
                                    <form className="register-form" onSubmit={this.handleSubmit}>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <input type="hidden" value={this.state.id} />
                                                <div className="form-group">
                                                    <input type="text" className="form-group" name="employeeId" disabled="disabled" value={this.state.employeeId} />
                                                </div>
                                                <div className="form-group">
                                                    <input type="text" className="form-group" name="firstName" placeholder="First Name" value={this.state.firstName} onChange={this.handleChange} />
                                                </div>
                                                <div className="form-group">
                                                    <input type="text" className="form-group" name="lastName" placeholder="Last Name" value={this.state.lastName} onChange={this.handleChange} />
                                                </div>
                                                <div className="form-group">
                                                    <input type="text" className="form-group" name="email" placeholder="Email" value={this.state.email} onChange={this.handleChange} />
                                                </div>
                                                <div className="form-group">
                                                    <input type="text" className="form-group" name="phone" placeholder="Phone" value={this.state.phone} onChange={this.handleChange} />
                                                </div>
                                                <div className="form-group">
                                                    <input type="text" className="form-group" name="salary" placeholder="Salary" value={this.state.salary} onChange={this.handleChange} />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <button type="submit" className="btn btn-success btn-block login-btn">
                                                        <span>{submitButton}</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                    {bonusCard && (
                        <div className="form-wrapper-register" style={{ marginTop: "10px" }}>
                            <div className="row">
                                <div className="card col-md-4">
                                    <h4 style={{ textAlign: "center" }}>
                                        Bonus Details
                                        <button onClick={this.closeform} className="btn btn-danger float-right btn-sm login-btn">
                                            <i className="fa fa-times" />
                                        </button>
                                    </h4>
                                    <form className="register-form" onSubmit={this.handleSubmit}>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <p className="font-italic text-muted mb-0">
                                                        Name : {this.state.firstName} {this.state.lastName}!
                                                    </p>
                                                </div>
                                                <div className="form-group">
                                                    <p className="font-italic text-muted mb-0">Current Salary : {this.state.salary}</p>
                                                </div>
                                                <div className="form-group">
                                                    <p className="font-italic text-muted mb-0">Bonus : {this.state.bonusData.bonus}%</p>
                                                </div>
                                                <div className="form-group">
                                                    <p className="font-italic text-muted mb-0">Bonus amount : {this.state.bonusData.bonusAmount}</p>
                                                </div>
                                                <div className="form-group">
                                                    <p className="font-italic text-muted mb-0">Total : {this.state.bonusData.totalAmount}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                    <button onClick={() => this.showNewForm()} className="btn btn-danger float-right" style={{ marginLeft: "15px" }}>
                        Add
                    </button>
                    <div className="card" style={{ marginTop: "10px" }}>
                        <h4 style={{ textAlign: "center" }}>Employee List</h4>

                        <Table stripped bordered hover responsive="sm">
                            <thead>
                                <tr>
                                    <th>Emp Id</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Salary</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employeeList &&
                                    employeeList.map((employee, i) => {
                                        return (
                                            <tr>
                                                <td>{employee.employeeId}</td>
                                                <td>{employee.firstName}</td>
                                                <td>{employee.lastName}</td>
                                                <td>{employee.email}</td>
                                                <td>{employee.phone}</td>
                                                <td>{employee.salary}</td>
                                                <td>
                                                    <Button onClick={() => this.showEditForm(employee._id, "bonus")} className="btn btn-Primary btn-sm">
                                                        Bonus
                                                    </Button>
                                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                                    <Button onClick={() => this.showEditForm(employee._id, "edit")} className="btn btn-primary btn-sm">
                                                        Edit
                                                    </Button>
                                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                                    <Button
                                                        onClick={() =>
                                                            confirmAlert({
                                                                title: "Confirm",
                                                                message: "Sure to remove?",
                                                                buttons: [
                                                                    {
                                                                        label: "Yes",
                                                                        onClick: () => this.deleteEmployee(employee._id),
                                                                    },
                                                                    {
                                                                        label: "No",
                                                                    },
                                                                ],
                                                            })
                                                        }
                                                        className="btn btn-danger btn-sm"
                                                    >
                                                        Delete
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Employee);
