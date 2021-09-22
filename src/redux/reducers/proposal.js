const initialState = {
    proposals: []
}

const proposalReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_PROPOSAL':
            return {
                ...state
                , proposals: action.payload
            }

        case 'CREATE_PROPOSAL':
            return {
                ...state
                , proposals: [...state.proposals, action.payload]
            }

        case 'UPDATE_PROPOSAL':
            const updatedState = state.proposals.map(proposal => proposal._id === action.payload._id ? action.payload : proposal);

            return {
                ...state
                , proposals: updatedState
            }

        case 'UPDATE_PROPOSAL_REMARKS':
            const filteredRemarks = state.proposals.map(proposal => proposal._id === action.payload._id ? action.payload : proposal);

            return {
                ...state
                , proposals: filteredRemarks
            }

        case 'DELETE_PROPOSAL':
            const deletedState = state.proposals.filter(proposal => proposal._id !== action.payload);

            return {
                ...state
                , proposals: deletedState
            }

        default:
            return state;
    }
}

export default proposalReducer;