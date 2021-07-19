import HeaderContext from '../contexts/header-context'
import Link from './customized-link'
import PropTypes from 'prop-types'
import React from 'react'
import SearchBox from './search-box'
import fonts from '../constants/fonts'
import linkUtils from '../utils/links'
import querystring from 'querystring'
import serviceConst from '../constants/services'
import styled from 'styled-components'
import themeUtils from '../utils/theme'
// @twreporter
import mq from '@twreporter/core/lib/utils/media-query'
// lodash
import map from 'lodash/map'

const _ = {
  map,
}

const styles = {
  iconContainerSize: 3, // em
}

const IconsContainer = styled.div`
  position: relative;
  display: table;
  ${mq.mobileOnly`
    display: none;
  `}
`

const IconContainer = styled.div`
  font-size: ${fonts.size.base};
  cursor: pointer;
  display: table-cell;
  width: ${styles.iconContainerSize}em;
  height: ${styles.iconContainerSize}em;
  line-height: 1;
  vertical-align: middle;
  text-align: center;
  position: relative;
  opacity: ${props => (props.isSearchOpened ? '0' : '1')};
  transition: opacity 600ms ease;
  svg {
    height: 100%;
  }
  span {
    display: none;
  }
  ${mq.desktopAndAbove`
    svg {
      opacity: 1;
      transition: transform .3s ease-in-out, opacity .3s ease-in-out;
      position: absolute;
      height: 100%;
      top: 0;
      left: 30%;
      z-index: 1;
    }
    span {
      display: inline;
      white-space: nowrap;
      overflow: hidden;
      color: #808080;
      font-weight: ${fonts.weight.bold};
      opacity: 0;
      transition: transform .3s ease-in-out, opacity .3s ease-in-out;
      transform: scale(.4, 1.2);
      position: absolute;
      height: 100%;
      width: 2em;
      line-height: ${styles.iconContainerSize};
      vertical-align: middle;
      top: 0;
      left: 17%;
      z-index: 2;
    }
    &:hover {
      svg {
        transform: scale(1.7, .5);
        opacity: 0;
      }
      span {
        transform: scale(1, 1);
        opacity: 1;
      }
    }
  `}
`

const DisplayOnDesktop = styled(IconContainer)`
  display: none;
  ${mq.desktopAndAbove`
    display: table-cell;
  `}
`

const HideOnDesktop = styled(IconContainer)`
  display: table-cell;
  ${mq.desktopAndAbove`
    display: none;
  `}
`

class Icons extends React.PureComponent {
  static propTypes = {
    services: PropTypes.array,
  }

  static defaultProps = {
    services: [],
  }

  constructor(props) {
    super(props)
    this.state = {
      isSearchOpened: false,
    }
    this._closeSearchBox = this._closeSearchBox.bind(this)
    this._handleClickSearch = this._handleClickSearch.bind(this)
  }

  _closeSearchBox() {
    this.setState({
      isSearchOpened: false,
    })
  }

  _handleClickSearch(e) {
    e.preventDefault()
    this.setState({
      isSearchOpened: true,
    })
  }

  _handleLogIconClick = (e, isAuthed, releaseBranch) => {
    e.preventDefault()

    const redirectURL = window.location.href
    const query = querystring.stringify({
      destination: redirectURL,
    })
    if (isAuthed) {
      window.location = linkUtils.getLogoutLink(releaseBranch).to + '?' + query
      return
    }
    window.location = linkUtils.getLoginLink(releaseBranch).to + '?' + query
  }

  _prepareIconJsx(service) {
    const { isSearchOpened } = this.state
    const Login = (
      <IconContainer isSearchOpened={isSearchOpened}>
        <HeaderContext.Consumer>
          {({ releaseBranch, theme }) => {
            const LogInIcon = themeUtils.selectServiceIcons(theme).member
            return (
              <a
                onClick={e => {
                  this._handleLogIconClick(e, false, releaseBranch)
                }}
              >
                <React.Fragment>
                  <LogInIcon />
                  <span>{serviceConst.serviceLabels.login}</span>
                </React.Fragment>
              </a>
            )
          }}
        </HeaderContext.Consumer>
      </IconContainer>
    )
    const Logout = (
      <IconContainer isSearchOpened={isSearchOpened}>
        <HeaderContext.Consumer>
          {({ releaseBranch, theme }) => {
            const LogOutIcon = themeUtils.selectServiceIcons(theme).logout
            return (
              <a
                onClick={e => {
                  this._handleLogIconClick(e, true, releaseBranch)
                }}
              >
                <React.Fragment>
                  <LogOutIcon />
                  <span>{serviceConst.serviceLabels.logout}</span>
                </React.Fragment>
              </a>
            )
          }}
        </HeaderContext.Consumer>
      </IconContainer>
    )
    const Search = (
      <React.Fragment>
        <DisplayOnDesktop
          onClick={this._handleClickSearch}
          isSearchOpened={isSearchOpened}
        >
          <HeaderContext.Consumer>
            {({ theme }) => {
              const SearchIcon = themeUtils.selectServiceIcons(theme).search
              return <SearchIcon />
            }}
          </HeaderContext.Consumer>
          <span>{serviceConst.serviceLabels.search}</span>
        </DisplayOnDesktop>
        <SearchBox
          isSearchOpened={isSearchOpened}
          closeSearchBox={this._closeSearchBox}
        />
        <HideOnDesktop>
          <HeaderContext.Consumer>
            {({ releaseBranch, isLinkExternal, theme }) => {
              const SearchIcon = themeUtils.selectServiceIcons(theme).search
              const link = linkUtils.getSearchLink(
                isLinkExternal,
                releaseBranch
              )
              return (
                <Link {...link}>
                  <SearchIcon />
                  <span>{serviceConst.serviceLabels.search}</span>
                </Link>
              )
            }}
          </HeaderContext.Consumer>
        </HideOnDesktop>
      </React.Fragment>
    )
    const Bookmark = (
      <IconContainer isSearchOpened={isSearchOpened}>
        <HeaderContext.Consumer>
          {({ releaseBranch, isLinkExternal, theme }) => {
            const BookmarkIcon = themeUtils.selectServiceIcons(theme).bookmark
            const link = linkUtils.getBookmarksLink(
              isLinkExternal,
              releaseBranch
            )
            return (
              <Link {...link}>
                <BookmarkIcon />
                <span>{serviceConst.serviceLabels.bookmarks}</span>
              </Link>
            )
          }}
        </HeaderContext.Consumer>
      </IconContainer>

    )
    switch(service) {
      case 'login':
        return Login
      case 'logout':
        return Logout
      case 'search':
        return Search
      case 'bookmarks':
        return Bookmark
      case 'newsletter':
      case 'support':
      default:
        return null;
    }
  }

  render() {
    const { services } = this.props;
    return (
      <IconsContainer>
        { _.map(services, service => this._prepareIconJsx(service.key)) }
      </IconsContainer>
    )
  }
}

export default Icons
