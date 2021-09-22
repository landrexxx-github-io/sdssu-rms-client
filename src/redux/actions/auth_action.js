import * as api from '../../api';
import { toast } from 'react-toastify';

export const loginAccount = (credentials) => async (dispatch) => {
    try {
        const { data } = await api.loginAccount(credentials); 
        
        if(data.status === 'success') {
            dispatch({ 
                type: 'LOG_IN'
                , payload: data.results.details 
            });
            
            localStorage.setItem('token', data.results.token);
            window.location = "/dashboard";
        } else {
            console.log(data.message);
            window.location = "/login";
        }
    } catch (error) {
        console.log('Error: ', error);
    }
}

export const changePassword = (credentials) => async (dispatch) => {
    try {
        const { data } = await api.changePassword(credentials);
        
        if(data.success) {
            dispatch({ 
                type: 'CHANGE_PASSWORD', 
                payload: data.results 
            });

            toast.success(data.message);
            localStorage.setItem('auth-token', "");
            window.location = "/login";
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        toast.error("Unable to update password.");
        console.log('Error: ', error);
    }
}
