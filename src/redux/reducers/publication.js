const initialState = {
    publications: []
}

const publicationReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_PUBLICATION':
            return { 
                ...state
                , publications: action.payload 
            }
            
        case 'CREATE_PUBLICATION':
            return { 
                ...state
                , publications: [ ...state.publications, action.payload ] 
            }

        case 'UPDATE_PUBLICATION':
            const updatedState = state.publications.map(publication => publication._id === action.payload._id ? action.payload : publication);

            return {
                ...state
                , publications: updatedState
            }

        case 'DELETE_PUBLICATION':
            const deletedState = state.publications.filter(publication => publication._id !== action.payload);

            return { 
                ...state
                ,  publications: deletedState 
            }

        default:
            return state;
    }
}

export default publicationReducer;