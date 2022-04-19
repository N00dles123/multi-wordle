import React from 'react';
import { Navigate } from 'react-router-dom';
import authenticate from './authenticate';

// checks to see whether user is logged in before routing to destination

function ProtectedRoute({component: Component}) {
    const isAuthenticated = authenticate();
    //console.log(isAuthenticated);
    return (
                isAuthenticated ? <Component/> : <Navigate replace to="/default" />
    )
}

export default ProtectedRoute;