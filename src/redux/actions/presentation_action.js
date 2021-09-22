import * as api from '../../api';
import { toast } from 'react-toastify';

// action creators
export const getPresentation = () => async (dispatch) => {
    try {
        const { data } = await api.fetchPresentation();

        dispatch({
            type: 'FETCH_PRESENTATION',
            payload: data.results
        });
    } catch (error) {
        console.log("Error: ", error);
    }
}

export const createPresentation = (proposal) => async (dispatch) => {

    try {
        const { data } = await api.createPresentation(proposal);
        
        dispatch({ 
            type: 'CREATE_PRESENTATION', 
            payload: data.results 
        });
        
        toast.success("Created successfully");
    } catch (error) {
        toast.error("Unable to create this data.");
        console.log('Error: ', error);
    }
}

export const updatePresentation = (proposal) => async (dispatch) => {
    console.log("Proposal", proposal);
    try {
        const { data } = await api.updatePresentation(proposal);
        
        dispatch({ 
            type: 'UPDATE_PRESENTATION'
            , payload: data 
        });

        toast.success("Updated successfully");
    } catch (error) {
        toast.error("Unable to update this data.");
        console.log('Error: ', error);
    }
}

export const deletePresentation = (research_id) => async (dispatch) => {
    try {
        await api.deletePresentation(research_id);

        dispatch({ 
            type: 'DELETE_PRESENTATION'
            , payload: research_id 
        });

        toast.success("Deleted successfully");
    } catch (error) {
        toast.error("Unable to delete this data.");
        console.log('Error: ', error);
    }
}
