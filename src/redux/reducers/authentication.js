const initialState = {
    logged_accounts: []
}

const loggedAccountReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_LOGGED_ACCOUNT':
            return { 
                ...state
                , logged_accounts: action.payload 
            }
        
        case 'LOG_IN':
            return { 
                ...state
                , logged_accounts: [...state.logged_in, action.payload] 
            }
        
        case 'LOG_OUT':
            return { 
                ...state
                , logged_accounts: null
            }

        default:
            return state;
    }
}

export default loggedAccountReducer;