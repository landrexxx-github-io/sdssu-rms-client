import React, { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getDepartment } from '../../../redux/actions/department_action';
import AccountContext from '../../../context/AccountContext';
import moment from 'moment';

const Dashboard = () => {
    const college = useSelector((state) => state.department.departments);
    const dispatch = useDispatch();
    const { userData } = useContext(AccountContext);

    const [firstName, setFirstName] = useState("");

    useEffect(() => {
        if(userData.user !== undefined) {
            const { first_name } = userData.user;
            // SET
            setFirstName(first_name);

            // DISPATCH 
            dispatch(getDepartment());
        }
    }, [dispatch, userData.user]);

    const getGreetingTime = () => {
        let greetings = null;
        const currentHour = moment().format("HH");

        if(currentHour === 0 || currentHour < 12)
            greetings = "Good morning";
        else if(currentHour < 18)
            greetings = "Good afternoon";
        else
            greetings = "Good evening";

        return greetings;
    }

    const getColleges = () => {
        const colleges = [];

        for (let i = 0; i < college.length; i++) {
            colleges.push(
                <option key={college[i]._id} value={college[i]._id}>{college[i].department_code}</option>  
            )
        }

        return colleges;
    }

    return (
        <React.Fragment>
            <div className="page-breadcrumb">
                <div className="row">
                    <div className="col-7 align-self-center">
                    <h3 className="page-title text-truncate text-dark font-weight-medium mb-1">{getGreetingTime()} {firstName}!</h3>
                        <div className="d-flex align-items-center">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb m-0 p-0">
                                    <li className="breadcrumb-item"><a href="index.html">Dashboard</a>
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                    <div className="col-5 align-self-center">
                        <div className="customize-input float-right">
                            <select className="custom-select custom-select-set form-control bg-white border-0 custom-shadow custom-radius">
                                <option>Overall</option>
                                { getColleges() }
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* This is where the content will be displayed. */}
            <div className="container-fluid">
                <div className="card-group">
                    <div className="card border-right">
                        <div className="card-body">
                            <div className="d-flex d-lg-flex d-md-block align-items-center">
                                <div>
                                    <div className="d-inline-flex align-items-center">
                                        <h2 className="text-dark mb-1 font-weight-medium">236</h2>
                                        <span className="badge bg-primary font-12 text-white font-weight-medium badge-pill ml-2 d-lg-block d-md-none">
                                            +18.33%
                                        </span>
                                    </div>
                                    <h6>Proposals</h6>
                                </div>
                                <div></div>
                            </div>
                        </div>
                    </div>
                    <div className="card border-right">
                        <div className="card-body">
                            <div className="d-flex d-lg-flex d-md-block align-items-center">
                                <div>
                                    <div className="d-inline-flex align-items-center">
                                        <h2 className="text-dark mb-1 font-weight-medium">236</h2>
                                        <span className="badge bg-primary font-12 text-white font-weight-medium badge-pill ml-2 d-lg-block d-md-none">
                                            +18.33%
                                        </span>
                                    </div>
                                    <h6>Completed</h6>
                                </div>
                                <div></div>
                            </div>
                        </div>
                    </div>
                    <div className="card border-right">
                        <div className="card-body">
                            <div className="d-flex d-lg-flex d-md-block align-items-center">
                                <div>
                                    <div className="d-inline-flex align-items-center">
                                        <h2 className="text-dark mb-1 font-weight-medium">236</h2>
                                        <span className="badge bg-primary font-12 text-white font-weight-medium badge-pill ml-2 d-lg-block d-md-none">
                                            +18.33%
                                        </span>
                                    </div>
                                    <h6>Presentations</h6>
                                </div>
                                <div></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row-fluid">
                    <div className="card-group">
                        <div className="card border-right">
                            <div className="card-body">
                                <div className="d-flex d-lg-flex d-md-block align-items-center">
                                    <div>
                                        <div className="d-inline-flex align-items-center">
                                            <h2 className="text-dark mb-1 font-weight-medium">236</h2>
                                            <span className="badge bg-primary font-12 text-white font-weight-medium badge-pill ml-2 d-lg-block d-md-none">
                                                +18.33%
                                            </span>
                                        </div>
                                        <h6>Publications</h6>
                                    </div>
                                    <div></div>
                                </div>
                            </div>
                        </div>
                        <div className="card border-right">
                            <div className="card-body">
                                <div className="d-flex d-lg-flex d-md-block align-items-center">
                                    <div>
                                        <div className="d-inline-flex align-items-center">
                                            <h2 className="text-dark mb-1 font-weight-medium">236</h2>
                                            <span className="badge bg-primary font-12 text-white font-weight-medium badge-pill ml-2 d-lg-block d-md-none">
                                                +18.33%
                                            </span>
                                        </div>
                                        <h6>Utilizations</h6>
                                    </div>
                                    <div></div>
                                </div>
                            </div>
                        </div>
                        <div className="card border-right">
                            <div className="card-body">
                                <div className="d-flex d-lg-flex d-md-block align-items-center">
                                    <div>
                                        <div className="d-inline-flex align-items-center">
                                            <h2 className="text-dark mb-1 font-weight-medium">236</h2>
                                            <span className="badge bg-primary font-12 text-white font-weight-medium badge-pill ml-2 d-lg-block d-md-none">
                                                +18.33%
                                            </span>
                                        </div>
                                        <h6>Innovations</h6>
                                    </div>
                                    <div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row-fluid">
                    <h5 className="font-weight-medium">Faculty's Percentage</h5>
                    <div className="card-group">
                        <div className="card border-right">
                            <div className="card-body">
                                <div className="d-flex d-lg-flex d-md-block align-items-center">
                                    <div>
                                        <div className="d-inline-flex align-items-center">
                                            <h2 className="text-dark mb-1 font-weight-medium">1/2</h2>
                                            <span className="badge bg-primary font-12 text-white font-weight-medium badge-pill ml-2 d-lg-block d-md-none">
                                                +18.33%
                                            </span>
                                        </div>
                                        <h6>Proposals</h6>
                                    </div>
                                    <div></div>
                                </div>
                            </div>
                        </div>
                        <div className="card border-right">
                            <div className="card-body">
                                <div className="d-flex d-lg-flex d-md-block align-items-center">
                                    <div>
                                        <div className="d-inline-flex align-items-center">
                                            <h2 className="text-dark mb-1 font-weight-medium">3/4</h2>
                                            <span className="badge bg-primary font-12 text-white font-weight-medium badge-pill ml-2 d-lg-block d-md-none">
                                                +18.33%
                                            </span>
                                        </div>
                                        <h6>Completed</h6>
                                    </div>
                                    <div></div>
                                </div>
                            </div>
                        </div>
                        <div className="card border-right">
                            <div className="card-body">
                                <div className="d-flex d-lg-flex d-md-block align-items-center">
                                    <div>
                                        <div className="d-inline-flex align-items-center">
                                            <h2 className="text-dark mb-1 font-weight-medium">236</h2>
                                            <span className="badge bg-primary font-12 text-white font-weight-medium badge-pill ml-2 d-lg-block d-md-none">
                                                +18.33%
                                            </span>
                                        </div>
                                        <h6>Presentations</h6>
                                    </div>
                                    <div></div>
                                </div>
                            </div>
                        </div>
                        <div className="card border-right">
                            <div className="card-body">
                                <div className="d-flex d-lg-flex d-md-block align-items-center">
                                    <div>
                                        <div className="d-inline-flex align-items-center">
                                            <h2 className="text-dark mb-1 font-weight-medium">236</h2>
                                            <span className="badge bg-primary font-12 text-white font-weight-medium badge-pill ml-2 d-lg-block d-md-none">
                                                +18.33%
                                            </span>
                                        </div>
                                        <h6>Publications</h6>
                                    </div>
                                    <div></div>
                                </div>
                            </div>
                        </div>
                        <div className="card border-right">
                            <div className="card-body">
                                <div className="d-flex d-lg-flex d-md-block align-items-center">
                                    <div>
                                        <div className="d-inline-flex align-items-center">
                                            <h2 className="text-dark mb-1 font-weight-medium">236</h2>
                                            <span className="badge bg-primary font-12 text-white font-weight-medium badge-pill ml-2 d-lg-block d-md-none">
                                                +18.33%
                                            </span>
                                        </div>
                                        <h6>Utilizations</h6>
                                    </div>
                                    <div></div>
                                </div>
                            </div>
                        </div>
                        <div className="card border-right">
                            <div className="card-body">
                                <div className="d-flex d-lg-flex d-md-block align-items-center">
                                    <div>
                                        <div className="d-inline-flex align-items-center">
                                            <h2 className="text-dark mb-1 font-weight-medium">236</h2>
                                            <span className="badge bg-primary font-12 text-white font-weight-medium badge-pill ml-2 d-lg-block d-md-none">
                                                +18.33%
                                            </span>
                                        </div>
                                        <h6>Innovations</h6>
                                    </div>
                                    <div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </React.Fragment>
    )
}

export default Dashboard;
