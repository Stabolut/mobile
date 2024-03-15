const initialState = {
  socket: null,
  isConnected: false,
};
export const socketReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SOCKET':
      return {
        ...state,
        socket: action.payload.socket,
        isConnected: action.payload.isConnected,
      };
    default:
      return state;
  }
};
