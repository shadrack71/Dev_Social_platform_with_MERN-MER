
import './App.css';
import { BrowserRouter as Router,Route,Routes,Switch} from 'react-router-dom'
import Navbar from  './components/layout/Navbar'
import Landing from  './components/layout/Landing'
import Login from  './components/auth/Login'
import Register from  './components/auth/Register'

const  App =() => {
  return (
    <>
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
    </>
  );
}

export default App;
