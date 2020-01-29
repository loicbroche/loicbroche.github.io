
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { CharacterPropType } from 'PropTypes'
import Money from 'components/shared/Money'
import Weight from 'components/shared/Weight'
import CaracteristicBonus from 'components/shared/CaracteristicBonus'
import { filterArmorsCategories, filterShieldsCategories } from 'rules/Armors.rules'

import './EquipmentSelector.css'

const mainStatImage = require("images/AC.png");
const notMasterImage = require("images/cross.png");

class ArmorSelector extends Component {

  render() {
/**/const { equipmentCategories, equipments, equipmentId, shield, wearingCharacter } = this.props;
    const equipment = equipments && equipments[equipmentId];
    
/**/const equipmentType = shield?"shield":"armor";
/**/const equipmentTitleLabel = shield?"Bouclier":"Armure";
/**/const equipmentLabel = shield?"un bouclier":"une armure";
/**/const filteredCategories = equipmentCategories && (shield?filterShieldsCategories(equipmentCategories):filterArmorsCategories(equipmentCategories));
    const isMaster = this.isMaster(equipment);
/**/const bonusContent = equipment && 
                         <div className={`main-stat-bonus-label ${ isMaster?(equipment && equipment.BonusAC):"not-master-equipment"}`}>
                            {isMaster
                              ?(equipment && equipment.BonusAC && <CaracteristicBonus caracteristicName={equipment.BonusAC}
                                                  value={wearingCharacter && wearingCharacter[equipment.BonusAC]}
                                                 bonusMax={Number.isNaN(equipment.MaxBonusAC)?null:equipment.MaxBonusAC}
                                                  subRaceId={wearingCharacter && wearingCharacter.SubRace} />)
                              :<img src={notMasterImage} className="not-master-image" alt="" title="Non maîtrisé"/>
                            }
                          </div>

/**/const bonusCode = "CA";
/**/const bonusTitle = "Classe d'armure";
/**/const mainValue = equipment && equipment.AC;

    let equipmentImage;
    try {
      equipmentImage = equipment?require(`images/equipments/${equipmentType}/${equipment.OV}.png`):require(`images/equipments/${equipmentType}/without.png`);
    } catch (ex) {
      equipmentImage = require(`images/equipments/${equipmentType}/no_image.png`);
    }

    return (
      <div className="equipment-selector">
          <h1 className="equipment-name">
            <span>{equipmentTitleLabel}</span>
          </h1>
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
            <div className="equipment-description-line"><span className="description-line-title">{equipment?"Poids:":'\u00A0'}</span>
                                                        {equipment && <Weight weight={equipment.Weight} />}</div>
            <div className="equipment-description-line"><span className="description-line-title">{equipment?"Discretion:":'\u00A0'}</span>
                                                        <span className="description-line-value">{equipment && equipment.Discretion}</span></div>
            <div className="equipment-description-line"><span className="description-line-title">{equipment?"Force:":'\u00A0'}</span>
                                                        <span className="description-line-value">{equipment && equipment.Strength}</span></div>
            <div className="equipment-description-line"><span className="description-line-title">{equipment?"Prix:":'\u00A0'}</span>
                                                        {equipment && <Money amount={equipment.Price} />}</div>
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
    const isMasterCategory = this.isMasterCategory(equipmentCategoryId);
    return availableEquipments && availableEquipments.length > 0 && 
           <optgroup key={equipmentCategoryId} label={equipmentCategories && equipmentCategories[equipmentCategoryId].Name} >
            { availableEquipments.map((equipment) => (
              <option key={equipment.Name} value={equipment.Id} className={isMasterCategory?"master-equipment":""}>{equipment.Name}</option>
            ))}
          </optgroup>
  }

  isMasterCategory(armorCategoryId) {
    const { classes, classId } = this.props;
    const characterClass = classes && classes[classId];
    const classArmorCategories = characterClass && (characterClass.ArmorCategories || []);

    return (classArmorCategories && classArmorCategories.includes(armorCategoryId));
  }

  isMaster(armor) {
    const { classes, classId, master } = this.props;
  
    const characterClass = classes && classes[classId];
    const classArmorCategories = characterClass && (characterClass.ArmorCategories || []);
  
    const isMaster = master && master.includes(armor && armor.Name);
    const isClassMaster = (classArmorCategories && classArmorCategories.includes(armor && armor.Category));

    return isMaster || isClassMaster;
  }
}

ArmorSelector.propTypes = {
  armorId: PropTypes.string,
  shield: PropTypes.bool,
  wearingCharacter: CharacterPropType,
  onChange: PropTypes.func.isRequired,
}

ArmorSelector.defaultProps = {
  shield: false
}

const mapStateToProps = (state) => ({
  equipmentCategories: state.referential.armorCategories,
  equipments: state.referential.armors,
  classes: state.referential.classes
})
export default connect(mapStateToProps)(ArmorSelector)