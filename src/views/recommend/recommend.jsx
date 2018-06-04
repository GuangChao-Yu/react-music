import React, {Component} from 'react'

import {getRecommend, getDiscList} from 'api/recommend'
import {ERR_OK} from 'api/config'

import Loading from '../../components/loading/loading'
import Scroll from '../../components/scroll/scroll'
import Swiper from 'swiper'

import LazyLoad, {forceCheck} from 'react-lazyload'

import './recommend.styl'
import 'swiper/dist/css/swiper.css'

class Recommend extends Component {
  constructor(props) {
    super(props)
    this.state = {
      refresh: false,
      recommends: [],
      discList: []
    }
  }
  componentWillMount() {
    getRecommend().then(res => {
      if (res.code === ERR_OK) {
        this.setState(
          {
            recommends: res.data.slider
          },
          () => {
            if (!this.swiper) {
              this.swiper = new Swiper('.swiper-container', {
                loop: true,
                autoplay: 3000,
                autoplayDisableOnInteraction: false,
                pagination: '.swiper-pagination'
              })
            }
          }
        )
      }
    })

    getDiscList().then(res => {
      if (res.code === ERR_OK) {
        this.setState({
          discList: res.data.list
        })
      }
    })
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log(nextState)
    return true
  }

  render() {
    let {match} = this.props
    console.log(this.state.recommends)
    return (
      <div className="recommend-wrapper" ref="recommends">
        <Scroll
          ref="list"
          probeType={3}
          data={this.state.discList}
          onScroll={() => forceCheck()}
        >
          <div className="swiper-container">
            <div className="swiper-wrapper">
              {this.state.recommends.map((v, i) => {
                ;<div className="swiper-slide" key={v.linkUrl}>
                  <a href={v.linkUrl} className="slider-nav">
                    <img src={v.picUrl} width="100%" height="100%" alt="" />
                  </a>
                </div>
              })}
            </div>
            <div className="swiper-pagination" />
          </div>
        </Scroll>
      </div>
    )
  }
}

export default Recommend
