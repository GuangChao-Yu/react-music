import React, {Component} from 'react'
import {NavLink} from 'react-router-dom'
import './header.styl'

class Headers extends Component {
  render() {
    return (
      <div className="m-header">
        <div className="icon" />
        <h1 className="text">React-Music</h1>
        <NavLink to="/user" className="mine">
          <i className="icon-mine" />
        </NavLink>
      </div>
    )
  }
}

export default Headers
