import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UsersList from './components/UsersList';
import User from './components/User';
import { authenticate } from './store/session';
import GetAllItems from './components/GetAllItems/GetAllItems';
import GetItemById from './components/GetItemById/GetItemById';
import CreateCustomizedItem from "./components/CreateCustomizedItem/CreateCustomizedItem";
import GetCustomizedItems from './components/GetCustomizedItems/GetCustomizedItems';
import GetCurrentOrder from './components/GetCurrentOrder/GetCurrentOrder';
import GetOrderItems from './components/GetOrderItem/GetOrderItem';




function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    (async() => {
      await dispatch(authenticate());
      setLoaded(true);
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <NavBar />
      <Switch>

        <Route path="/login" exact={true}>
          <LoginForm />
        </Route>
        <Route path="/menu" exact={true}>
          <GetAllItems />
        </Route>
        <Route path="/items/:itemId">
          <GetItemById />
        </Route>
        <Route path="/order">
          <GetCurrentOrder />
        </Route>
        <Route path="/:orderId/order_items">
          <GetOrderItems />
        </Route>
        {/* <Route path="/items/:itemId/customize">
          <CreateCustomizedItem />
        </Route> */}
        <Route path="/:itemId/customize">
          <CreateCustomizedItem />
        </Route>
        <Route path="/my-customized-items">
          <GetCustomizedItems />
        </Route>
        <Route path="/sign-up" exact={true}>
          <SignUpForm />
        </Route>
        <ProtectedRoute path="/users" exact={true}>
          <UsersList />
        </ProtectedRoute>
        <ProtectedRoute path="/users/:userId" exact={true}>
          <User />
        </ProtectedRoute>
        <ProtectedRoute path="/" exact={true}>
          <h1>My Home Page</h1>
        </ProtectedRoute>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
