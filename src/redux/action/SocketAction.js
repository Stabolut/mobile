export const setSocketConnection = (isConnected, newSocket) => dispatch => {

dispatch({
        type: "SET_SOCKET",
        payload: {"isConnected":isConnected, "socket": newSocket}

    })
}
