import {ALERT_CLOSE, ALERT_OPEN} from "./types";
import {makeActionCreator} from "./action-creators";

export const openAlert = makeActionCreator(ALERT_OPEN, 'text');
export const closeAlert = makeActionCreator(ALERT_CLOSE);
