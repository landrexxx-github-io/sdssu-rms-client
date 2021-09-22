const initialState = {
    utilizations: []
}

const utilizationReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_UTILIZATION':
            return { 
                ...state
                , utilizations: action.payload 
            }
            
        case 'CREATE_UTILIZATION':
            return { 
                ...state
                , utilizations: [ ...state.utilizations, action.payload ] 
            }

        case 'UPDATE_UTILIZATION':
            const updatedState = state.utilizations.map(proposal => proposal._id === action.payload._id ? action.payload : proposal);

            return {
                ...state
                , utilizations: updatedState
            }

        case 'DELETE_UTILIZATION':
            const deletedState = state.utilizations.filter(proposal => proposal._id !== action.payload);

            return { 
                ...state
                ,  utilizations: deletedState 
            }

        default:
            return state;
    }
}

export default utilizationReducer;