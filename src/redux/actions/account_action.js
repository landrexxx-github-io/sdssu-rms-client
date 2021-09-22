import * as api from '../../api';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';

// action creators
export const getAccount = () => async (dispatch) => {
    try {
        const { data } = await api.fetchAccount();

        if(data.success) {
            dispatch({ 
                type: 'FETCH_ACCOUNT', 
                payload: data.results 
            });
        } else {
            console.log("Error:", data.message);
        }
    } catch (error) {
        console.log('Error: ', error.message);
    }
}

export const createAccount = (account_data) => async (dispatch) => {
    try {
        const { data } = await api.createAccount(account_data);

        if(data.success) {
            dispatch({ 
                type: 'CREATE_ACCOUNT', 
                payload: data.results 
            });

            toast.success(data.message);
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        toast.error("Unable to create this data.");
        console.log('Error: ', error);
    }
}

export const updateAccount = (account_details) => async (dispatch) => {
    try {
        const { data } = await api.updateAccount(account_details);
        
        dispatch({ type: 'UPDATE_ACCOUNT', payload: data });
        toast.success("Updated successfully");
    } catch (error) {
        toast.error("Unable to update this data.");
        console.log('Error: ', error);
    }
}


export const deleteAccount = (department_id) => async (dispatch) => {
    // try {
    //     await api.deleteDepartment(department_id);

    //     dispatch({ type: 'DELETE_DEPT', payload: department_id });
    //     toast.success("Deleted successfully");
    // } catch (error) {
    //     toast.error("Unable to delete this data.");
    //     console.log('Error: ', error);
    // }
}