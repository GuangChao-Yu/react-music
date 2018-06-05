import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Route} from 'react-router-dom'

import {getRecommend, getDiscList} from 'api/recommend'
import {ERR_OK} from 'api/config'

import Loading from '../../components/loading/loading'
import Scroll from '../../components/scroll/scroll'
import Swiper from 'swiper'

import LazyLoad, {forceCheck} from 'react-lazyload'

import {setDisc} from 'store/action'

import './recommend.styl'
import 'swiper/dist/css/swiper.css'

@connect(
  state => state,
  {setDisc}
)
class Recommend extends Component {
  constructor(props) {
    super(props)
    this.state = {
      refresh: false,
      recommends: [],
      discList: []
    }
  }
  componentDidMount() {
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
    return true
  }

  selectAlbum(value) {
    const {match} = this.props
    const url = `${match.url}/${value.dissid}`
    this.props.history.push(url)
    this.props.setDisc(value)
  }

  render() {
    // let {match} = this.props
    return (
      <div className="recommend-wrapper" ref="recommends">
        <Scroll
          ref="list"
          probeType={3}
          data={this.state.discList}
          onScroll={() => forceCheck()}
        >
          <div>
            <div className="swiper-container">
              <div className="swiper-wrapper">
                {this.state.recommends.map((v, i) => {
                  return (
                    <div className="swiper-slide" key={v.linkUrl}>
                      <a href={v.linkUrl} className="slider-nav">
                        <img src={v.picUrl} width="100%" height="100%" alt="" />
                      </a>
                    </div>
                  )
                })}
              </div>
              <div className="swiper-pagination" />
            </div>
            <div className="recommend-list">
              <h1 className="list-title">热门歌单推荐</h1>
              <ul>
                {this.state.discList.length
                  ? this.state.discList.map((v, i) => {
                      return (
                        <li
                          className="item"
                          key={v.dissname}
                          onClick={() => this.selectAlbum(v)}
                        >
                          <div className="icon">
                            <LazyLoad height={60}>
                              <img
                                src={v.imgurl}
                                width="60"
                                height="60"
                                alt=""
                              />
                            </LazyLoad>
                          </div>
                          <div className="text">
                            <h2 className="name">{v.creator.name}</h2>
                            <p className="desc">{v.dissname}</p>
                          </div>
                        </li>
                      )
                    })
                  : null}
              </ul>
            </div>
          </div>
        </Scroll>
        {!this.state.discList.length ? <Loading title="正在加载..." /> : null}
      </div>
    )
  }
}

// Recommend = connect(
//   state => state,
//   {setDisc}
// )(Recommend)

export default Recommend
