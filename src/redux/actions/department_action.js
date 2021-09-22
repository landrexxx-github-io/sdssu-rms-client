import * as api from '../../api';
import { toast } from 'react-toastify';

// action creators
export const getDepartment = () => async (dispatch) => {
    try {
        const { data } = await api.fetchDepartment();

        dispatch({ type: 'FETCH_DEPT', payload: data.results });
    } catch (error) {
        console.log('Error: ', error);
    }
}

export const createDepartment = (department) => async (dispatch) => {
    try {
        const { data } = await api.createDepartment(department);
        
        dispatch({ type: 'CREATE_DEPT', payload: data.results });
        toast.success("Create successfully");
    } catch (error) {
        toast.error("Unable to create this data.");
        console.log('Error: ', error);
    }
}

export const updateDepartment = (department) => async (dispatch) => {
    try {
        const { data } = await api.updateDepartment(department);
        
        dispatch({ type: 'UPDATE_DEPT', payload: data });
        toast.success("Updated successfully");
    } catch (error) {
        toast.error("Unable to update this data.");
        console.log('Error: ', error);
    }
}


export const deleteDepartment = (department_id) => async (dispatch) => {
    try {
        await api.deleteDepartment(department_id);

        dispatch({ type: 'DELETE_DEPT', payload: department_id });
        toast.success("Deleted successfully");
    } catch (error) {
        toast.error("Unable to delete this data.");
        console.log('Error: ', error);
    }
}
