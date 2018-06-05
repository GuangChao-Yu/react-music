import React, {Component} from 'react'
import PropTypes from 'prop-types'
import BScroll from 'better-scroll'
import './scroll.styl'

class Scroll extends Component {
  constructor(props) {
    super(props)
    this.refresh = this.refresh.bind(this)
    this.initScroll = this.initScroll.bind(this)
    this.enable = this.enable.bind(this)
  }
  componentDidMount() {
    this.timmer = setTimeout(() => {
      this.initScroll()
    }, 20)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      setTimeout(() => {
        this.refresh()
      }, this.props.refreshDelay)
    }
  }

  componentWillUnmount() {
    this.scroll.off('scroll')
    this.scroll = null
  }

  refresh() {
    this.scroll && this.scroll.refresh()
  }

  disable() {
    this.scroll && this.scroll.disable()
  }

  enable() {
    this.scroll && this.scroll.enable()
  }

  scrollTo() {
    this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
  }

  scrollToElement() {
    this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
  }

  initScroll() {
    if (!this.refs.scrollWrapper) return
    this.scroll = new BScroll(this.refs.scrollWrapper, {
      click: this.props.click,
      probeType: this.props.probeType
    })
    if (this.props.onScroll) {
      this.scroll.on('scroll', scroll => {
        this.props.onScroll(scroll)
      })
    }

    if (this.props.scrollToEnd) {
      this.scroll.on('scrollEnd', () => {
        if (this.scroll.y <= this.scroll.maxScrollY + 50) {
          this.props.scrollToEnd()
        }
      })
    }

    if (this.props.scrollToTop) {
      this.scroll.on('scrollTop', pos => {
        if (pos.y > 50) {
          this.props.scrollTop()
        }
      })
    }

    if (this.props.onBeforeScroll) {
      this.scroll.on('beforeScrollStart', () => {
        this.props.onBeforeScroll()
      })
    }
  }

  render() {
    return (
      <div
        className={
          this.props.className ? this.props.className : 'scroll-wrapper'
        }
        ref="scrollWrapper"
      >
        {this.props.children}
      </div>
    )
  }
}

Scroll.propTypes = {
  data: PropTypes.array,
  probeType: PropTypes.number,
  click: PropTypes.bool,
  onScroll: PropTypes.func,
  scrollToEnd: PropTypes.func,
  scrollToTop: PropTypes.func,
  onBeforeScroll: PropTypes.func,
  refreshDelay: PropTypes.number
}

Scroll.defaultProps = {
  data: null,
  probeType: 1,
  click: true,
  onScroll: null,
  scrollToEnd: null,
  scrollToTop: null,
  onBeforeScroll: null,
  refreshDelay: 20
}

export default Scroll
