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
  textarea = React.createRef<HTMLTextAreaElement>()

  state = {
    inputValue: '',
  }

  handleKeyUp = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      this.props.sendMessage(this.state.inputValue)
      this.setState({ inputValue: '' })
    }
  }

  handleChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
    this.setState({ inputValue: event.currentTarget.value })
  }

  handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = this.textarea.current
    textarea.style.height = 'auto'
    textarea.style.height = textarea.scrollHeight + 'px'
  }

  render() {
    const { inputValue } = this.state

    return (
      <div className={styles.container}>
        <textarea
          ref={this.textarea}
          onInput={this.handleInput}
          onKeyUp={this.handleKeyUp}
          className={styles.input}
          placeholder="Message"
          onChange={this.handleChange}
          value={inputValue}
          rows={1}
        />
      </div>
    )
  }
}

export default connect(
  undefined,
  { sendMessage },
)(NewMessage)
