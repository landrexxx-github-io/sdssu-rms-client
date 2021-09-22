import * as api from '../../api';
import { toast } from 'react-toastify';

// action creators
export const getUtilization = () => async (dispatch) => {
    try {
        const { data } = await api.fetchUtilization();

        dispatch({
            type: 'FETCH_UTILIZATION',
            payload: data.results
        });
    } catch (error) {
        console.log("Error: ", error);
    }
}

export const createUtilizaition = (utilization) => async (dispatch) => {
    try {
        const { data } = await api.createUtilization(utilization);
        
        dispatch({ 
            type: 'CREATE_UTILIZATION', 
            payload: data.results 
        });
        
        toast.success("Created successfully");
    } catch (error) {
        toast.error("Unable to create this data.");
        console.log('Error: ', error);
    }
}

export const updateUtilization = (utilization) => async (dispatch) => {
    try {
        const { data } = await api.updateUtilization(utilization);
        
        dispatch({ 
            type: 'UPDATE_UTILIZATION'
            , payload: data 
        });

        toast.success("Updated successfully");
    } catch (error) {
        toast.error("Unable to update this data.");
        console.log('Error: ', error);
    }
}

export const deleteUtilization = (research_id) => async (dispatch) => {
    try {
        await api.deleteUtilization(research_id);

        dispatch({ 
            type: 'DELETE_UTILIZATION'
            , payload: research_id 
        });

        toast.success("Deleted successfully");
    } catch (error) {
        toast.error("Unable to delete this data.");
        console.log('Error: ', error);
    }
}
