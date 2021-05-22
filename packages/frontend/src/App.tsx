import { useContext } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Login from 'views/Login';
import AuthContext from 'context/AuthContext';

const App = () => {
  const { authorized } = useContext(AuthContext);
  return (
    <Router>
      {!authorized && <Redirect to="/login" />}
      <Switch>
        {authorized && (
          <Route exact path="/">
            Home
          </Route>
        )}
        <Route path="/login">
          <Login />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
