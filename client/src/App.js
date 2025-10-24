
import './App.css';
import { useEffect } from 'react';
import { BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import Navbar from  './components/layout/Navbar'
import Landing from  './components/layout/Landing'
import Login from  './components/auth/Login'
import Register from  './components/auth/Register'
import Alert from './components/layout/Alert';
import setAuthToken from './utils/setAuthToken'
import  { loadUser }  from './actions/auth';
// redux

import { Provider } from 'react-redux'
import store from './store'

 if(localStorage.token){
        setAuthToken(localStorage.token)
    }

const App =() => {
  useEffect(()=>{
    store.dispatch(loadUser())
  },[])
  return (
    <>
    <Provider store={store}>
    <Router>
      <Navbar/>
      <Routes>
        <Route exact path='/' Component={Landing}/>
      </Routes>
      <section className='container'>
        <Alert/>
        <Routes>
        
          <Route exact path='/register' Component={Register}/>
          <Route exact path='/login' Component={Login}/>
        
        </Routes>

      </section>
      
    </Router>
    </Provider>
    </>
  );
}

export default App;
