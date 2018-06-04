import React from 'react'
import ReactDom from 'react-dom'
import RouteConfig from './router'
import './common/style/index.styl'

ReactDom.render(
  <RouteConfig></RouteConfig>,
  document.getElementById('root')
)