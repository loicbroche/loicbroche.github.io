import PropTypes from 'prop-types'

export const MAX_CARACTERISTIC = 20;
export const BONUS_STEP = 2;

const calculateBonus = (value, maxVal = MAX_CARACTERISTIC, bonusStep = BONUS_STEP) => {
    return Math.floor((value-(maxVal/2))/bonusStep);
}

calculateBonus.propTypes = {
  value: PropTypes.number.isRequired,
  maxVal: PropTypes.number,
  bonusStep: PropTypes.number
}

export const calculateTotalBonus = (value, raceBonus, subRaceBonus, maxVal = MAX_CARACTERISTIC, bonusStep = BONUS_STEP, bonusMax = null) => {
  const bonus = calculateBonus(value + raceBonus + subRaceBonus, maxVal, bonusStep);
  return (bonusMax || bonusMax === 0)?Math.min(bonus, bonusMax):bonus;
}

calculateTotalBonus.propTypes = {
  value: PropTypes.number.isRequired,
  raceBonus: PropTypes.number.isRequired,
  subRaceBonus: PropTypes.number.isRequired,
  maxVal: PropTypes.number,
  bonusStep: PropTypes.number,
  bonusMax: PropTypes.number
}