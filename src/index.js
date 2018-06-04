import React from 'react'
import ReactDom from 'react-dom'
import RouteConfig from './router'
import {
  createStore,
  applyMiddleware,
  compose
} from 'redux'
import {
  Provider
} from 'react-redux'
import thunk from 'redux-thunk'
import reducer from 'store/index'
import './common/style/index.styl'

const store = createStore(
  reducer,
  compose(applyMiddleware(thunk), window.devToolsExtension ? window.devToolsExtension() : f => f)
)

ReactDom.render(
  <Provider store={store}>
    <RouteConfig></RouteConfig>
  </Provider>
  ,document.getElementById('root')
)