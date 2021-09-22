const initialState = {
    completed: []
}

const proposalCompletedReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_PROPOSAL_COMPLETED':
            return { 
                ...state
                , completed: action.payload 
            }

        case 'CREATE_PROPOSAL_COMPLETED':
            return { 
                ...state
                , completed: [ ...state.completed, action.payload ] 
            }

        case 'UPDATE_PROPOSAL_COMPLETED':
            return { 
                ...state
                , completed: [ ...state.completed, action.payload ] 
            }

        // case 'UPDATE_COMPLETED':
        //     const filtered = state.completed.map(proposal => proposal._id === action.payload._id ? action.payload : proposal)

        //     return { 
        //         ...state
        //         , completed: filtered 
        //     }

        case 'UPDATE_PROPOSAL_COMPLETED_REMARKS':
            const filteredState = state.completed.map(proposal => proposal._id === action.payload._id ? action.payload : proposal)

            return { 
                ...state
                , completed: filteredState 
            }

        // case 'UPDATE_PROPOSAL_COMPLETED_REMARKS':
        //     const filteredState = state.completed.filter(proposal => proposal._id !== action.payload._id);

        //     return {
        //         ...state
        //         , completed: filteredState
        //     }

        // case 'DELETE_PROPOSAL':
        //     const deletedState = state.proposals.filter(proposal => proposal._id !== action.payload);

        //     return { ...state,  proposals: deletedState }
        default:
            return state;
    }
}

export default proposalCompletedReducer;