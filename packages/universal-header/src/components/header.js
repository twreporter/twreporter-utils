import Channels from './channels'
import HeaderContext from '../contexts/header-context'
import Icons from './icons'
import Link from './customized-link'
import PropTypes from 'prop-types'
import React from 'react'
import linkUtils from '../utils/links'
import themeUtils from '../utils/theme'
import styled from 'styled-components'
// @twreporter
import { arrayToCssShorthand } from '@twreporter/core/lib/utils/css'
import mq from '@twreporter/core/lib/utils/media-query'

const styles = {
  headerHeight: 109, // px
  topRowPadding: {
    tablet: [34, 20, 35, 35], // px
    desktop: [34, 58, 35, 70], // px
  },
  topRowMaxWidth: {
    tablet: 768, // px
    desktop: 1024,
    hd: 1440, // px
  },
}

const Box = styled.div`
  box-sizing: border-box;
  position: relative;
  width: 100%;
  a:link,
  a:visited,
  a:hover,
  a:active {
    text-decoration: none;
  }
`

const TopRow = styled.div`
  background-color: ${props => props.bgColor};
  height: ${styles.headerHeight}px;
`

const TopRowContent = styled.div`
  ${mq.tabletOnly`
    padding: ${arrayToCssShorthand(styles.topRowPadding.tablet)};
    max-width: ${styles.topRowMaxWidth.tablet}px;
  `}
  ${mq.desktopAndAbove`
    padding: ${arrayToCssShorthand(styles.topRowPadding.desktop)};
    max-width: ${styles.topRowMaxWidth.hd}px;
  `}
  box-sizing: border-box;
  height: ${styles.headerHeight}px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
`

class Header extends React.PureComponent {
  static propTypes = {
    pathname: PropTypes.string,
    channels: Channels.propTypes.data,
    services: PropTypes.array,
  }
  static defaultProps = {
    pathname: '',
    channels: Channels.defaultProps.data,
    services: [],
  }

  render() {
    const { pathname, channels, services } = this.props

    const channelJSX = <Channels currentPathname={pathname} data={channels} />
    return (
      <Box>
        <HeaderContext.Consumer>
          {({ releaseBranch, isLinkExternal, theme }) => {
            const bgColor = themeUtils.selectBgColor(theme)
            const Logo = themeUtils.selectLogoComponent(theme)
            return (
              <TopRow bgColor={bgColor}>
                <TopRowContent>
                  <Link
                    {...linkUtils.getLogoLink(isLinkExternal, releaseBranch)}
                  >
                    <Logo />
                  </Link>
                  <Icons services={services} />
                </TopRowContent>
              </TopRow>
            )
          }}
        </HeaderContext.Consumer>
        {channelJSX}
      </Box>
    )
  }
}

export default Header
