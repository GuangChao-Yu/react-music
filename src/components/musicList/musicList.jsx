import React from 'react'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

import Loading from 'base/loading/loading'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/songlist/songlist'

import {selectPlay, randomPlay} from 'store/action'

import './musicList.styl'