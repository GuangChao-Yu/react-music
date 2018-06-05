import React, {Component} from 'react'
import PropTypes from 'prop-types'
import './songlist.styl'

class SongList extends Component {
  constructor(props) {
    super(props)
    this.selectItem = this.selectItem.bind(this)
    this.getRankCls = this.getRankCls.bind(this)
    this.getRankText = this.getRankText.bind(this)
  }

  selectItem(v, i) {
    console.log(v, i)
    if (this.props.select) {
      this.props.select(v, i)
    }
  }
  getRankCls(i) {
    if (i <= 2) {
      return `icon icon${index}`
    } else {
      return 'text'
    }
  }

  getRankText(i) {
    if (i > 2) {
      return i + 1
    }
  }

  render() {
    return (
      <div className="song-list">
        <ul>
          {this.props.songs.length
            ? this.props.songs.map((v, i) => {
                return (
                  <li
                    className="item"
                    key={v.mid}
                    onClick={this.selectItem(v, i)}
                  >
                    {this.props.rank ? (
                      <div className="rank">
                        <span className={this.getRankCls(i)}>
                          {this.getRankText(i)}
                        </span>
                      </div>
                    ) : null}
                    <div className="content">
                      <h2 className="name">{v.name}</h2>
                      <p className="desc">{`${v.singer}·${v.album}`}</p>
                    </div>
                  </li>
                )
              })
            : null}
        </ul>
      </div>
    )
  }
}

SongList.propTypes = {
  songs: PropTypes.array,
  rank: PropTypes.bool,
  select: PropTypes.func.isRequired
}

SongList.defaultProps = {
  songs: [],
  rank: false,
  select: null
}

export default SongList
