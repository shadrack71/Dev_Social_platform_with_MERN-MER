// import {applyMiddleware}  from 'redux'
import {configureStore } from '@reduxjs/toolkit'
// import {composeWithDevTools} from 'redux-devtools-extension'
// import {thunk} from 'redux-thunk'
import rootReducer from './reducers'


const intialState = {}

// const middleware = [thunk]

// const store = configureStore(
//     rootReducer,
//     intialState,
//     composeWithDevTools(applyMiddleware(...middleware))
// )


const store = configureStore({
  reducer: rootReducer,
  preloadedState: intialState,
//   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middleware),
//   devTools: process.env.NODE_ENV !== 'production'
});

export default store

