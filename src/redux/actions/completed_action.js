import * as api from '../../api';
import { toast } from 'react-toastify';

// action creators
export const getProposalCompleted = () => async (dispatch) => {
    try {
        const { data } = await api.fetchCompleted();
        
        dispatch({
            type: 'FETCH_PROPOSAL_COMPLETED'
            , payload: data.results
        });
    } catch (error) {
        console.log("Error: ", error);
    }
}

export const createProposalCompleted = (proposal) => async (dispatch) => {
    try {
        const { data } = await api.createProposalCompleted(proposal);
        
        dispatch({ 
            type: 'CREATE_PROPOSAL_COMPLETED'
            , payload: data.results 
        });
        
        toast.success("Created successfully");
    } catch (error) {
        toast.error("Unable to create this data.");
        console.log('Error: ', error);
    }
}

export const updateProposalCompleted = (proposal) => async (dispatch) => {
    try {
        const { data } = await api.updateProposalCompleted(proposal);
        
        dispatch({ 
            type: 'UPDATE_PROPOSAL_COMPLETED'
            , payload: data 
        });
        
        toast.success("Updated successfully");
    } catch (error) {
        toast.error("Unable to update this data.");
        console.log('Error: ', error);
    }
}

export const updateProposalCompletedApprovedRemarks = (proposal) => async (dispatch) => {
    try {
        const { data } = await api.updateProposal(proposal);
        
        dispatch({ 
            type: 'UPDATE_PROPOSAL_COMPLETED_REMARKS'
            , payload: data 
        });
        
        toast.success("Updated successfully");
    } catch (error) {
        toast.error("Unable to update this data.");
        console.log('Error: ', error);
    }
}

// export const deleteProposal = (research_id) => async (dispatch) => {
//     try {
//         await api.deleteProposal(research_id);

//         dispatch({ type: 'DELETE_PROPOSAL', payload: research_id });
//         toast.success("Deleted successfully");
//     } catch (error) {
//         toast.error("Unable to delete this data.");
//         console.log('Error: ', error);
//     }
// }
