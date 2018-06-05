import React,{Component} from 'react'
import {BrowserRouter as Router,Route,Switch,Redirect} from 'react-router-dom'

import LazyLoadComponent from '../common/js/lazyload'

const Headers=LazyLoadComponent({loader:()=>import('../components/header/header')})
const NavBar=LazyLoadComponent({loader:()=>import('../components/navBar/navbar')})
const Recommend=LazyLoadComponent({loader:()=>import('../views/recommend/recommend')})
const Singer=LazyLoadComponent({loader:()=>import('../views/singer/singer')})

export default class RouteConfig extends Component{
  render(){
    return(
      <Router>
        <div className="app-wrapper">
          <Headers></Headers>
          <NavBar></NavBar>
          <div className="app-view">
          <Switch>
            <Route path="/recommend" component={Recommend}></Route>
            <Route path="/singer" component={Singer}></Route>
            <Redirect from="/" to="/recommend"></Redirect>
            <Route component={Recommend}></Route>
          </Switch>
          </div>
        </div>
      </Router>
    )
  }
}