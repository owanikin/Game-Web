const CONTRACT_ADDRESS = "0xD2ef32DDA832F0225C698AFB76C0Dd4e3aDF03A4";

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