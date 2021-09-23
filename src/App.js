import React, { useState, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import './App.css';
import Main from './components/layouts/Main';

import AccountContext from './context/AccountContext';

const App = () => {
	const [userData, setUserData] = useState({ token: undefined, user: undefined });
	const history = useHistory();

	useEffect(() => {
		const getloggedInAccount = async() => {
			let token = localStorage.getItem("auth-token");
			// CHECKS token if does exist for the first time it uses the browser
			if(token === null) {
				localStorage.setItem("auth-token", "");
				token = "";
			}

			// CHECKS if token is VALID
			const isTokenValid = await axios.post("https://sdssu-rms.herokuapp.com/account/is_token_valid", null, {
				headers: { "Authorization": token }
			});

			if(isTokenValid.data) {
				const userResponse = await axios.get("https://sdssu-rms.herokuapp.com/account/get_logged_in_user", {
					headers: { "Authorization": token }
				});

				setUserData({ token, user: userResponse.data });
			}
		}

		getloggedInAccount();
	}, [history]);

	return(
		<Fragment>
			<AccountContext.Provider value={{ userData, setUserData }}>
				<Main />
			</AccountContext.Provider>
		</Fragment>
	)
}

export default App;

