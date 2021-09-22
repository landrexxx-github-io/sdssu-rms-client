import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getProposal } from "../../../../redux/actions/proposal_action";
import { getProposalCompleted } from "../../../../redux/actions/completed_action";
import { getPresentation } from "../../../../redux/actions/presentation_action";
import { getPublication } from "../../../../redux/actions/publication_action";
import { getUtilization } from "../../../../redux/actions/utilization_action";
import { getInnovation } from "../../../../redux/actions/innovation_action";

import AccountContext from "../../../../context/AccountContext";
import moment from "moment";

const USER_TYPE = {
    USR: "user",
    ADMIN: "admin",
    RD: "rd", //? research director
    RH: "rh", //? research head
    CD: "cd", //? campus director
};

const Faculties = ({ currentUser }) => {
    const proposal = useSelector((state) => state.proposal.proposals);
    const completed = useSelector((state) => state.completed.completed);
    const presentation = useSelector(
        (state) => state.presentation.presentations
    );
    const publication = useSelector((state) => state.publication.publications);
    const utilization = useSelector((state) => state.utilization.utilizations);
    const innovation = useSelector((state) => state.innovation.innovations);

    const dispatch = useDispatch();

    const { userData } = useContext(AccountContext);
    const [firstName, setFirstName] = useState("");

    useEffect(() => {
        if (userData.user !== undefined) {
            const { first_name } = userData.user;
            setFirstName(first_name);
        }

        dispatch(getProposal());
        dispatch(getProposalCompleted());
        dispatch(getPresentation());
        dispatch(getPublication());
        dispatch(getUtilization());
        dispatch(getInnovation());
    }, [dispatch, userData.user]);

    const getGreetingTime = () => {
        let greetings = null;
        const currentHour = moment().format("HH");

        if (currentHour === 0 || currentHour < 12) greetings = "Good morning";
        else if (currentHour < 18) greetings = "Good afternoon";
        else greetings = "Good evening";

        return greetings;
    };

    const getTotalProposal = () => {
        let numOfProposal = proposal.filter((prop) => {
            return (
                prop.created_by.user_type === USER_TYPE.USR &&
                prop.created_by.user_id === currentUser.id
            );
        });

        return numOfProposal.length;
    };

    const getTotalCompleted = () => {
        let numOfCompleted = completed.filter((prop) => {
            return (
                prop.created_by.user_type === USER_TYPE.USR &&
                prop.created_by.user_id === currentUser.id &&
                (prop.is_completed === "N" || prop.is_completed === "Y")
            );
        });

        return numOfCompleted.length;
    };

    const getTotalPresented = () => {
        let numOfPresented = presentation.filter((prop) => {
            return (
                prop.created_by.user_type === USER_TYPE.USR &&
                prop.created_by.user_id === currentUser.id &&
                (prop.is_completed === "N" || prop.is_completed === "Y")
            );
        });

        return numOfPresented.length;
    };

    const getTotalPublished = () => {
        let numOfPublished = publication.filter((prop) => {
            return (
                prop.created_by.user_type === USER_TYPE.USR &&
                prop.created_by.user_id === currentUser.id &&
                (prop.is_completed === "N" || prop.is_completed === "Y")
            );
        });

        return numOfPublished.length;
    };

    const getTotalUtilized = () => {
        let numOfUtilized = utilization.filter((prop) => {
            return (
                prop.created_by.user_type === USER_TYPE.USR &&
                prop.created_by.user_id === currentUser.id &&
                (prop.is_completed === "N" || prop.is_completed === "Y")
            );
        });

        return numOfUtilized.length;
    };

    const getTotalInnovated = () => {
        let numOfInnovated = innovation.filter((prop) => {
            return (
                prop.created_by.user_type === USER_TYPE.USR &&
                prop.created_by.user_id === currentUser.id &&
                (prop.is_completed === "N" || prop.is_completed === "Y")
            );
        });

        return numOfInnovated.length;
    };

    return (
        <React.Fragment>
            <div className="page-breadcrumb">
                <div className="row">
                    <div className="col-7 align-self-center">
                        <h3 className="page-title text-truncate text-dark font-weight-medium mb-1">
                            {getGreetingTime()} {firstName}!
                        </h3>
                        <div className="d-flex align-items-center">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb m-0 p-0">
                                    <li className="breadcrumb-item">
                                        <a href="index.html">Dashboard</a>
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                    {/* <div className="col-5 align-self-center">
												<div className="customize-input float-right">
														<select className="custom-select custom-select-set form-control bg-white border-0 custom-shadow custom-radius">
																<option>Overall</option>
																{ getColleges() }
														</select>
												</div>
										</div> */}
                </div>
            </div>

            {/* This is where the content will be displayed. */}
            <div className="container-fluid">
                <div className="card-group">
                    <div className="card border-right">
                        <div className="card-body bg-primary text-white">
                            <div className="d-flex d-lg-flex d-md-block align-items-center">
                                <div>
                                    <div className="d-inline-flex align-items-center">
                                        <h2 className="text-white mb-1 font-weight-medium">
                                            {getTotalProposal()}
                                        </h2>
                                        {/* <span className="badge bg-ino font-12 text-dark font-weight-medium badge-pill ml-2 d-lg-block d-md-none">
																						+18.33%
																				</span> */}
                                    </div>
                                    <h6>Proposals</h6>
                                </div>
                                <div class="ml-auto mt-md-3 mt-lg-0">
                                    <span class="opacity-10 text-white">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="30"
                                            height="30"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            class="feather feather-edit-3"
                                        >
                                            <path d="M12 20h9"></path>
                                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card border-right">
                        <div className="card-body bg-cyan text-white">
                            <div className="d-flex d-lg-flex d-md-block align-items-center">
                                <div>
                                    <div className="d-inline-flex align-items-center">
                                        <h2 className="text-white mb-1 font-weight-medium">
                                            {getTotalCompleted()}
                                        </h2>
                                        {/* <span className="badge bg-primary font-12 text-white font-weight-medium badge-pill ml-2 d-lg-block d-md-none">
																						+18.33%
																				</span> */}
                                    </div>
                                    <h6>Completed</h6>
                                </div>
                                <div class="ml-auto mt-md-3 mt-lg-0">
                                    <span class="opacity-10 text-white">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="30"
                                            height="30"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            class="feather feather-check-circle"
                                        >
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card border-right">
                        <div className="card-body bg-success text-white">
                            <div className="d-flex d-lg-flex d-md-block align-items-center">
                                <div>
                                    <div className="d-inline-flex align-items-center">
                                        <h2 className="text-white mb-1 font-weight-medium">
                                            {getTotalPresented()}
                                        </h2>
                                        {/* <span className="badge bg-primary font-12 text-white font-weight-medium badge-pill ml-2 d-lg-block d-md-none">
																						+18.33%
																				</span> */}
                                    </div>
                                    <h6>Presentations</h6>
                                </div>
                                <div class="ml-auto mt-md-3 mt-lg-0">
                                    <span class="opacity-10 text-white">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="30"
                                            height="30"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            class="feather feather-pie-chart"
                                        >
                                            <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                                            <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card border-right">
                        <div className="card-body bg-danger text-white">
                            <div className="d-flex d-lg-flex d-md-block align-items-center">
                                <div>
                                    <div className="d-inline-flex align-items-center">
                                        <h2 className="text-white mb-1 font-weight-medium">
                                            {getTotalPublished()}
                                        </h2>
                                        {/* <span className="badge bg-primary font-12 text-white font-weight-medium badge-pill ml-2 d-lg-block d-md-none">
																						+18.33%
																				</span> */}
                                    </div>
                                    <h6>Publications</h6>
                                </div>
                                <div class="ml-auto mt-md-3 mt-lg-0">
                                    <span class="opacity-10 text-white">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="30"
                                            height="30"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            class="feather feather-book-open"
                                        >
                                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row-fluid">
                    <div className="card-group">
                        <div className="card border-right">
                            <div className="card-body bg-danger text-white">
                                <div className="d-flex d-lg-flex d-md-block align-items-center">
                                    <div>
                                        <div className="d-inline-flex align-items-center">
                                            <h2 className="text-white mb-1 font-weight-medium">
                                                {getTotalUtilized()}
                                            </h2>
                                            {/* <span className="badge bg-primary font-12 text-white font-weight-medium badge-pill ml-2 d-lg-block d-md-none">
																								+18.33%
																						</span> */}
                                        </div>
                                        <h6>Utilizations</h6>
                                    </div>
                                    <div class="ml-auto mt-md-3 mt-lg-0">
                                        <span class="opacity-10 text-white">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="30"
                                                height="30"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                class="feather feather-file-text"
                                            >
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                <polyline points="14 2 14 8 20 8"></polyline>
                                                <line
                                                    x1="16"
                                                    y1="13"
                                                    x2="8"
                                                    y2="13"
                                                ></line>
                                                <line
                                                    x1="16"
                                                    y1="17"
                                                    x2="8"
                                                    y2="17"
                                                ></line>
                                                <polyline points="10 9 9 9 8 9"></polyline>
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card border-right">
                            <div className="card-body bg-success text-white">
                                <div className="d-flex d-lg-flex d-md-block align-items-center">
                                    <div>
                                        <div className="d-inline-flex align-items-center">
                                            <h2 className="text-white mb-1 font-weight-medium">
                                                {getTotalInnovated()}
                                            </h2>
                                            {/* <span className="badge bg-primary font-12 text-white font-weight-medium badge-pill ml-2 d-lg-block d-md-none">
																								+18.33%
																						</span> */}
                                        </div>
                                        <h6>Innovations</h6>
                                    </div>
                                    <div class="ml-auto mt-md-3 mt-lg-0">
                                        <span class="opacity-10 text-white">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="30"
                                                height="30"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                class="feather feather-monitor"
                                            >
                                                <rect
                                                    x="2"
                                                    y="3"
                                                    width="20"
                                                    height="14"
                                                    rx="2"
                                                    ry="2"
                                                ></rect>
                                                <line
                                                    x1="8"
                                                    y1="21"
                                                    x2="16"
                                                    y2="21"
                                                ></line>
                                                <line
                                                    x1="12"
                                                    y1="17"
                                                    x2="12"
                                                    y2="21"
                                                ></line>
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            {/* <div className="card-body"> */}
                            {/* <div className="d-flex d-lg-flex d-md-block align-items-center"> */}
                            {/* <div>
																				<div className="d-inline-flex align-items-center">
																						<h2 className="text-dark mb-1 font-weight-medium">
																								{getTotalInnovated()}
																						</h2>
																						<span className="badge bg-primary font-12 text-white font-weight-medium badge-pill ml-2 d-lg-block d-md-none">
																								+18.33%
																						</span>
																				</div>
																				<h6>Innovations</h6>
																		</div>
																		<div></div> */}
                            {/* </div> */}
                            {/* </div> */}
                        </div>
                        <div className="card"></div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Faculties;
