import React from 'react'
import { connect } from 'react-redux'
import { Team } from '@common/types'
import { AppState } from '@renderer/store'

import styles from './style.scss'

interface Props {
  team: Team
}

class Servers extends React.Component<Props> {
  render() {
    const { team } = this.props

    return (
      <div className={styles.container}>
        <img className={styles.image} src={team.image132} />
        <span className={styles.name}>{team.name}</span>
      </div>
    )
  }
}

const mapStateToProps = function(state: AppState) {
  return {
    team: state.teams.teams[state.teams.selectedTeam!],
  }
}

export default connect(mapStateToProps)(Servers)
