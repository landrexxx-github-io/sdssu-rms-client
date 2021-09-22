import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import AccountContext from "../../context/AccountContext";

import Header from './Header';
import SideMenu from './SideMenu';
import SideMenuBarUser from './SideMenuBarUser';
import Content from './Content';
import Footer from './Footer'; 

const Main = () => {
    const [userType, setUserType] = useState("");

    const { userData, setUserData } = useContext(AccountContext);
    const history = useHistory();

    useEffect(() => {
        if (userData.user && userData.user !== undefined) {
            const typeOfUser = userData.user.user_type;
            setUserType(typeOfUser);
        }
    }, [userData.user]);

    return (
        <React.Fragment>
            <Header />
            <SideMenu />
            <Content />
            <Footer />
        </React.Fragment>
    )
}

export default Main;
