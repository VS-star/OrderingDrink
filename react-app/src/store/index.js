import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import session from "./session";
import itemsReducer from "./items";
import customizedItemsReducer from "./customizedItem";
import ordersReducer from "./orders";
import order_itemsReducer from "./order_items";

const rootReducer = combineReducers({
  session,
  items: itemsReducer,
  customized_items: customizedItemsReducer,
  order: ordersReducer,
  order_items: order_itemsReducer,
});

let enhancer;

if (process.env.NODE_ENV === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require("redux-logger").default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
