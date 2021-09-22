import React, { useContext, useEffect } from "react";
import { Switch, Route } from "react-router-dom";

import Faculty from "../pages/researches/dashboard/Faculties";
import Admin from "../pages/researches/dashboard/Administrator";

import Proposal from "../pages/researches/Proposal";
import Completed from "../pages/researches/Completed";
import Presentation from "../pages/researches/Presentation";
import Publication from "../pages/researches/Publication";
import Utilization from "../pages/researches/Utilization";
import Innovation from "../pages/researches/Innovation";
import Seminar from "../pages/researches/Seminar";

import Campus from "../pages/manage/Campus";
import Department from "../pages/manage/Department";
import Account from "../pages/manage/Account";
import Profile from "../pages/manage/Profile";
import ChangePassword from "../pages/manage/ChangePassword";

import Login from "../auth/Login";
import Registration from "../auth/Registration";

import PageNotFound from "../pages/error/PageNotFound";

import AccountContext from "../../context/AccountContext";

const Content = () => {
    const { userData } = useContext(AccountContext);

    if (userData.user && userData.user !== undefined) {
        return (
            <React.Fragment>
                <div className="page-wrapper" style={{ display: "block" }}>
                    <Switch>
                        <Route
                            exact
                            path="/dashboard"
                            render={() => {
                                if (
                                    userData.user.user_type === "rh" ||
                                    userData.user.user_type === "admin"
                                ) {
                                    return (
                                        <Admin currentUser={userData.user} />
                                    );
                                } else if (userData.user.user_type === "user") {
                                    return (
                                        <Faculty currentUser={userData.user} />
                                    );
                                }
                            }}
                        ></Route>

                        <Route
                            exact
                            path="/proposal"
                            render={() => (
                                <Proposal currentUser={userData.user} />
                            )}
                        ></Route>
                        <Route
                            exact
                            path="/completed"
                            render={() => (
                                <Completed currentUser={userData.user} />
                            )}
                        ></Route>
                        <Route
                            exact
                            path="/presentation"
                            render={() => (
                                <Presentation currentUser={userData.user} />
                            )}
                        ></Route>
                        <Route
                            exact
                            path="/publication"
                            render={() => (
                                <Publication currentUser={userData.user} />
                            )}
                        ></Route>
                        <Route
                            exact
                            path="/utilization"
                            render={() => (
                                <Utilization currentUser={userData.user} />
                            )}
                        ></Route>
                        <Route
                            exact
                            path="/innovation"
                            render={() => (
                                <Innovation currentUser={userData.user} />
                            )}
                        ></Route>
                        <Route
                            exact
                            path="/seminar"
                            render={() => (
                                <Seminar currentUser={userData.user} />
                            )}
                        ></Route>

                        <Route
                            exact
                            path="/campus"
                            render={() => {
                                if (
                                    userData.user.user_type === "rh" ||
                                    userData.user.user_type === "admin"
                                ) {
                                    return <Campus />;
                                } else {
                                    return <PageNotFound />;
                                }
                            }}
                        ></Route>

                        <Route
                            exact
                            path="/department"
                            render={() => {
                                if (
                                    userData.user.user_type === "rh" ||
                                    userData.user.user_type === "admin"
                                ) {
                                    return <Department />;
                                } else {
                                    return <PageNotFound />;
                                }
                            }}
                        ></Route>

                        <Route
                            exact
                            path="/account"
                            render={() => {
                                if (
                                    userData.user.user_type === "rh" ||
                                    userData.user.user_type === "admin"
                                ) {
                                    return <Account />;
                                } else {
                                    return <PageNotFound />;
                                }
                            }}
                        ></Route>

                        <Route
                            exact
                            path="/registration"
                            render={() => {
                                if (
                                    userData.user.user_type === "rh" ||
                                    userData.user.user_type === "admin"
                                ) {
                                    return <Registration />;
                                } else {
                                    return <PageNotFound />;
                                }
                            }}
                        ></Route>

                        <Route
                            exact
                            path="/profile"
                            render={() => {
                                if (
                                    userData.user.user_type === "user" ||
                                    userData.user.user_type === "rh" || 
                                    userData.user.user_type === "admin" 
                                ) {
                                    return <Profile currentUser={userData.user} />;
                                } else {
                                    return <PageNotFound />;
                                }
                            }}
                        ></Route>

                        <Route
                            exact
                            path="/change-password"
                            render={() => {
                                if (
                                    userData.user.user_type === "user"
                                ) {
                                    return <ChangePassword currentUser={userData.user} />;
                                } else {
                                    return <PageNotFound />;
                                }
                            }}
                        ></Route>

                        <Route component={PageNotFound}></Route>
                    </Switch>
                </div>
            </React.Fragment>
        );
    } else {
        return (
            <React.Fragment>
                <Switch>
                    <Route 
                        // path="/login" 
                        component={Login}
                    ></Route>

                    {/* <Route component={PageNotFound}></Route> */}
                </Switch>
            </React.Fragment>
        );
    }
};

export default Content;
