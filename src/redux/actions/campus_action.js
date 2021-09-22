import * as api from '../../api';
import { toast } from 'react-toastify';

// action creators
export const getCampus = () => async (dispatch) => {
    try {
        const { data } = await api.fetchCampus()

        dispatch({ type: 'FETCH_CAMPUS', payload: data.results });
    } catch (error) {
        console.log('Error: ', error);
    }
}

export const createCampus = (campus) => async (dispatch) => {
    try {
        const { data } = await api.createCampus(campus);
        
        dispatch({ type: 'CREATE_CAMPUS', payload: data.results });
        toast.success("Create successfully");
    } catch (error) {
        toast.error("Unable to create this data.");
        console.log('Error: ', error);
    }
}

export const updateCampus = (campus) => async (dispatch) => {
    try {
        const { data } = await api.updateCampus(campus);
        
        dispatch({ type: 'UPDATE_CAMPUS', payload: data });
        toast.success("Updated successfully");
    } catch (error) {
        toast.error("Unable to update this data.");
        console.log('Error: ', error);
    }
}

export const deleteCampus = (campus_id) => async (dispatch) => {
    try {
        await api.deleteCampus(campus_id);

        dispatch({ type: 'DELETE_CAMPUS', payload: campus_id });
        toast.success("Deleted successfully");
    } catch (error) {
        toast.error("Unable to delete this data.");
        console.log('Error: ', error);
    }
}

