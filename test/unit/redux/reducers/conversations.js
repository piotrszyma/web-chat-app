import {expect, assert} from 'chai';

import {deepFreeze} from "../../../utils/deep-freeze";
import {
    CONV_ADD_HISTORY,
    CONV_ADD_MESSAGE,
    CONV_ADD_USER,
    CONV_ADD,
    CONV_DELETE, CONV_INIT, CONV_CHANGE_MESSAGE, CONV_DEL_MESSAGE, CONV_MODIFY
} from "../../../../src/redux/actions/types";

import conversations from "../../../../src/redux/reducers/conversations";
import {setConversations} from "../../../../src/redux/actions/conversations";
import {M_SENDING, M_SENT, M_READ, T_TEXT} from "../../../../src/redux/entities/message";
import {FIRST_MSG, MOCK_FIRST_MSG, MOCK_SECOND_MSG} from "../../../mocks/mocks";


describe('Conversations Reducer', () => {
    it('should create new conversation', () => {
        const stateBefore = [];
        const action = {
            type: CONV_ADD,
            id: 1,
            title: 'TITLE1',
            users: [1, 2, 3],
            messages: [],
            count: 0,
            avatarUrl: ''
        };

        deepFreeze(action);
        deepFreeze(stateBefore);

        const stateAfter = [
            {
                id: 1,
                title: 'TITLE1',
                users: [1, 2, 3],
                messages: [],
                count: 0,
                avatarUrl: ''
            }
        ];

        expect(conversations(stateBefore, action)).to.deep.equal(stateAfter);
    });

    it('should not mutate previous state', () => {
        const stateBefore = [
            {
                id: 1,
                title: 'TITLE1',
                users: [1, 2, 3],
                messages: [],
                count: 0,
                avatarUrl: ''

            }
        ];
        const action = {
            type: CONV_ADD,
            id: 2,
            title: 'TITLE2',
            users: [1, 2, 3],
            messages: [],
            count: 0,
            avatarUrl: ''

        };

        deepFreeze(action);
        deepFreeze(stateBefore);

        const stateAfter = [
            {
                id: 2,
                title: 'TITLE2',
                users: [1, 2, 3],
                messages: [],
                count: 0,
                avatarUrl: ''

            },
            {
                id: 1,
                title: 'TITLE1',
                users: [1, 2, 3],
                messages: [],
                count: 0,
                avatarUrl: ''

            }
        ];

        expect(conversations(stateBefore, action)).to.deep.equal(stateAfter);
    });

    it('should add new message', () => {
        const stateBefore = [
            {
                id: 1,
                title: 'TITLE1',
                users: [1, 2, 3],
                messages: [],
                count: 0,
                avatarUrl: ''
            }
        ];
        const action = {
            type: CONV_ADD_MESSAGE,
            id: 1,
            newMessage: {
                id: 1,
                author: {
                    id: 1
                },
                type: T_TEXT,
                content: '',
                timestamp: 1231231,
                readBy: []
            },
        };

        deepFreeze(action);
        deepFreeze(stateBefore);

        const stateAfter = [
            {
                id: 1,
                title: 'TITLE1',
                users: [1, 2, 3],
                messages: [
                    {
                        id: 1,
                        author: {
                            id: 1
                        },
                        type: T_TEXT,
                        content: '',
                        timestamp: 1231231,
                        readBy: []
                    }
                ],
                count: 0,
                avatarUrl: ''

            }
        ];

        expect(conversations(stateBefore, action)).to.deep.equal(stateAfter);
    });

    it('should add old messages to end', () => {
        const stateBefore = [
            {
                id: 1,
                title: 'TITLE1',
                users: [1, 2, 3],
                messages: [
                    {
                        id: 2,
                        author: 1,
                        type: 'text',
                        content: 'Lorem ipsum',
                        readBy: []
                    }
                ],
                count: 0,
                avatarUrl: ''
            }
        ];
        const action = {
            type: CONV_ADD_HISTORY,
            id: 1,
            oldHistory: [
                {
                    id: 0,
                    author: 1,
                    type: 'text',
                    content: 'Dolor es',
                    readBy: []
                },
                {
                    id: 1,
                    author: 2,
                    type: 'text',
                    content: 'Is extum es',
                    readBy: []
                }],
            count: 3
        };

        deepFreeze(action);
        deepFreeze(stateBefore);

        const stateAfter = [
            {
                id: 1,
                title: 'TITLE1',
                users: [1, 2, 3],
                messages: [
                    {
                        id: 0,
                        author: 1,
                        type: 'text',
                        content: 'Dolor es',
                        readBy: []
                    },
                    {
                        id: 1,
                        author: 2,
                        type: 'text',
                        content: 'Is extum es',
                        readBy: []
                    },
                    {
                        id: 2,
                        author: 1,
                        type: 'text',
                        content: 'Lorem ipsum',
                        readBy: []
                    }
                ],
                count: 3,
                avatarUrl: ''
            }
        ];

        expect(conversations(stateBefore, action)).to.deep.equal(stateAfter);

    });

    it('should delete conversation', () => {
        const stateBefore = [
            {
                id: 1,
                title: 'TITLE1',
                users: [1, 2, 3],
                messages: [],
            }
        ];
        const action = {
            type: CONV_DELETE,
            conversationId: 1
        };

        deepFreeze(action);
        deepFreeze(stateBefore);

        const stateAfter = [];

        expect(conversations(stateBefore, action)).to.deep.equal(stateAfter);
    });

    it('should add client', () => {
        const stateBefore = [
            {
                id: 1,
                title: 'TITLE1',
                users: [1, 2, 3],
                messages: [],
                count: 0,
                avatarUrl: ''
            }
        ];
        const action = {
            type: CONV_ADD_USER,
            conversationId: 1,
            userId: 4
        };

        deepFreeze(action);
        deepFreeze(stateBefore);

        const stateAfter = [
            {
                id: 1,
                title: 'TITLE1',
                users: [1, 2, 3, 4],
                messages: [],
                count: 0,
                avatarUrl: ''
            }
        ];

        expect(conversations(stateBefore, action)).to.deep.equal(stateAfter);
    });
        it('should delete message', () => {
        const stateBefore = [
            {
                id: 1,
                title: 'TITLE1',
                users: [1, 2, 3],
                messages: [
                    MOCK_FIRST_MSG,
                    MOCK_SECOND_MSG
                ],
                count: 0,
                avatarUrl: ''
            },
            {
                id: 2,
                title: 'TITLE1',
                users: [1, 2, 3],
                messages: [],
                count: 0,
                avatarUrl: ''
            }
        ];
        const action = {
            type: CONV_DEL_MESSAGE,
            id: 1,
            messageId: MOCK_FIRST_MSG.id,
        };

        deepFreeze(action);
        deepFreeze(stateBefore);

        const stateAfter = [
            {
                id: 1,
                title: 'TITLE1',
                users: [1, 2, 3],
                messages: [
                    MOCK_SECOND_MSG
                ],
                count: 0,
                avatarUrl: ''
            },
            {
                id: 2,
                title: 'TITLE1',
                users: [1, 2, 3],
                messages: [],
                count: 0,
                avatarUrl: ''
            }
        ];

        expect(conversations(stateBefore, action)).to.deep.equal(stateAfter);
    });
});

describe('Conversation Action Creator', () => {
    it('should generate proper setConversation action', () => {
        const generated = setConversations([1, 2, 3]);
        const expected = {
            type: CONV_INIT,
            conversations: [1, 2, 3]
        };
        expect(generated).to.deep.equal(expected);
    });
});