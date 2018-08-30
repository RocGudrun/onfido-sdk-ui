// @flow
import * as React from 'react'
import { h } from 'preact'

import PermissionsPrimer from '../CameraPermissions/Primer'
import PermissionsRecover from '../CameraPermissions/Recover'
import { isDesktop } from '../utils'

import classNames from 'classnames'
import style from './style.css'

const permissionErrors = ['PermissionDeniedError', 'NotAllowedError', 'NotFoundError']

type CameraStateType = {
  hasGrantedPermission: ?boolean,
  hasSeenPermissionsPrimer: boolean,
}

export default Camera =>
  class WithPermissionFlow extends Component<Props, State> {
    state: CameraStateType = {
      hasGrantedPermission: undefined,
      hasSeenPermissionsPrimer: false,
    }

    componentDidMount() {
      checkIfWebcamPermissionGranted(value =>
        this.setState({ hasGrantedPermission: value || undefined }))
    }

    setPermissionsPrimerSeen = () => {
      this.setState({ hasSeenPermissionsPrimer: true })
    }

    handleUserMedia = () => {
      this.setState({ hasGrantedPermission: true })
    }

    handleWebcamFailure = (error: Error) => {
      if (permissionErrors.includes(error.name)) {
        this.setState({ hasGrantedPermission: false })
      } else {
        this.props.onFailure()  
      }
    }

    render() {
      const { hasSeenPermissionsPrimer, hasGrantedPermission } = this.state
      const { i18n } = this.props

      return (
        hasGrantedPermission === false ?
          <PermissionsRecover {...{i18n}} /> :
          (hasGrantedPermission || hasSeenPermissionsPrimer) ?
            <Camera
              {...props}
              hasGrantedPermission={hasGrantedPermission}
              onUserMedia={this.handleUserMedia}
              onFailure={this.handleWebcamFailure}
            />
            :
            <PermissionsPrimer {...{i18n}}
              onNext={this.setPermissionsPrimerSeen}
            />
      )
    }
  }

