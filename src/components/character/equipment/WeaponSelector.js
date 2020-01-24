
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { CharacterPropType } from 'PropTypes'
import Money from 'components/shared/Money'
import Weight from 'components/shared/Weight'
import { filterDistanceCategories, filterHtHCategories } from 'rules/Weapons.rules'
import { getLevel } from 'rules/Levels.rules'

import './EquipmentSelector.css'

const mainStatImage = require("images/Damage.png");

class WeaponSelector extends Component {

  render() {
/**/const { equipmentCategories, equipments, levels, equipmentId, distance, wearingCharacter } = this.props;
/**/const filteredCategories = equipmentCategories && (distance?filterDistanceCategories(equipmentCategories):filterHtHCategories(equipmentCategories));
    const equipment = equipments && equipments[equipmentId];

/**/const equipmentType = distance?"distance-weapon":"weapon";
/**/const equipmentTitleLabel = distance?"Arme de jet":"Arme";
/**/const equipmentLabel = distance?"une arme de jet":"une arme";

const level = getLevel(levels, wearingCharacter && wearingCharacter.XP);
const masterBonus = level && level.MasteryBonus;

/**/const bonusContent = equipment && equipment.Damage &&
                        <div className={`main-stat-bonus-label master-bonus`}>
                          {"+"+masterBonus}            
                        </div>

/**/const bonusCode = "Dégâts";
/**/const bonusTitle = "Dégâts";
/**/const mainValue = equipment && equipment.Damage;
/**/const additionalInfo = distance && wearingCharacter && "x"+wearingCharacter.Ammunition;

    let equipmentImage;
    try {
      equipmentImage = equipment?require(`images/equipments/${equipmentType}/${equipment.OV}.png`):require(`images/equipments/${equipmentType}/without.png`);
    } catch (ex) {
      equipmentImage = require(`images/equipments/${equipmentType}/no_image.png`);
    }
  
    return (
      <div className="equipment-selector">
          <div className="equipment-name">
            <span>{equipmentTitleLabel}</span>
            <span className="additional-info">{additionalInfo}</span>
          </div>
          <div className="equipment-title">
            { equipmentCategories && equipments && (
              <select className="equipment-select" value={equipmentId} onChange={this.handleValueUpdate}>
                <option value="" disabled>Choisissez {equipmentLabel}</option>
                <option value="-">Sans</option>
                { filteredCategories.map((category) => this.getEquipmentsOptionElement(category.Code))}
              </select>
            )}
            <div className="main-stat-value">
                {equipment && <img src={mainStatImage} className="main-stat-image" alt={bonusCode} title={bonusTitle}/>}
                <span className="main-stat-label">{mainValue}</span>
                {bonusContent}
            </div>
          </div>
          <div className="equipment-illustration">
            <img src={equipmentImage} className="equipment-image" alt="" />
          </div>
          <div className="equipment-description">
            <div className="equipment-description-line"><span className="description-line-title">{equipment?"Poids:":'\u00A0'}</span>{equipment && <Weight weight={equipment.Weight} />}</div>
            <div className="equipment-description-line"><span className="description-line-title">{equipment?"Dégâts:":'\u00A0'}</span><span>{equipment && equipment.Damage+" "+equipment.DamageType}</span></div>
            <div className="equipment-description-line"><span className="description-line-title">{equipment?"Propriété:":'\u00A0'}</span><span>{equipment && equipment.Properties}</span></div>
            <div className="equipment-description-line"><span className="description-line-title">{equipment?"Prix:":'\u00A0'}</span>{equipment && <Money amount={equipment.Price} />}</div>
          </div>
      </div>
    )
  }

  // Arrow fx for binding
  handleValueUpdate = (event) => {
    const selectedEquipment = event.target.value;
    this.props.onChange(selectedEquipment);
  }

  getEquipmentsOptionElement(equipmentCategoryId) {
    const { equipmentCategories, equipments} = this.props;
    const availableEquipments = Object.values(equipments).filter((equipment) => equipment.Category === equipmentCategoryId);
    return availableEquipments && availableEquipments.length > 0 && 
           <optgroup key={equipmentCategoryId} label={equipmentCategories && equipmentCategories[equipmentCategoryId].Name}>
            { availableEquipments.map((equipment) => (
              <option key={equipment.Name} value={equipment.Id}>{equipment.Name}</option>
            ))}
          </optgroup>
  }
}

WeaponSelector.propTypes = {
  equipmentId: PropTypes.string,
  distance: PropTypes.bool,
  wearingCharacter: CharacterPropType,
  onChange: PropTypes.func.isRequired,
}

WeaponSelector.defaultProps = {
  distance: false
}

const mapStateToProps = (state) => ({
  equipmentCategories: state.referential.weaponCategories,
  equipments: state.referential.weapons,
  levels: state.referential.levels
})
export default connect(mapStateToProps)(WeaponSelector)