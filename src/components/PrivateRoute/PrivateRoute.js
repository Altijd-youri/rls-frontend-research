import React from 'react'
import { useAuth0 } from '../../react-auth0-spa';
import { Route, Redirect } from 'react-router-dom';

export default function PrivateRoute({ component, history, ...rest }) {

    const { isAuthenticated } = useAuth0();

    const renderComponent = (props) => {
        if (isAuthenticated) {
            const ComponentToShow = component;
            return <ComponentToShow {...props} />
        } else {
            return <Redirect to={{ pathname: '/', state: { from: props.location } }} />
        }

    };

    return (
        <Route
            {...rest}
            render={renderComponent}
        />
    )
}
