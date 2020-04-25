import React from 'react';
import './App.css';
import TrainPicker from './page/trainpicker/TrainPicker';
import { Switch, Route, Redirect } from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';
import { PATH } from './utils/constants';

function App() {
  return (
    <>
      <Sidebar />
      <Switch>
        <Route path={PATH.TRAINS} exact component={TrainPicker} />
        {/* <Route path={PATH.TRAINDETAILS} exact component={TrainDetails} /> */}
        <Redirect path={PATH.HOME} exact to={PATH.TRAINS} />
      </Switch>
    </>
  );
}

export default App;
