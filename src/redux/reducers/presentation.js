const initialState = {
    presentations: []
}

const presentationReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_PRESENTATION':
            return { 
                ...state
                , presentations: action.payload 
            }
            
        case 'CREATE_PRESENTATION':
            return { 
                ...state
                , presentations: [ ...state.presentations, action.payload ] 
            }

        case 'UPDATE_PRESENTATION':
            const updatedState = state.presentations.map(presentation => presentation._id === action.payload._id ? action.payload : presentation);

            return {
                ...state
                , presentations: updatedState
            }

        case 'DELETE_PRESENTATION':
            const deletedState = state.presentations.filter(presentation => presentation._id !== action.payload);

            return { 
                ...state
                ,  presentations: deletedState 
            }

        default:
            return state;
    }
}

export default presentationReducer;