import React, {Component} from 'react'
import './loading.styl'

export default class Loading extends Component {
  render() {
    return (
      <div className="loading-content">
        <div className="loading-wrapper">
          <img
            src={require('../../common/images/loading.gif')}
            width="36"
            height="36"
            alt=""
          />
          <p className="desc">{this.props.title}</p>
        </div>
      </div>
    )
  }
}
