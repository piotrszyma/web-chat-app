import * as ConfigService from "../common/config-service";

const _loadState = () => {
    try {
        let stateFromStorage = localStorage.getItem('s');
        if (stateFromStorage === null) {
            return undefined
        }
        return JSON.parse(stateFromStorage);
    } catch (error) {
        return undefined;
    }
};

const _saveState = (state) => {
    try {
        localStorage.setItem('s', JSON.stringify(state));
    } catch (error) {
        // Ignore all errors
    }
};

const LocalStorageService = {
    loadState: () => {
        return _loadState()
    },

    saveState: (state) => {
        _saveState(state);
    }
};

export default LocalStorageService;
