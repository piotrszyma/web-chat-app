export const INITIAL_STATE = {
    users: {},
    auth   : {
        client      : {
            username: '',
            avatarUrl: '',
            blockedList: [],
            id: 0
        },
        tokens    : {
            token: '',
            refreshToken: ''
        },
        expireAt: 0,
        isLogged  : false
    },
    conversations: [],
    alert: {
        open: false,
        text: ''
    }
};
