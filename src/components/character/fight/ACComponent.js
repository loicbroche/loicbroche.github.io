
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {  selectClassById, selectLevelNumberByXP, selectArmorACBonus, selectClassACBonus,
          selectValidSpecialisation, selectFightStylesByIds, selectArmorById, selectACBonusCaracteristicByClassId } from 'store/selectors';
import { CharacterPropType } from 'PropTypes'
import './ACComponent.css'
import { CA_BASE, CA_CARACTERISTIC_NAME  } from 'rules/AC.rules'

const ACImage = require("images/AC.png");

class ACComponent extends PureComponent {

  render() {
    const { armorACBonusDexterity, classACBonus, armor, shield, class: characterClass, specialisation, selectedFightStyles,
            levelNumber, ACBonusCaracteristic, character} = this.props;

    const armorBonus = armor?.AC || 0;
    const shieldBonus = shield?.AC || 0;

    const isValidArmorCondition = characterClass && ((!characterClass.ACBonusArmor && characterClass.ACBonusArmor !== false) || (characterClass.ACBonusArmor && armor) || (characterClass.ACBonusArmor === false && !armor)) 
    const isValidShieldCondition = characterClass && ((!characterClass.ACBonusShield && characterClass.ACBonusShield !== false) || (characterClass.ACBonusShield && shield) || (characterClass.ACBonusShield === false && !shield)) 
    const classBonusValue = (ACBonusCaracteristic && isValidArmorCondition && isValidShieldCondition && classACBonus) || 0;

    const isValidArmorSpecialCondition = specialisation && ((!specialisation.ACBonusArmor && specialisation.ACBonusArmor !== false) || (specialisation.ACBonusArmor && armor) || (specialisation.ACBonusArmor === false && !armor)) 
    const specialisationBonus = (specialisation && isValidArmorSpecialCondition &&  specialisation.ACBonus) ||0;

    const fightStyleLevel = characterClass?.FightStyleLevel;

    let fightStyleTitle = "";
    const fightStyleBonus = (character
                              && fightStyleLevel <= levelNumber
                              && selectedFightStyles?.length > 0
                              && selectedFightStyles?.reduce((sum, fightStyle) => {
                                      const isValidArmorFightStyleCondition = fightStyle && ((!fightStyle.ACBonusArmor && fightStyle.ACBonusArmor !== false) || (fightStyle.ACBonusArmor && armor) || (fightStyle.ACBonusArmor === false && !armor)) 
                                      const bonus = (fightStyle.Class === character.Class && isValidArmorFightStyleCondition && (sum+fightStyle.ACBonus)) || sum;
                                      fightStyleTitle += (!fightStyle.ACBonus?"":`${fightStyleTitle?"\n":""}Bonus de Style de combat ${fightStyle.Name} +${fightStyle.ACBonus}`
                                                          +`${(fightStyle.ACBonusArmor)?"\nSi porte une armure":((fightStyle.ACBonusArmor === false)?"\nSi ne porte pas d'armure":"")}`)                                        
                                      return bonus;
                                  }, 0)
                            ) || 0;

    const specialBonusValue = classBonusValue + specialisationBonus + fightStyleBonus;
    const ac = CA_BASE + armorBonus + shieldBonus + specialBonusValue;
    const specialBonusTitle = (!classBonusValue?"":`Bonus de classe ${characterClass?.Name} : Modificateur de ${ACBonusCaracteristic?.Name}`
                                  +`${(characterClass.ACBonusArmor)?"\nSi porte une armure":((characterClass.ACBonusArmor === false)?"\nSi ne porte pas d'armure":"")}`
                                  +`${(characterClass.ACBonusShield)?"\nSi porte un bouclier":((characterClass.ACBonusShield === false)?"\nSi ne porte pas de bouclier":"")}`)
                              + ((!specialisation || !specialisationBonus)?"":`${classBonusValue?"\n":""}Bonus de spécialisation ${specialisation.Name} +${specialisation.ACBonus}`
                                  +`${(specialisation.ACBonusArmor)?"\nSi porte une armure":((specialisation.ACBonusArmor === false)?"\nSi ne porte pas d'armure":"")}`)
                              + (classBonusValue ||(specialisation && specialisationBonus)?"\n":"")+fightStyleTitle;

    return (
      <div className="acComponent" title="Classe d'armure">
        <img src={ACImage} className="ac-background-image" alt="" />
        <div className="ac-values">
          <div className="ac-calculation">
              <div className="ac-equipment-values">
                <span className={`ac-armor-value ${!armorBonus?"ac-no-value":""}`} title="CA d'armure">{armorBonus}</span>
                <span className="ac-base-value" title="CA de Base">{CA_BASE}</span>
                <span className={`ac-shield-value ${!shieldBonus?"ac-no-value":""}`} title="CA de bouclier">{shieldBonus}</span>
              </div>
          </div>
          <span className="ac-total-value">{ac}</span>
          <div>
            <span className={`ac-bonus-value ${!specialBonusValue?"ac-no-value":""}`} title={specialBonusTitle}>{specialBonusValue}</span>
          </div>
        </div>
        <span className={`ac-dexterity-value ${!armorACBonusDexterity?"ac-no-value":""}`} title="Bonus dextérité">{(armorACBonusDexterity>=0?"+":"")+armorACBonusDexterity}</span>
      </div>
    )
  }
}

ACComponent.propTypes = {
  character: CharacterPropType
}

const mapStateToProps = (state, props) => ({
  class: selectClassById(state, props.character?.Class),
  specialisation: selectValidSpecialisation(state,
                                            props.character?.Specialisation,
                                            props.character?.Class,
                                            props.character?.XP),
  selectedFightStyles: selectFightStylesByIds(state, props.character?.FightStyles),
  armor: selectArmorById(state, props.character?.Armor),
  shield: selectArmorById(state, props.character?.Shield),
  ACBonusCaracteristic: selectACBonusCaracteristicByClassId(state, props.character?.Class),
  levelNumber: selectLevelNumberByXP(state, props.character?.XP),
  armorACBonusDexterity: selectArmorACBonus(state, props.character?.Armor, props.character?.SubRace,
                                   props.character?.Class,
                                   props.character?.[CA_CARACTERISTIC_NAME],
                                   props.character?.MasterArmors),
  classACBonus: selectClassACBonus(state, props.character)
})
export default connect(mapStateToProps)(ACComponent)
