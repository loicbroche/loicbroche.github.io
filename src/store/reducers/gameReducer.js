import { ActionTypes } from '../actions/ActionTypes';

const initialState = {
    characters: null
}

function gameReducer(state = initialState, action) {
    let nextState;
    switch (action.type) {
        case ActionTypes.CHARACTERS.LOAD:
            nextState = {
                ...state,
                characters: action.value
            }
            return nextState;
        case ActionTypes.CHARACTERS.LOAD_ONE:
                const { character } = action.value
                nextState = {
                    ...state,
                    characters: state.characters && state.characters.map((char) => char.Id === character.Id ? character : char)
                }
                return nextState;
        case ActionTypes.CHARACTERS.TOGGLE_SKILL:
            const { characters } = state;
            const { characterId, skillId } = action.value;
            if (characters && 0 <= characterId && characterId < characters.length) {
                const character = characters[characterId];
                if (character.Skills && 0 <= skillId && skillId < character.Skills.length) {
                    const index = character.Skills.findIndex((id) => id === skillId);
                    if (index === -1) {
                        character.Skills.push(skillId);
                    } else {
                        character.Skills.splice(index, 1);
                    }
                    nextState = {
                        ...state,
                        characters: characters
                    }
                }
            }
            return nextState
        default:
            return state;
    }
}

export default gameReducer;