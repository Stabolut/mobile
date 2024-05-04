

const initialState = {
    contact: [],

};
export const contactReducer = (state = initialState, action) => {

    switch (action.type) {
        case "GET_CONTACT":


            return {
                ...state,
                contact: action.payload,
            };
        case "ADD_CONTACT":
            

            return {
                ...state,
                contact: [action.payload, ...state.contact],
            };

        default:
            return state;
    }
};
