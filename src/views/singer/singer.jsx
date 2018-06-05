import React, {Component} from 'react'
import {Route} from 'react-router-dom'
import {connect} from 'react-redux'

import ListView from '../../components/listview/listview'

import {getSingerList} from 'api/singer'
import Singers from 'common/js/singer'
import {ERR_OK} from 'api/config'

import {setSinger} from 'store/action'

import './singer.styl'

const HOT_NAME = '热门'

const HOT_LEN = 10

@connect(
  state => state,
  {setSinger}
)
class Singer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      singers: []
    }
    this._getSingerList = this._getSingerList.bind(this)
    this._normalizeSinger = this._normalizeSinger.bind(this)
    this.selectSinger = this.selectSinger.bind(this)
  }
  componentDidMount() {
    this._getSingerList()
  }

  shouldComponentUpdate(nextProps, nextState) {
    // const bottom = nextProps.player.playList.length > 0 ? '60px' : 0
    // this.refs.singer.style.bottom = bottom
    // this.refs.list.refresh()
    return true
  }

  _getSingerList() {
    getSingerList().then(res => {
      if (res.code === ERR_OK) {
        this.setState({
          singers: this._normalizeSinger(res.data.list)
        })
      }
    })
  }

  _normalizeSinger(list) {
    let map = {
      hot: {
        title: HOT_NAME,
        items: []
      }
    }
    list.forEach((item, index) => {
      if (index < HOT_LEN) {
        map.hot.items.push(
          new Singers({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          })
        )
      }
      const key = item.Findex
      if (!map[key]) {
        map[key] = {
          title: key,
          items: []
        }
      }
      map[key].items.push(
        new Singers({
          name: item.Fsinger_name,
          id: item.Fsinger_mid
        })
      )
    })

    let ret = []
    let hot = []
    for (let key in map) {
      let val = map[key]
      if (val.title.match(/[a-zA-Z]/)) {
        ret.push(val)
      } else if (val.title === HOT_NAME) {
        hot.push(val)
      }
    }
    ret.sort((a, b) => {
      return a.title.charCodeAt(0) - b.title.charCodeAt(0)
    })

    return hot.concat(ret)
  }

  selectSinger(v) {
    const {match} = this.props
    const url = `${match.url}/${v.id}`
    this.props.history.push(url)
    this.props.setSinger(v)
  }

  render() {
    let {match} = this.props
    return (
      <div className="singer-wrapper" ref="singer">
        <ListView
          data={this.state.singers}
          selectItem={this.selectSinger}
          ref="list"
        />
      </div>
    )
  }
}

export default Singer
