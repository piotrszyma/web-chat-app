import { expect, assert } from 'chai';

import {deepFreeze} from '../../../utils/deep-freeze';
import {
    AUTH_BLOCK,
    AUTH_LOGIN,
    AUTH_LOGOUT, AUTH_UNBLOCK
} from '../../../../src/redux/actions/types';

import auth from '../../../../src/redux/reducers/auth';

describe('Auth Reducer', () => {
    it ('should not mutate existing objects', () => {
        const stateBefore = {
            client: {
                avatarUrl: 'dummy.url',
                username: 'client',
                blockedList: [1, 2, 3],
                id: 0
            },
            tokens: {
                token: 'Dummy token',
                refreshToken: 'Dummy token'
            },
            expireAt: 123,
            isLogged: true
        };

        const action = {
            type: AUTH_LOGOUT
        };

        const stateAfter = {
            client: {
                avatarUrl: '',
                username: '',
                blockedList: [],
                id: 0
            },
            tokens: {
                token: '',
                refreshToken: ''
            },
            expireAt: 0,
            isLogged: false
        };

        deepFreeze(stateBefore);
        deepFreeze(action);
        expect(auth(stateBefore, action)).to.deep.equal(stateAfter);
    });

    it('should add client to blocked list', () => {
        const stateBefore = {
            client: {
                avatarUrl: 'dummy.url',
                username: 'client',
                blockedList: [1, 2, 3],
                id: 0
            },
            tokens: {
                token: 'Dummy token',
                refreshToken: 'Dummy token'
            },
            expireAt: 123,
            isLogged: true
        };

        const action = {
            type: AUTH_BLOCK,
            id: 4
        };

        const stateAfter = {
            client: {
                avatarUrl: 'dummy.url',
                username: 'client',
                blockedList: [1, 2, 3, 4],
                id: 0
            },
            tokens: {
                token: 'Dummy token',
                refreshToken: 'Dummy token'
            },
            expireAt: 123,
            isLogged: true
        };

        deepFreeze(stateBefore);
        deepFreeze(action);
        expect(auth(stateBefore, action)).to.deep.equal(stateAfter);
    });


    it('should add unblock client', () => {
        const stateBefore = {
            client: {
                avatarUrl: 'dummy.url',
                username: 'client',
                blockedList: [1, 2, 3],
                id: 0
            },
            tokens: {
                token: 'Dummy token',
                refreshToken: 'Dummy token'
            },
            expireAt: 123,
            isLogged: true
        };

        const action = {
            type: AUTH_UNBLOCK,
            id: 3
        };

        const stateAfter = {
            client: {
                avatarUrl: 'dummy.url',
                username: 'client',
                blockedList: [1, 2],
                id: 0
            },
            tokens: {
                token: 'Dummy token',
                refreshToken: 'Dummy token'
            },
            expireAt: 123,
            isLogged: true
        };

        deepFreeze(stateBefore);
        deepFreeze(action);
        expect(auth(stateBefore, action)).to.deep.equal(stateAfter);
    });
});