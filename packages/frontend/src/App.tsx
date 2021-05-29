import { useContext } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AuthContext from 'context/AuthContext';
import Login from 'views/Login';
import Register from 'views/Register';
import Home from 'views/Home';
import Test from 'views/Test';
import Users from 'views/Users';
import EditQuestions from 'views/EditQuestions';

const App = () => {
  const { authorized, authData } = useContext(AuthContext);

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <Router>
        {!authorized && <Redirect to="/login" />}
        <Switch>
          {authorized && (
            <>
              <Route exact path="/">
                <Home />
              </Route>
              <Route exact path="/test">
                <Test />
              </Route>
              {authData?.role === 'admin' && (
                <>
                  <Route exact path="/users">
                    <Users />
                  </Route>
                  <Route exact path="/edit-questions">
                    <EditQuestions />
                  </Route>
                </>
              )}
            </>
          )}

          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
        </Switch>
      </Router>
    </>
  );
};

export default App;
