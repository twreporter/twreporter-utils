import BookmarkIcon from '../../static/bookmark-list-icon.svg'
import DonationIcon from '../../static/donate-icon.svg'
import Header from '../components/header'
import HeaderContext from '../contexts/header-context'
import LoginIcon from '../../static/member-icon.svg'
import LogoutIcon from '../../static/logout.svg'
import MobileHeader from '../components/mobile-header'
import PropTypes from 'prop-types'
import React from 'react'
import SearchIcon from '../../static/search-icon.svg'
import SubscriptionIcon from '../../static/subscribe-icon.svg'
import categoryConst from '../constants/categories'
import channelConst from '../constants/channels'
import linkUtils from '../utils/links'
import serviceConst from '../constants/services'
import styled from 'styled-components'
import wellDefinedPropTypes from '../constants/prop-types'
import { connect } from 'react-redux'
// @twreporter
import mq from '@twreporter/core/lib/utils/media-query'
// lodash
import get from 'lodash/get'
import map from 'lodash/map'

const _ = {
  get,
  map,
}

const MobileOnly = styled.div`
  display: none;

  ${mq.mobileOnly`
    display: block;
  `}
`

const NonMobileOnly = styled.div`
  display: block;

  ${mq.mobileOnly`
    display: none;
  `}
`

function mergeTwoArraysInOrder(arr1 = [], arr2 = []) {
  const rtn = []
  const maxLength = Math.max(arr1.length, arr2.length)

  for (let i = 0; i < maxLength; i++) {
    if (arr1[i]) {
      rtn.push(arr1[i])
    }
    if (arr2[i]) {
      rtn.push(arr2[i])
    }
  }

  return rtn
}

function selectIconElement(serviceKey) {
  switch (serviceKey) {
    case 'login': {
      return <LoginIcon />
    }
    case 'logout': {
      return <LogoutIcon />
    }
    case 'search': {
      return <SearchIcon />
    }
    case 'bookmarks': {
      return <BookmarkIcon />
    }
    case 'support': {
      return <DonationIcon />
    }
    case 'newsLetter': {
      return <SubscriptionIcon />
    }
    default:
      return null
  }
}

class Container extends React.PureComponent {
  static defaultProps = {
    ...wellDefinedPropTypes.context.defaultProps,
    pathname: '',
  }
  static propTypes = {
    ...wellDefinedPropTypes.context.propTypes,
    pathname: PropTypes.string,
  }

  __prepareServiceProps(releaseBranch, isAuthed, isLinkExternal) {
    const serviceLinks = linkUtils.getServiceLinks(
      isLinkExternal,
      releaseBranch
    )

    const desktopServiceProps = _.map(serviceConst.serviceOrder.desktop, key => ({ key }));
    const mobileServiceProps = _.map(serviceConst.serviceOrder.mobile, (key) => {
      return {
        key,
        label: serviceConst.serviceLabels[key],
        link: serviceLinks[key],
        icon: selectIconElement(key),
      }
    })

    if (isAuthed) {
      const bookmarkKey = serviceConst.serviceKeys.bookmarks
      const logoutKey = serviceConst.serviceKeys.logout
      desktopServiceProps.push({ key: logoutKey })
      mobileServiceProps.unshift({
        key: logoutKey,
        label: serviceConst.serviceLabels[logoutKey],
        link: serviceLinks[logoutKey],
        icon: selectIconElement(logoutKey),
      })
    } else {
      const loginKey = serviceConst.serviceKeys.login
      desktopServiceProps.push({ key: loginKey })
      mobileServiceProps.unshift({
        key: loginKey,
        label: serviceConst.serviceLabels[loginKey],
        link: serviceLinks[loginKey],
        icon: selectIconElement(loginKey),
      })
    }

    return { desktop: desktopServiceProps, mobile: mobileServiceProps }
  }

  __prepareChannelProps(releaseBranch, isLinkExternal) {
    const channelProps = _.map(channelConst.channelOrder, (key) => {
      return {
        key,
        label: channelConst.channelLabels[key],
        type: channelConst.channelTypes[key],
        pathname: channelConst.channelPathnames[key],
        link: linkUtils.getChannelLinks(isLinkExternal, releaseBranch)[key],
      }
    })

    return channelProps
  }

  __prepareCategoriesProps(releaseBranch, isLinkExternal, channelProps) {
    channelProps[
      channelProps.length - 1
    ].dropDownMenu = _.map(categoryConst.categoryOrder, (key) => {
      return {
        key,
        label: categoryConst.categoryLabels[key],
        pathname: categoryConst.categoryPathnames[key],
        link: linkUtils.getCategoryLinks(isLinkExternal, releaseBranch)[key],
      }
    })
  }

  render() {
    const {
      releaseBranch,
      isAuthed,
      isLinkExternal,
      theme,
      ...passThrough
    } = this.props
    const contextValue = {
      releaseBranch,
      isAuthed,
      isLinkExternal,
      theme,
    }

    const serviceProps = this.__prepareServiceProps(
      releaseBranch,
      isAuthed,
      isLinkExternal
    )
    const channelProps = this.__prepareChannelProps(
      releaseBranch,
      isLinkExternal
    )
    const mobileMenu = mergeTwoArraysInOrder(channelProps, serviceProps.mobile)

    this.__prepareCategoriesProps(releaseBranch, isLinkExternal, channelProps)

    return (
      <HeaderContext.Provider value={contextValue}>
        <MobileOnly>
          <MobileHeader menu={mobileMenu} {...passThrough} />
        </MobileOnly>
        <NonMobileOnly>
          <Header channels={channelProps} services={serviceProps.desktop} {...passThrough} />
        </NonMobileOnly>
      </HeaderContext.Provider>
    )
  }
}

function mapStateToProps(state) {
  return {
    isAuthed: _.get(state, 'auth.isAuthed', false),
    // bookmarks: _.get(state, 'header.bookmarks'),
    // notifications: _.get(state, 'headers.notifications'),
  }
}

export default connect(mapStateToProps)(Container)
