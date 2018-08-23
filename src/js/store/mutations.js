import {
    SET_PLAY_LIST,
    SET_CURRENT_INDEX,
    SET_PLAY_MODE
} from './mutation-types';

export default {
    [SET_PLAY_LIST] (state, list) {
        state.play_list = list;
    },
    [SET_CURRENT_INDEX] (state, index) {
        state.current_index = index;
    },
    [SET_PLAY_MODE] (state, mode) {
        state.play_mode = mode;
    }
};