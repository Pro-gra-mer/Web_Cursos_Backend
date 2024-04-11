const bcrypt = require("bcryptjs");
const User = require("../models/user");

function register(req, res) {
  const { firstname, lastname, email, password } = req.body;

  if (!email) res.status(400).send({ msg: "El email es obligatorio" });
  if (!password) res.status(400).send({ msg: "La contraseña es obligatoria" });

  const user = new User({
    firstname,
    lastname,
    email: email.toLowerCase(),
    role: "user",
    active: false,
    password,
  });

  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);
  user.password = hashPassword;
  user
    .save()
    .then((userStorage) => {
      res.status(200).send(userStorage);
    })
    .catch((error) => {
      res.status(400).send({ msg: "Error al crear el usuario" });
    });
}

module.exports = {
  register,
};
