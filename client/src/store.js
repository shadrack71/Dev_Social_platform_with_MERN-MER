// import {applyMiddleware}  from 'redux'
import {configureStore } from '@reduxjs/toolkit'
// import {composeWithDevTools} from 'redux-devtools-extension'
// import {thunk} from 'redux-thunk'
import rootReducer from './reducers'


const initialState = {}

// const middleware = [thunk]

// const store = configureStore(
//     rootReducer,
//     intialState,
//     composeWithDevTools(applyMiddleware(...middleware))
// )


const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialState,
//   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middleware),
//   devTools: process.env.NODE_ENV !== 'production'
});

export default store

