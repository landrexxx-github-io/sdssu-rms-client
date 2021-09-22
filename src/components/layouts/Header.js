/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import AccountContext from "../../context/AccountContext";
// import RMSLOGO from "../../../public/assets/images/rms-logo.png";

const Header = () => {
    const { userData, setUserData } = useContext(AccountContext);
    const history = useHistory();

    const [firstName, setFirstName] = useState(
        userData.user ? userData.user.first_name : ""
    );
    const [lastName, setLastName] = useState(
        userData.user ? userData.user.last_name : ""
    );
    const [position, setPosition] = useState(
        userData.user ? userData.user.position : ""
    );
    const [college, setCollege] = useState(
        userData.user ? userData.user.college : ""
    );
    const [userType, setUserType] = useState(
        userData.user ? userData.user.user_type : ""
    );

    const onLogOut = () => {
        setUserData({
            token: undefined,
            user: undefined,
        });

        localStorage.setItem("auth-token", "");
        history.push("/login");
    };

    useEffect(() => {
        if (userData.user && userData.user !== undefined) {
            setFirstName(userData.user.first_name);
            setLastName(userData.user.last_name);
            setPosition(userData.user.position);
            setCollege(userData.user.college);
            setUserType(userData.user.user_type);
        }
    }, [userData.user]);

    return (
        <React.Fragment>
            <header
                className={userData.user ? "topbar" : "hidden"}
                data-navbarbg="skin6"
            >
                <nav className="navbar top-navbar navbar-expand-md">
                    <div className="navbar-header bg-dark" data-logobg="skin6">
                        <a
                            className="nav-toggler waves-effect waves-light d-block d-md-none"
                            href="#"
                        >
                            <i className="ti-menu ti-close" />
                        </a>
                        <div className="navbar-brand">
                            <a href="index.html">
                                
								<img src="../assets/images/rms-logo.png" alt="homepage" className="dark-logo" />
								<img src="../assets/images/rms-label.png" alt="homepage" className="dark-logo" />
							{/*
							<span className="logo-text">
								<img src="../assets/images/logo-text.png" alt="homepage" className="dark-logo" />
								<img src="../assets/images/logo-light-text.png" className="light-logo" alt="homepage" />
							</span> */}
                                <span className="logo-text text-white">
                                    {/* [ System ni Candia ] */}
                                </span>
                            </a>
                        </div>
                        <a
                            className="topbartoggler d-block d-md-none waves-effect waves-light"
                            href="#"
                            data-toggle="collapse"
                            data-target="#navbarSupportedContent"
                            aria-controls="navbarSupportedContent"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <i className="ti-more" />
                        </a>
                    </div>
                    <div
                        className="navbar-collapse collapse"
                        id="navbarSupportedContent"
                    >
                        <ul className="navbar-nav float-left mr-auto ml-3 pl-1">
                            <li className="nav-item dropdown">
                                {/* <a
                                    className="nav-link dropdown-toggle pl-md-3 position-relative"
                                    href="#"
                                    id="bell"
                                    role="button"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    <span>
                                        <i
                                            data-feather="bell"
                                            className="svg-icon"
                                        />
                                    </span>
                                    <span className="badge badge-primary notify-no rounded-circle">
                                        5
                                    </span>
                                </a> */}
                                <div className="dropdown-menu dropdown-menu-left mailbox animated bounceInDown">
                                    <ul className="list-style-none">
                                        <li>
                                            <div className="message-center notifications position-relative">
                                                <a
                                                    href="#"
                                                    className="message-item d-flex align-items-center border-bottom px-3 py-2"
                                                >
                                                    <div className="btn btn-danger rounded-circle btn-circle">
                                                        <i
                                                            data-feather="airplay"
                                                            className="text-white"
                                                        />
                                                    </div>
                                                    <div className="w-75 d-inline-block v-middle pl-2">
                                                        <h6 className="message-title mb-0 mt-1">
                                                            Luanch Admin
                                                        </h6>
                                                        <span className="font-12 text-nowrap d-block text-muted">
                                                            Just see the my new
                                                            admin!
                                                        </span>
                                                        <span className="font-12 text-nowrap d-block text-muted">
                                                            9:30 AM
                                                        </span>
                                                    </div>
                                                </a>
                                                <a
                                                    href="#"
                                                    className="message-item d-flex align-items-center border-bottom px-3 py-2"
                                                >
                                                    <span className="btn btn-success text-white rounded-circle btn-circle">
                                                        <i
                                                            data-feather="calendar"
                                                            className="text-white"
                                                        />
                                                    </span>
                                                    <div className="w-75 d-inline-block v-middle pl-2">
                                                        <h6 className="message-title mb-0 mt-1">
                                                            Event today
                                                        </h6>
                                                        <span className="font-12 text-nowrap d-block text-muted text-truncate">
                                                            Just a reminder that
                                                            you have event
                                                        </span>
                                                        <span className="font-12 text-nowrap d-block text-muted">
                                                            9:10 AM
                                                        </span>
                                                    </div>
                                                </a>
                                                <a
                                                    href="#"
                                                    className="message-item d-flex align-items-center border-bottom px-3 py-2"
                                                >
                                                    <span className="btn btn-info rounded-circle btn-circle">
                                                        <i
                                                            data-feather="settings"
                                                            className="text-white"
                                                        />
                                                    </span>
                                                    <div className="w-75 d-inline-block v-middle pl-2">
                                                        <h6 className="message-title mb-0 mt-1">
                                                            Settings
                                                        </h6>
                                                        <span className="font-12 text-nowrap d-block text-muted text-truncate">
                                                            You can customize
                                                            this template as you
                                                            want
                                                        </span>
                                                        <span className="font-12 text-nowrap d-block text-muted">
                                                            9:08 AM
                                                        </span>
                                                    </div>
                                                </a>
                                                <a
                                                    href="#"
                                                    className="message-item d-flex align-items-center border-bottom px-3 py-2"
                                                >
                                                    <span className="btn btn-primary rounded-circle btn-circle">
                                                        <i
                                                            data-feather="box"
                                                            className="text-white"
                                                        />
                                                    </span>
                                                    <div className="w-75 d-inline-block v-middle pl-2">
                                                        <h6 className="message-title mb-0 mt-1">
                                                            Pavan kumar
                                                        </h6>{" "}
                                                        <span className="font-12 text-nowrap d-block text-muted">
                                                            Just see the my
                                                            admin!
                                                        </span>
                                                        <span className="font-12 text-nowrap d-block text-muted">
                                                            9:02 AM
                                                        </span>
                                                    </div>
                                                </a>
                                            </div>
                                        </li>
                                        <li>
                                            <a
                                                className="nav-link pt-3 text-center text-dark"
                                                href="#"
                                            >
                                                <strong>
                                                    Check all notifications
                                                </strong>
                                                <i className="fa fa-angle-right" />
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            {/* <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    id="navbarDropdown"
                                    role="button"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    <i
                                        data-feather="settings"
                                        className="svg-icon"
                                    />
                                </a>
                                <div
                                    className="dropdown-menu"
                                    aria-labelledby="navbarDropdown"
                                >
                                    <a className="dropdown-item" href="#">
                                        Action
                                    </a>
                                    <a className="dropdown-item" href="#">
                                        Another action
                                    </a>
                                    <div className="dropdown-divider" />
                                    <a className="dropdown-item" href="#">
                                        Something else here
                                    </a>
                                </div>
                            </li> */}
                            {/* <li className="nav-item d-none d-md-block">
							<a className="nav-link" href="#">
								<div className="customize-input">
								<select className="custom-select form-control bg-white custom-radius custom-shadow border-0">
									<option>EN</option>
									<option value={1}>AB</option>
									<option value={2}>AK</option>
									<option value={3}>BE</option>
								</select>
								</div>
							</a>
						</li> */}
                        </ul>
                        <ul className="navbar-nav float-right">
                            {/* <li className="nav-item d-none d-md-block">
							<a className="nav-link" href="#">
								<form>
								<div className="customize-input">
									<input className="form-control custom-shadow custom-radius border-0 bg-white" type="search" placeholder="Search" aria-label="Search" />
									<i className="form-control-icon" data-feather="search" />
								</div>
								</form>
							</a>
						</li> */}
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    <img
                                        src="../assets/images/profile-picture.svg"
                                        alt="user"
                                        className="rounded-circle"
                                        width={40}
                                    />
                                    <span className="ml-2 d-none d-lg-inline-block">
                                        <span>Hello,</span>{" "}
                                        <span className="text-dark">
                                            {firstName} {lastName}
                                        </span>{" "}
                                        <i
                                            data-feather="chevron-down"
                                            className="svg-icon"
                                        />
                                    </span>
                                </a>
                                <div className="dropdown-menu dropdown-menu-right user-dd animated flipInY">
                                    <a className="dropdown-item" href="/profile">
                                        <i
                                            data-feather="user"
                                            className="svg-icon mr-2 ml-1"
                                        />{" "}
                                        My Profile
                                    </a>
                                    {/* <a className="dropdown-item" href="#"><i data-feather="mail" className="svg-icon mr-2 ml-1" /> Inbox</a> */}
                                    {/* <div className="dropdown-divider" />
									<a className="dropdown-item" href="#"><i data-feather="settings" className="svg-icon mr-2 ml-1" />
										Account Setting
									</a> */}
                                    <div className="dropdown-divider" />
                                    {/* <a className="dropdown-item" href="#"><i data-feather="log-out" className="svg-icon mr-2 ml-1" />
										Logout
									</a> */}
                                    <Link
                                        className="dropdown-item"
                                        to="#"
                                        onClick={() => {
                                            onLogOut();
                                        }}
                                    >
                                        <i
                                            data-feather="log-out"
                                            className="svg-icon mr-2 ml-1"
                                        />
                                        Logout
                                    </Link>
                                    <div className="dropdown-divider" />
                                    {/* <div className="pl-4 p-3">
									<a href="#" className="btn btn-sm btn-info">View
										Profile
									</a>
								</div> */}
                                </div>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
        </React.Fragment>
    );
};

export default Header;
