const initialState = {
    innovations: []
}

const innovationReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_INNOVATION':
            return { 
                ...state
                , innovations: action.payload 
            }
            
        case 'CREATE_INNOVATION':
            return { 
                ...state
                , innovations: [ ...state.innovations, action.payload ] 
            }

        case 'UPDATE_INNOVATION':
            const updatedState = state.innovations.map(proposal => proposal._id === action.payload._id ? action.payload : proposal);

            return {
                ...state
                , innovations: updatedState
            }

        case 'DELETE_INNOVATION':
            const deletedState = state.innovations.filter(proposal => proposal._id !== action.payload);

            return { 
                ...state
                ,  innovations: deletedState 
            }

        default:
            return state;
    }
}

export default innovationReducer;