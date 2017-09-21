const isMod = (member) => {
    member.roles.find('name', 'Mods')

    if (member.roles.find('name', 'Mods')) {
        return true
    }

    return false
}

module.exports.isMod = isMod