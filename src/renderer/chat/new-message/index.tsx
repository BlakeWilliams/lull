import React from 'react'
import { connect } from 'react-redux'
import { sendMessage } from '@renderer/actions'

import styles from './style.scss'

interface Props {
  sendMessage: typeof sendMessage
}

interface State {
  inputValue: string
}

class NewMessage extends React.Component<Props, State> {
  state = {
    inputValue: '',
  }

  handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      this.props.sendMessage(this.state.inputValue)
      this.setState({ inputValue: '' })
    }
  }

  handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({ inputValue: event.currentTarget.value })
  }

  render() {
    const { inputValue } = this.state

    return (
      <div className={styles.container}>
        <input
          onKeyUp={this.handleKeyUp}
          className={styles.input}
          placeholder="Message"
          onChange={this.handleChange}
          value={inputValue}
        />
      </div>
    )
  }
}

export default connect(
  undefined,
  { sendMessage },
)(NewMessage)
