import {expect, assert} from 'chai';

import {deepFreeze} from "../../../utils/deep-freeze";
import {
    USER_ADD, USER_CHANGE_DETAILS, USER_DELETE
} from "../../../../src/redux/actions/types";

import users from "../../../../src/redux/reducers/users";

describe('Users Reducer', () => {
    it('should add new user', () => {
        const stateBefore = [];

        const action = {
            type: USER_ADD,
            user: {
                id: 1,
                username: 'username1',
                avatarUrl: 'www.avatar.com/avatar.jpg',
                online: false
            }
        };


        const stateAfter = {
            1: {
                username: 'username1',
                avatarUrl: 'www.avatar.com/avatar.jpg',
                online: false

            }
        };

        deepFreeze(stateBefore);
        deepFreeze(action);
        expect(users(stateBefore, action)).to.deep.equal(stateAfter);
    });

    it('should remove user', () => {
        const stateBefore = {
            1: {
                username: 'adam',
                avatarUrl: 'dummy.url',
                online: false
            },
            2: {
                username: 'adam2',
                avatarUrl: 'dummy.url',
                online: false
            },
            3: {
                username: 'adam3',
                avatarUrl: 'dummy.url',
                online: false
            }
        };

        const action = {
            type: USER_DELETE,
            id: 1
        };

        const stateAfter = {
            2: {
                username: 'adam2',
                avatarUrl: 'dummy.url',
                online: false
            },
            3: {
                username: 'adam3',
                avatarUrl: 'dummy.url',
                online: false
            }
        };

        deepFreeze(stateBefore);
        deepFreeze(action);
        expect(users(stateBefore, action)).to.deep.equal(stateAfter);
    });

    it('should change user details', () => {
        const stateBefore = {
            2: {
                username: 'adam',
                avatarUrl: 'dummy.url',
                online: false
            },
            3: {
                username: 'adam2',
                avatarUrl: 'dummy.url',
                online: false
            }
        };

        const action = {
            type: USER_CHANGE_DETAILS,
            user: {
                id: 2,
                username: 'adam3',
                avatarUrl: 'next.dummy.url',
                online: false
            }
        };

        const stateAfter = {
            2: {
                username: 'adam3',
                avatarUrl: 'next.dummy.url',
                online: false
            },
            3: {
                username: 'adam2',
                avatarUrl: 'dummy.url',
                online: false
            }
        };


        deepFreeze(stateBefore);
        deepFreeze(action);
        expect(users(stateBefore, action)).to.deep.equal(stateAfter);
    });
});