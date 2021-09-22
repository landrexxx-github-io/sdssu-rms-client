const initialState = {
    accounts: [],
};

const accountReducer = (state = initialState, action) => {
    switch (action.type) {
        case "FETCH_ACCOUNT":
            return {
                ...state,
                accounts: action.payload,
            };

        case "CREATE_ACCOUNT":
            return {
                ...state,
                accounts: [...state.accounts, action.payload],
            };

        case "UPDATE_ACCOUNT":
            const updatedState = state.accounts.map((accounts) =>
                accounts._id === action.payload._id ? action.payload : accounts
            );

            return {
                ...state,
                accounts: updatedState,
            };

        case "DELETE_ACCOUNT":
            const deletedState = state.accounts.filter(
                (accounts) => accounts._id !== action.payload
            );

            return {
                ...state,
                accounts: deletedState,
            };

        case "CHANGE_PASSWORD":
            const updatedPassword = state.accounts.map((accounts) =>
                accounts._id === action.payload._id ? action.payload : accounts
            );

            return {
                ...state,
                accounts: updatedPassword,
            };

        case "FETCH_LOGGED_IN_ACCOUNT":
            return {
                ...state,
                accounts: action.payload,
            };

        default:
            return state;
    }
};

export default accountReducer;
