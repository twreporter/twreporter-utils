import { replaceGCSUrlOrigin } from '@twreporter/core/lib/utils/storage-url-processor'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
// lodash
import get from 'lodash/get'

const _ = {
  get,
}

const ImgObjectFit = styled.div`
  width: 100%;
  height: 100%;

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const ImgFallback = styled.div`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-image: ${props => {
    return `url(${_.get(props, 'url')})`
  }};
  background-position: center center;
`

class ImgWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isObjectFit: true,
    }
  }

  componentDidMount() {
    this.setState({
      isObjectFit: 'objectFit' in _.get(document, 'documentElement.style'),
    })
  }

  render() {
    const { src, alt, srcSet } = this.props
    const isObjectFit = this.state.isObjectFit

    return isObjectFit ? (
      <ImgObjectFit>
        <img
          alt={alt}
          src={replaceGCSUrlOrigin(src)}
          srcSet={srcSet}
          style={{
            transform: 'translateZ(0)',
          }}
        />
        {this.props.children}
      </ImgObjectFit>
    ) : (
      <ImgFallback url={replaceGCSUrlOrigin(src)}>
        {this.props.children}
      </ImgFallback>
    )
  }
}

ImgWrapper.defaultProps = {
  alt: '',
  children: null,
  src: '',
  srcSet: '',
}

ImgWrapper.propTypes = {
  alt: PropTypes.string,
  children: PropTypes.node,
  src: PropTypes.string.isRequired,
  srcSet: PropTypes.string,
}

export default ImgWrapper
