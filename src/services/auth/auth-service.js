import AjaxService from './../data/ajax-service';
import {store} from '../../Root';
import {logout} from "../../redux/actions/auth";


const _login = async (token) => {
    AjaxService.setHeader("Authorization", token);
    try {
        const response = await AjaxService.request({
            method: 'get',
            url: '/auth/google'
        });
        return {
            ...response,
            success: true
        }
    } catch (error) {
        return {
            success: false
        }
    }
};

const _logout = () => {
    store.dispatch(logout());
    console.log("DISPATCHED");
};

const AuthService = {
    login: (token) => {
        if (!token) throw new Error("You need to provide token to log in");
        return _login(token);
    },
    refresh: (refreshToken) => {
        return '';
    }
};

export default AuthService;
