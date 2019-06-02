import React from 'react'
import { connect } from 'react-redux'
import { Team } from '@common/types'
import { AppState } from '@renderer/store'
import { openLogin } from '@renderer/lull-commands'

import { selectTeam } from '@renderer/actions'

import styles from './style.scss'

interface Props {
  team: Team
  teams: Team[]
  selectTeam: typeof selectTeam
}

interface State {
  expanded: boolean
}

class Servers extends React.Component<Props, State> {
  state = {
    expanded: false,
  }

  toggleExpand = () => {
    this.setState({ expanded: !this.state.expanded })
  }

  selectTeam = (id: string) => {
    this.props.selectTeam(id)
    this.setState({ expanded: false })
  }

  render() {
    const { expanded } = this.state
    const { team, teams } = this.props

    const teamsWithoutCurrent = teams.filter(thisTeam => thisTeam !== team)

    return (
      <div>
        <div onClick={this.toggleExpand} className={styles.container}>
          <img className={styles.image} src={team.image132} />
          <span className={styles.name}>{team.name}</span>
        </div>
        {expanded &&
          teamsWithoutCurrent.map(team => (
            <div
              className={styles.container}
              key={team.id}
              onClick={() => this.selectTeam(team.id)}
            >
              <img className={styles.image} src={team.image132} />
              <span className={styles.name}>{team.name}</span>
            </div>
          ))}
        {expanded && (
          <div className={styles.container} key={team.id} onClick={openLogin}>
            >
            <img className={styles.image} />
            <span className={styles.name}>Add New Team</span>
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = function(state: AppState) {
  return {
    team: state.teams.teams[state.teams.selectedTeam!],
    teams: Object.values(state.teams.teams),
  }
}

export default connect(
  mapStateToProps,
  { selectTeam },
)(Servers)
