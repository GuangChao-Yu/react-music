import React, {Component} from 'react'
import PropTypes from 'prop-types'

import LazyLoad, {forceCheck} from 'react-lazyload'
import Loading from '../loading/loading'
import Scroll from '../scroll/scroll'

import './listview.styl'

const TITLE_HEIGHT = 30
const ANCHOR_HEIGHT = 18

class ListView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      diff: -1,
      currentIndex: 0,
      scrollY: -1,
      shortcutList: []
    }
    this.touch = {}
    this.listHeight = []

    this.handlerScroll = this.handlerScroll.bind(this)
    this.onShortcutTouchStart = this.onShortcutTouchStart.bind(this)
    this.onShortcutTouchMove = this.onShortcutTouchMove.bind(this)
    this.onShortcutTouchEnd = this.onShortcutTouchEnd.bind(this)
    this._scrollTo = this._scrollTo.bind(this)
    this._calculateHeight = this._calculateHeight.bind(this)
    this._getCurrentIndex = this._getCurrentIndex.bind(this)
    this._getDiff = this._getDiff.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      shortcutList: nextProps.data.map(v => v.title.substr(0, 1))
    })
  }

  shouldComponentUpdate(newProps, newState) {
    if (this.props.data.length !== newProps.data.length) {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    }

    // 滚动实时改变scrollY，进而改变currentIndex值，这两个值都需要判断，如果改变了，需要更新视图改变fixedTitle
    if (this.state.currentIndex !== newState.currentIndex) {
      return true
    }
    if (this.state.scrollY !== newState.scrollY) {
      return this._getCurrentIndex(newProps, newState)
    }
    if (this.state.diff !== newState.diff) {
      return this._getDiff(newProps, newState)
    }
    return true
  }

  _calculateHeight() {
    const list = [...this.refs.listGroup.children]
    let height = 0
    this.listHeight.push(height)
    for (let i = 0; i < list.length; i++) {
      let item = list[i]
      height += item.clientHeight
      this.listHeight.push(height)
    }
  }

  _getCurrentIndex(newProps, newState) {
    const newY = newState.scrollY
    const listHeight = this.listHeight
    // 当滚动到顶部，newY>0
    if (newY > 0) {
      this.setState({currentIndex: 0})
      return false
    }
    // 在中间部分滚动
    for (let i = 0; i < listHeight.length - 1; i++) {
      let height2 = listHeight[i + 1]
      let height1 = listHeight[i]
      if (-newY >= height1 && -newY < height2) {
        this.setState({
          diff: height2 + newY,
          currentIndex: i
        })
        return false
      }
    }

    // 当滚动到底部，且-newY大于最后一个元素的上限
    this.setState({currentIndex: listHeight.length - 2})

    return false
  }

  _getDiff(newProps, newState) {
    const newVal = newState.diff
    let fixedTop =
      newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0
    if (this.fixedTop === fixedTop) {
      return false
    }
    this.fixedTop = fixedTop
    this.refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    return false
  }

  refresh() {
    this.refs.listview.refresh()
  }

  handlerScroll(pos) {
    this.setState({
      scrollY: pos.y
    })
    forceCheck()
  }

  onShortcutTouchStart(e) {
    let index = e.target.dataset.index
    let firstTouch = e.touches[0]
    this.touch.y1 = firstTouch.pageY
    this.touch.index = index
  }
  onShortcutTouchMove(e) {
    e.stopPropagation()
    let firstTouch = e.touches[0]
    this.touch.y2 = firstTouch.pageY
    let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0
    let index = parseInt(this.touch.index, 10) + delta
    this._scrollTo(index)
  }
  onShortcutTouchEnd(e) {
    e.stopPropagation()
  }
  _scrollTo(index) {
    if (!index && index !== 0) {
      return
    }
    if (index < 0) {
      index = 0
    } else if (index > this.listHeight.length - 2) {
      index = this.listHeight.length - 2
    }
    this.refs.listview.scrollToElement(
      [...this.refs.listGroup.children][index],
      0
    )
    this.setState({
      scrollY: this.refs.listview.scroll.y
    })
    forceCheck()
  }

  render() {
    return (
      <Scroll
        className="listview"
        ref="listview"
        probeType={3}
        data={this.props.data}
        onScroll={this.handlerScroll}
      >
        <ul ref="listGroup">
          {this.props.data.length
            ? this.props.data.map((v, i) => {
                return (
                  <li className="list-group" key={v.title}>
                    <h2 className="list-group-title">{v.title}</h2>
                    <ul>
                      {v.items.map(k => {
                        return (
                          <li
                            className="list-group-item"
                            key={k.id}
                            onClick={() => this.props.selectItem(k)}
                          >
                            <LazyLoad height={50}>
                              <img src={k.avatar} alt="" className="avatar" />
                            </LazyLoad>
                            <span className="name">{k.name}</span>
                          </li>
                        )
                      })}
                    </ul>
                  </li>
                )
              })
            : null}
        </ul>
        <div
          className="list-shortcut"
          onTouchStart={this.onShortcutTouchStart}
          onTouchMove={this.onShortcutTouchMove}
          onTouchEnd={this.onShortcutTouchEnd}
        >
          <ul>
            {this.state.shortcutList.length
              ? this.state.shortcutList.map((v, i) => {
                  return (
                    <li
                      key={v}
                      className={
                        'item' +
                        (this.state.currentIndex === i ? ' current' : '')
                      }
                      data-index={i}
                    >
                      {v}
                    </li>
                  )
                })
              : null}
          </ul>
        </div>
        <div className="list-fixed" ref="fixed">
          {this.state.scrollY < 0 ? (
            <div className="fixed-title">
              {this.props.data[this.state.currentIndex]
                ? this.props.data[this.state.currentIndex].title
                : ''}
            </div>
          ) : null}
        </div>
        {!this.props.data.length ? <Loading /> : null}
      </Scroll>
    )
  }
}

ListView.propTypes = {
  data: PropTypes.array,
  refresh: PropTypes.bool,
  selectItem: PropTypes.func
}

ListView.defaulProps = {
  data: [],
  refresh: false,
  selectItem: null
}

export default ListView
