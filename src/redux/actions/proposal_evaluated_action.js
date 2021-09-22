import * as api from '../../api';
import { toast } from 'react-toastify';

// action creators
export const getProposalEvaluated = () => async (dispatch) => {
    try {
        const { data } = await api.fetchProposalEvaluated();

        dispatch({
            type: 'FETCH_PROPOSAL_EVALUATED',
            payload: data.results
        });
    } catch (error) {
        console.log("Error: ", error);
    }
}

export const updateProposalEvaluatedRemarks = (proposal) => async (dispatch) => {
    try {
        const { data } = await api.updateProposal(proposal);
        
        dispatch({ 
            type: 'UPDATE_PROPOSAL_EVALUATED_REMARKS'
            , payload: data 
        });
        
        toast.success("Updated successfully");
    } catch (error) {
        toast.error("Unable to update this data.");
        console.log('Error: ', error);
    }
}

// export const getProposalSubmitted = () => async (dispatch) => {
//     try {
//         const { data } = await api.fetchProposalSubmitted();

//         dispatch({
//             type: 'FETCH_PROPOSAL_SUBMITTED',
//             payload: data.results
//         });
//     } catch (error) {
//         console.log("Error: ", error);
//     }
// } 

// export const getProposalEvaluated = () => async (dispatch) => {
//     try {
//         const { data } = await api.fetchProposalEvaluated();

//         dispatch({
//             type: 'FETCH_PROPOSAL_EVALUATED',
//             payload: data.results
//         });
//     } catch (error) {
//         console.log("Error: ", error);
//     }
// } 

// // export const createProposal = (proposal) => async (dispatch) => {
//     try {
//         const { data } = await api.createProposal(proposal);
        
//         dispatch({ 
//             type: 'CREATE_PROPOSAL', 
//             payload: data.results 
//         });
        
//         toast.success("Created successfully");
//     } catch (error) {
//         toast.error("Unable to create this data.");
//         console.log('Error: ', error);
//     }
// }

// export const updateProposal = (proposal) => async (dispatch) => {
//     try {
//         const { data } = await api.updateProposal(proposal);
        
//         dispatch({ type: 'UPDATE_PROPOSAL', payload: data });
//         toast.success("Updated successfully");
//     } catch (error) {
//         toast.error("Unable to update this data.");
//         console.log('Error: ', error);
//     }
// }


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
