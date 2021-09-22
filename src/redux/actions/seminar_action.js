import * as api from '../../api';
import { toast } from 'react-toastify';

// action creators
export const getSeminar = () => async (dispatch) => {
    try {
        const { data } = await api.fetchSeminar();

        dispatch({
            type: 'FETCH_SEMINAR',
            payload: data.results
        });
    } catch (error) {
        console.log("Error: ", error);
    }
}

export const createSeminar = (seminar) => async (dispatch) => {
    try {
        const { data } = await api.createSeminar(seminar);
        
        dispatch({ 
            type: 'CREATE_SEMINAR', 
            payload: data.results 
        });
        
        toast.success("Created successfully");
    } catch (error) {
        toast.error("Unable to create this data.");
        console.log('Error: ', error);
    }
}

export const updateSeminar = (seminar) => async (dispatch) => {
    try {
        const { data } = await api.updateSeminar(seminar);
        
        dispatch({ 
            type: 'UPDATE_SEMINAR'
            , payload: data 
        });

        toast.success("Updated successfully");
    } catch (error) {
        toast.error("Unable to update this data.");
        console.log('Error: ', error);
    }
}

export const deleteSeminar = (seminar_id) => async (dispatch) => {
    try {
        await api.deleteSeminar(seminar_id);

        dispatch({ 
            type: 'DELETE_SEMINAR'
            , payload: seminar_id 
        });

        toast.success("Deleted successfully");
    } catch (error) {
        toast.error("Unable to delete this data.");
        console.log('Error: ', error);
    }
}
