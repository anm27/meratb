import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';


const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    console.log('Token in Private Route: ', token);

    const { loading } = useContext(AuthContext);

    if (loading) {
        return <div>Loading...</div>;
    }


    return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;







// import React, { useContext } from 'react';
// import { Route, Navigate, Routes } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';

// const PrivateRoute = ({ component: Component, ...rest }) => {
//     const { user } = useContext(AuthContext);

//     return (
//         <Routes>
//         <Route
//             {...rest}
//             render={props =>
//                 user ? (
//                     <Component {...props} />
//                 ) : (
//                     <Navigate to="/login" />
//                 )
//             }
//         />
//         </Routes>
//     );
// };

// export default PrivateRoute;
