const initialState = {
    departments: []
}

const departmentReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_DEPT':
            return { 
                ...state
                , departments: action.payload 
            }

        case 'CREATE_DEPT':
            return { 
                ...state
                , departments: [...state.departments, action.payload] 
            }

        case 'UPDATE_DEPT':
            const updatedState = state.departments.map(department => department._id === action.payload._id ? action.payload : department)

            return { 
                ...state
                , departments: updatedState 
            }

        case 'DELETE_DEPT':
            const deletedState = state.departments.filter(department => department._id !== action.payload)

            return { 
                ...state
                ,  departments: deletedState 
            }
            
        default:
            return state;
    }
}

export default departmentReducer;