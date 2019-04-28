import { createStore, combineReducers } from 'redux';

const initStateUser = { user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) :{}};

export function users(state = initStateUser, action) {
    switch (action.type) {
      case 'USERS_LOGIN':
        return {
            user: action.payload.user,
        };
      default:
        return state
    }
}


const reducers = combineReducers({
    users
});
const store = createStore(reducers);

export default store