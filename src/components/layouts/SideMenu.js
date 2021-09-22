/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import AccountContext from "../../context/AccountContext";

const SideMenu = () => {
    const [userType, setUserType] = useState("");

    const { userData, setUserData } = useContext(AccountContext);
    const history = useHistory();

    useEffect(() => {
        if (userData.user && userData.user !== undefined) {
            const typeOfUser = userData.user.user_type;
            setUserType(typeOfUser);
        }
    }, [userData.user]);

	const onLogout = () => {
		setUserData({
            token: undefined,
            user: undefined,
        });

        localStorage.setItem("auth-token", "");
        history.push("/login");
	}

    return (
        <React.Fragment>
            <aside
                className={userData.user ? "left-sidebar" : "hidden"}
                data-sidebarbg="skin6"
            >
                <div className="scroll-sidebar bg-dark" data-sidebarbg="skin6">
                    <nav className="sidebar-nav bg-dark">
                        <ul id="sidebarnav" className="bg-dark">
                            <li className="sidebar-item">
                                <a
                                    className="sidebar-link text-white"
                                    href="/dashboard"
                                >
                                    <i
                                        data-feather="layout"
                                        className="feather-icon"
                                    />
                                    <span className="hide-menu">Dashboard</span>
                                </a>
                            </li>
                            <li className="list-divider" />
                            <li className="nav-small-cap">
                                <span className="hide-menu text-white">
                                    Research
                                </span>
                            </li>
                            <li className="sidebar-item">
                                <a
                                    href="/proposal"
                                    className="sidebar-link text-white"
                                    aria-expanded="false"
                                >
                                    <i
                                        data-feather="edit-3"
                                        className="feather-icon"
                                    />
                                    <span className="hide-menu">Proposal</span>
                                </a>
                            </li>
                            <li className="sidebar-item">
                                <a
                                    className="sidebar-link text-white"
                                    href="/completed"
                                    aria-expanded="false"
                                >
                                    <i
                                        data-feather="check-circle"
                                        className="feather-icon"
                                    />
                                    <span className="hide-menu">Completed</span>
                                </a>
                            </li>
                            <li className="sidebar-item">
                                <a
                                    className="sidebar-link text-white"
                                    href="/presentation"
                                    aria-expanded="false"
                                >
                                    <i
                                        data-feather="pie-chart"
                                        className="feather-icon"
                                    />
                                    <span className="hide-menu">
                                        Presentation
                                    </span>
                                </a>
                            </li>
                            <li className="sidebar-item">
                                <a
                                    className="sidebar-link text-white"
                                    href="/publication"
                                    aria-expanded="false"
                                >
                                    <i
                                        data-feather="book-open"
                                        className="feather-icon"
                                    />
                                    <span className="hide-menu">
                                        Publication
                                    </span>
                                </a>
                            </li>
                            <li className="sidebar-item">
                                <a
                                    className="sidebar-link text-white"
                                    href="/utilization"
                                    aria-expanded="false"
                                >
                                    <i
                                        data-feather="file-text"
                                        className="feather-icon"
                                    />
                                    <span className="hide-menu">
                                        Utilization
                                    </span>
                                </a>
                            </li>
                            <li className="sidebar-item">
                                <a
                                    className="sidebar-link text-white"
                                    href="/innovation"
                                    aria-expanded="false"
                                >
                                    <i
                                        data-feather="monitor"
                                        className="feather-icon"
                                    />
                                    <span className="hide-menu">
                                        Innovation
                                    </span>
                                </a>
                            </li>
                            <li className="sidebar-item">
                                <a
                                    className="sidebar-link text-white"
                                    href="/seminar"
                                    aria-expanded="false"
                                >
                                    <i
                                        data-feather="share-2"
                                        className="feather-icon"
                                    />
                                    <span className="hide-menu">
                                        Seminar
                                    </span>
                                </a>
                            </li>


                            { userType === "rh" || userType === "admin" ? <>
                            
                                <li className="list-divider" />
                                <li className="nav-small-cap">
                                    <span className="hide-menu text-white">
                                        Settings
                                    </span>
                                </li>
                                <li className="sidebar-item">
                                    <a
                                        className="sidebar-link text-white"
                                        href="/campus"
                                        aria-expanded="false"
                                    >
                                        <i
                                            data-feather="trello"
                                            className="feather-icon"
                                        />
                                        <span className="hide-menu">
                                            Campus
                                        </span>
                                    </a>
                                </li>
                                <li className="sidebar-item">
                                    <a
                                        className="sidebar-link text-white"
                                        href="/department"
                                        aria-expanded="false"
                                    >
                                        <i
                                            data-feather="trello"
                                            className="feather-icon"
                                        />
                                        <span className="hide-menu">
                                            Departments
                                        </span>
                                    </a>
                                </li>
                                <li className="sidebar-item">
                                    <a
                                        className="sidebar-link text-white"
                                        href="/account"
                                        aria-expanded="false"
                                    >
                                        <i
                                            data-feather="users"
                                            className="feather-icon"
                                        />
                                        <span className="hide-menu">
                                            Faculty
                                        </span>
                                    </a>
                                </li>
                                <li className="sidebar-item">
                                    <a
                                        className="sidebar-link text-white"
                                        href="/registration"
                                        aria-expanded="false"
                                    >
                                        <i
                                            data-feather="user-plus"
                                            className="feather-icon"
                                        />
                                        <span className="hide-menu">
                                            Register Account
                                        </span>
                                    </a>
                                </li>
                                <li className="sidebar-item">&nbsp;</li>

                            </> : <>
                            
                            <li className="list-divider" />
                                <li className="nav-small-cap">
                                    <span className="hide-menu text-white">
                                        Settings
                                    </span>
                                </li>
                                <li className="sidebar-item">
                                    <a
                                        className="sidebar-link text-white"
                                        href="/profile"
                                        aria-expanded="false"
                                    >
                                        <i
                                            data-feather="user-check"
                                            className="feather-icon"
                                        />
                                        <span className="hide-menu">
                                            Update Profile
                                        </span>
                                    </a>
                                </li>
                                <li className="sidebar-item">
                                    <a
                                        className="sidebar-link text-white"
                                        href="/change-password"
                                        aria-expanded="false"
                                    >
                                        <i
                                            data-feather="settings"
                                            className="feather-icon"
                                        />
                                        <span className="hide-menu">
                                            Change Password
                                        </span>
                                    </a>
                                </li>
                                <li className="sidebar-item">
                                    <a
                                        className="sidebar-link text-white"
                                        href="#"
                                        onClick={() => onLogout()}
                                        aria-expanded="false"
                                    >
                                        <i
                                            data-feather="log-out"
                                            className="feather-icon"
                                        />
                                        <span className="hide-menu">
                                            Logout
                                        </span>
                                    </a>
                                </li>
                                <li className="sidebar-item">&nbsp;</li>

                            </> }
                        </ul>
                    </nav>
                </div>
            </aside>
        </React.Fragment>
    );
};

export default SideMenu;
