import { Routes, Route } from 'react-router-dom'
import AuthPage from './pages/Auth'
import EventsPage from './pages/Events'
import BookingsPage from './pages/Bookings'
import MainNavigation from './components/Navigation/MainNavigation'
import AuthContext from './context/auth-context'
import { useState } from 'react'

function App() {
  const [tokenUserId, setContextVal] = useState({ token: null, userId: null });

  const loginFunc = (token, userId, tokenExpiration) => {
    setContextVal({ token: token, userId: userId });
  }

  const logoutFunc = () => {
    setContextVal({ token: null, userId: null });
  }

  return (
      <div className='font-poppins'>
        <AuthContext.Provider value={{ token: tokenUserId.token, userId: tokenUserId.userId, login: loginFunc, logout: logoutFunc }}>
          <MainNavigation />
          <Routes>
            {!tokenUserId.token && <Route path='/' element={<AuthPage />} exact />}
            {!tokenUserId.token && <Route path='/auth' element={<AuthPage />} />}
            <Route path='/events' element={<EventsPage />} />
            {tokenUserId.token && <Route path='/bookings' element={<BookingsPage />} />}
          </Routes>
        </AuthContext.Provider>
      </div>
  )
}

export default App
