import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AccountContext from '../../context/AccountContext';

const Footer = () => {
    const { userData } = useContext(AccountContext);
        
    return <div></div>
    // if(userData.user !== undefined) {
    //     return (
    //         <React.Fragment>
    //             <div className="page-wrapper">
    //                 <footer className="footer text-center text-muted">
    //                     <Link to="#">Surigao del Sur State University</Link> Research Management System v.1.
    //                 </footer>
    //             </div>
    //         </React.Fragment>
    //     )
    // }
}

export default Footer;
