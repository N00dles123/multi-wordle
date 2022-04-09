import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Default from './pages/default'
import Dashboard from './pages/Dashboard'
import Game from './pages/Game'
import ProtectedRoute from './ProtectedRoute'


const App = () => {
    
        return <div>
            <BrowserRouter>
                <Routes>    
                    <Route path="/" element={<Navigate replace to="/default"/>}/>
                    <Route path="/default" exact element={<Default/>} />
                    <Route path="/dashboard/*"  exact element={<ProtectedRoute component={Dashboard}/>} />
                    <Route path="/game" exact element={<ProtectedRoute component={Game}/>} />
                </Routes>
            </BrowserRouter>
        </div>
}

export default App