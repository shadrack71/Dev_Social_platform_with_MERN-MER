
import './App.css';
import { BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import Navbar from  './components/layout/Navbar'
import Landing from  './components/layout/Landing'
import Login from  './components/auth/Login'
import Register from  './components/auth/Register'
// redux

import { Provider } from 'react-redux'
import store from './store'

const  App =() => {
  return (
    <>
    <Provider store={store}>
    <Router>
      <Navbar/>
      <Routes>
        <Route exact path='/' Component={Landing}/>
      </Routes>
      <section className='container'>
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
