
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { calculateTotalBonus, MAX_CARACTERISTIC, BONUS_STEP } from 'rules/Caracteristics.rules'
import './CaracteristicBonus.css'

class CaracteristicBonus extends PureComponent {

  render() {
    const { races, subRaces, caracteristicName, value, subRaceId, maxVal, bonusStep, bonusMax } = this.props;

    const subRace = subRaces?.[subRaceId];
    const race = races?.[subRace?.Race];

    const raceBonus = race?.[caracteristicName];
    const subRaceBonus = subRace?.[caracteristicName];
    const bonus = calculateTotalBonus(value, raceBonus, subRaceBonus, maxVal, bonusStep, bonusMax);

    return <span className={caracteristicName}>{(bonus>=0?"+":"")+bonus}</span>
  }
}

CaracteristicBonus.propTypes = {
  caracteristicName: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  maxVal: PropTypes.number.isRequired,
  bonusStep: PropTypes.number.isRequired,
  bonusMax: PropTypes.number,
  subRaceId: PropTypes.string
}

CaracteristicBonus.defaultProps = {
  value: 0,
  maxVal: MAX_CARACTERISTIC,
  bonusStep: BONUS_STEP
}

const mapStateToProps = (state) => ({
  races: state.referential.races,
  subRaces: state.referential.subRaces
})
export default connect(mapStateToProps)(CaracteristicBonus)
