import {INITIAL_STATE} from "../../common/app-const";
import {ALERT_CLOSE, ALERT_OPEN} from "../actions/types";

const alert = (state = INITIAL_STATE.alert, action) => {
    switch (action.type) {
        case ALERT_OPEN:
            return {
                open: true,
                text: action.text
            };
        case ALERT_CLOSE:
            return {
                open: false,
                text: ''
            };
        default:
            return state;
    }
};

export default alert;