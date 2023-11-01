import { createStore } from 'redux';
import rootReducer from './reducers/home';

const store = createStore(rootReducer);

export default store;
