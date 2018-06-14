import {M_SENDING, T_TEXT} from "../../src/redux/entities/message";

export const MOCK_FIRST_MSG = {
    id: 1,
    authorId: 1,
    type: T_TEXT,
    content: 'A sample first msg',
    timestamp: 1231231,
    readBy: []
};


export const MOCK_SECOND_MSG = {
    id: 2,
    authorId: 1,
    type: T_TEXT,
    content: 'A sample first msg',
    timestamp: 1231231,
    readBy: []
};