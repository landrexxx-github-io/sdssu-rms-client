const initialState = {
    seminars: []
}

const seminarReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_SEMINAR':
            return { 
                ...state
                , seminars: action.payload 
            }
            
        case 'CREATE_SEMINAR':
            return { 
                ...state
                , seminars: [ ...state.seminars, action.payload ] 
            }

        case 'UPDATE_SEMINAR':
            const updatedState = state.seminars.map(seminar => seminar._id === action.payload._id ? action.payload : seminar);

            return {
                ...state
                , seminars: updatedState
            }

        case 'DELETE_SEMINAR':
            const deletedState = state.seminars.filter(seminar => seminar._id !== action.payload);

            return { 
                ...state
                ,  seminars: deletedState 
            }

        default:
            return state;
    }
}

export default seminarReducer;