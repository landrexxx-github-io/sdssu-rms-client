import * as api from '../../api';
import { toast } from 'react-toastify';

// action creators
export const getPublication = () => async (dispatch) => {
    try {
        const { data } = await api.fetchPublication();

        dispatch({
            type: 'FETCH_PUBLICATION',
            payload: data.results
        });
    } catch (error) {
        console.log("Error: ", error);
    }
}

export const createPublication = (proposal) => async (dispatch) => {
    try {
        const { data } = await api.createPublication(proposal);
        
        dispatch({ 
            type: 'CREATE_PUBLICATION', 
            payload: data.results 
        });
        
        toast.success("Created successfully");
    } catch (error) {
        toast.error("Unable to create this data.");
        console.log('Error: ', error);
    }
}

export const updatePublication = (proposal) => async (dispatch) => {
    try {
        const { data } = await api.updatePublication(proposal);
        
        dispatch({ 
            type: 'UPDATE_PUBLICATION'
            , payload: data 
        });

        toast.success("Updated successfully");
    } catch (error) {
        toast.error("Unable to update this data.");
        console.log('Error: ', error);
    }
}

export const deletePublication = (research_id) => async (dispatch) => {
    try {
        await api.deletePublication(research_id);

        dispatch({ 
            type: 'DELETE_PUBLICATION'
            , payload: research_id 
        });

        toast.success("Deleted successfully");
    } catch (error) {
        toast.error("Unable to delete this data.");
        console.log('Error: ', error);
    }
}
