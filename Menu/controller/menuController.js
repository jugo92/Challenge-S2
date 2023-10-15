const Menu = require("../dbMenu");
const {verifyRequestAttributes} = require("../../core");

module.exports.getMenuItems = async (req, res) => {
    try {
        const menuItemsList = await Menu.findAll();
        res.status(200).json(menuItemsList);
    } catch (err) {
        console.error('Erreur lors de la récupération des menuItems :', err);
        res.status(500).json({ message: 'Erreur lors de la récupération des menuItems' });
    }
}

module.exports.getMenuItemById = async (req, res) => {
    try {
        const menuItem = await Menu.findByPk(req.params.id);
        if(menuItem === null) {
            res.status(404).json({ message: 'Menu non trouvée' });
            return;
        }
        res.status(200).json(menuItem);
    } catch (err) {
        console.error('Erreur lors de la récupération du menuItem :', err);
        res.status(500).json({ message: 'Erreur lors de la récupération du menuItem' });
    }
}

module.exports.deleteMenuItemById = async (req, res) => {
    try {
        const menuItem = await Menu.findByPk(req.params.id);
        if(menuItem === null) {
            res.status(404).json({ message: 'MenuItem non trouvée' });
            return;
        }
        await menuItem.destroy();
        res.status(204).json(menuItem);
    } catch (err) {
        console.error('Erreur lors de la suppression du menuItem :', err);
        res.status(500).json({ message: 'Erreur lors de la suppression du menuItem' });
    }
}

module.exports.putMenuItemById = async (req, res) => {
    try {
        const menuItem = await Menu.findByPk(req.params.id);
        const {name, link, icon, parentId, active} = req.body;
        menuItem.name = name || menuItem.name;
        menuItem.link = link || menuItem.link;
        menuItem.icon = icon || menuItem.icon;
        menuItem.parentId = parentId || menuItem.parentId;
        menuItem.active = active || menuItem.active;
        await menuItem.save();
        res.status(200).json(menuItem);
    }
    catch (err) {
        console.error('Erreur lors de la modification du menuItem :', err);
        res.status(500).json({ message: 'Erreur lors de la modification du menuItem' });
    }
}

module.exports.postMenuItem = async (req, res) => {
    try {
        const menuItem = await Menu.create(req.body);
        res.status(201).json(menuItem);
    } catch (err) {
        console.error('Erreur lors de la création de la menuItem :', err);
        res.status(500).json({ message: 'Erreur lors de la création de la menuItem' });
    }
}
