const initialState = {
    campuses: []
}

const campusReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_CAMPUS':
            return { ...state, campuses: action.payload }
        case 'CREATE_CAMPUS':
            return { ...state, campuses: [...state.campuses, action.payload] }
        case 'UPDATE_CAMPUS':
            const updatedState = state.campuses.map(campus => campus._id === action.payload._id ? action.payload : campus);

            return { ...state,  campuses: updatedState }
        case 'DELETE_CAMPUS':
            const deletedState = state.campuses.filter(campus => campus._id !== action.payload);

            return { ...state,  campuses: deletedState }
        default:
            return state;
    }
}

export default campusReducer;