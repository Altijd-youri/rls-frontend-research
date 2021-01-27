import React, { useEffect, useCallback, useState } from 'react';
import TrainPicker from './page/trainpicker/TrainPicker';
import { Switch, Route, Router } from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';
import { PATH } from './utils/constants';
import 'bootstrap/dist/css/bootstrap.min.css';
import TrainDetails from './page/traindetails/TrainDetails';
import TractionPicker from './page/tractionpicker/TractionPicker';
import WagonPicker from './page/wagonpicker/WagonPicker';
import { useAuth0 } from './react-auth0-spa';
import history from "./utils/history";
import Home from './page/home/Home';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import CompanyPicker from './page/companypicker/CompanyPicker';
import UserPicker from './page/userpicker/UserPicker'
import CustomerPicker from './page/customerpicker/CustomerPicker'

function App() {
  const { loading, getTokenSilently, isAuthenticated } = useAuth0();
  const [userRoles, setUserRoles] = useState([]);

  /**
   * Zet de permissions uit auth0 token in localStorage var scopes.
   */
  const getToken = useCallback(async () => {
    const token = await getTokenSilently();
    const scopes = JSON.parse(atob(token.split('.')[1])).permissions;
    localStorage.setItem('scopes', JSON.stringify(scopes));
    localStorage.setItem('token', token);
    setUserRoles(scopes);
  }, [getTokenSilently])

  useEffect(() => {
    if (isAuthenticated && userRoles.length === 0) {
      getToken();
    }
  }, [isAuthenticated, getToken, userRoles])

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router history={history}>
      <Sidebar />
      <Switch>
        <PrivateRoute path={PATH.TRAINS} exact component={TrainPicker} />
        <PrivateRoute path={PATH.TRAINDETAILS} exact component={TrainDetails} />
        <Route path={PATH.HOME} exact component={Home} />
        <PrivateRoute path={PATH.TRACTIONS} exact component={TractionPicker} />
        <PrivateRoute path={PATH.WAGONS} exact component={WagonPicker} />
        <PrivateRoute path={PATH.COMPANIES} exact component={CompanyPicker} />
        <PrivateRoute path={PATH.CUSTOMERS} exact component={CustomerPicker} />
        <PrivateRoute path={PATH.USERS} exact component={UserPicker} />
      </Switch>
    </Router>
  );
}

export default App;
