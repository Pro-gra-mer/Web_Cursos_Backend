const Newsletter = require("../models/newsletter");

async function suscribeEmail(req, res) {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).send({ msg: "Email obligatorio" });

    const newsletter = new Newsletter({
      email: email.toLowerCase(),
    });

    await newsletter.save();
    return res.status(200).send({ msg: "Email registrado" });
  } catch (error) {
    return res.status(400).send({ msg: "El email ya está registrado" });
  }
}

async function getEmails(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const options = {
      page,
      limit,
    };
    const result = await Newsletter.paginate({}, options);

    const { docs, totalDocs: total, totalPages: pages } = result;

    const response = {
      docs,
      total,
      limit,
      page,
      pages,
    };

    return res.status(200).send(response);
  } catch (error) {
    return res.status(400).send({ msg: "Error al obtener los emails" });
  }
}

async function deleteEmail(req, res) {
  try {
    const { id } = req.params;

    await Newsletter.findByIdAndDelete(id);

    return res.status(200).send({ msg: "Email eliminado" });
  } catch (error) {
    return res.status(400).send({ msg: "Error al eliminar registro" });
  }
}

module.exports = {
  suscribeEmail,
  getEmails,
  deleteEmail,
};
