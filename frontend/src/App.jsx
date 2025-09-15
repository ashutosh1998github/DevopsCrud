
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import AdminDashboard from './components/AdminDashboard'
import Login from './components/Login'
import Register from './components/Register'

function App() {

  return (
    <>
     <BrowserRouter>

     <Routes>
     
     <Route path='/login' element={<Login/>}/>
     <Route path='/admin' element={<AdminDashboard/>}/>
     <Route path='/register' element={<Register/>}/>
     <Route path='*' element={'Error 404...! \n Page not found'}/>


     </Routes>
     
     
     
     </BrowserRouter>
    </>
  )
}

export default App
