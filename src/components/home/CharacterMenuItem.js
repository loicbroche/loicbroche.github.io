import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import './CharacterMenuItem.css'
import { ROUTE_CHARACTER } from '../../App'

const deleteImage = require('../../images/delete-character-icone.png');
const CharacterMenuItem = ({ name, onRemove}) => (
      <div className="character-menu-item">
        <Link to={`${ROUTE_CHARACTER}/${name}`}>
          {name}
        </Link>
        <button onClick={() => {if(window.confirm(`Êtes-vous certain de vouloir supprimer la fiche personnage de ${name} ?`)) {onRemove(name);}} } className="delete-button">
          <img src={deleteImage} alt={`Supprimer la fiche personnage de ${name}`} className="delete-image" />
        </button>
      </div>
    )

  CharacterMenuItem.propTypes = {
    name: PropTypes.string.isRequired,
    onRemove: PropTypes.func.isRequired
  }

export default CharacterMenuItem
