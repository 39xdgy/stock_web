import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../firebase/Auth';

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  const currentUser  = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(routeProps) =>
        !!currentUser.currentUser ? (
          <RouteComponent {...routeProps} />
        ) : (
          <Redirect to={'sigin'} />
        )
      }
    />
  );
};

export default PrivateRoute;