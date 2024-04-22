const Menu = require("../models/menu");

async function createMenu(req, res) {
  try {
    const menu = new Menu(req.body);
    const menuStored = await menu.save();
    return res.status(201).send(menuStored);
  } catch (error) {
    return res.status(400).send({ msg: "Error al crear el menu" });
  }
}

async function getMenus(req, res) {
  const { active } = req.query;

  let response = null;
  if (active === undefined) {
    response = await Menu.find().sort({ order: "asc" });
  } else {
    response = await Menu.find({ active }).sort({ order: "asc" });
  }
  if (!response) {
    return res.status(400).send({ msg: "No se ha encontrado ningún menú" });
  } else {
    return res.status(200).send(response);
  }
}

async function updateMenu(req, res) {
  try {
    const { id } = req.params;
    const menuData = req.body;
    await Menu.findByIdAndUpdate(id, menuData);
    return res.status(200).send({ msg: "Actualización correcta" });
  } catch (error) {
    return res.status(400).send({ msg: "Error al actualizar el menú" });
  }
}

async function deleteMenu(req, res) {
  try {
    const { id } = req.params;
    await Menu.findByIdAndDelete(id);
    return res.status(200).send({ msg: "Menú eliminado" });
  } catch (error) {
    return res.status(400).send({ msg: "Error al eliminar el menú" });
  }
}

module.exports = {
  createMenu,
  getMenus,
  updateMenu,
  deleteMenu,
};
