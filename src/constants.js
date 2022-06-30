const CONTRACT_ADDRESS = "0x6EEde6Be27629ab3AA79a31e9344240D8E44C445";

const transformCharacterData = (CharacterData) => {
    return {
        name: CharacterData.name,
        imageURI: CharacterData.imageURI,
        hp: CharacterData.hp.toNumber(),
        maxHp: CharacterData.maxHp.toNumber(),
        attackDamage: CharacterData.attackDamage.toNumber(),
    };
};

export { CONTRACT_ADDRESS, transformCharacterData };