import React from 'react'
import PropTypes from 'prop-types'
import { SkillPropType } from 'PropTypes';


import './Skills.css'

const Skills = ({ skills, master, onClick }) => (
  <ul className='skills'>
    {skills && Object.values(skills).map(({Caracteristic, Name}, index) => (
      <li key={index} className="skill" onClick={() => onClick(Name)}>
        <div className={"option "+((master && master.includes(Name))?"filled":"")}></div>
        <span className="skill-name">{Name}</span>
        <span>( {Caracteristic} )</span>
      </li>
    ))}
  </ul>
)

Skills.propTypes = {
  skills: PropTypes.arrayOf(SkillPropType).isRequired,
  master: PropTypes.arrayOf(PropTypes.string),
  onClick: PropTypes.func.isRequired,
}

export default Skills