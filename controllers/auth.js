const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("../utils/jwt");
const { JWT_SECRET_KEY } = require("../constants");

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

async function login(req, res) {
  const { email, password } = req.body;
  if (!email) return res.status(400).send({ msg: "El email es obligatorio" });
  if (!password)
    return res.status(400).send({ msg: "La contraseña es obligatoria" });

  const emailLowerCase = email.toLowerCase();

  try {
    const userStorage = await User.findOne({ email: emailLowerCase }).exec();
    if (!userStorage) {
      return res.status(404).send({ msg: "Usuario no encontrado" });
    }

    const check = await bcrypt.compare(password, userStorage.password);
    if (!check) {
      return res.status(401).send({ msg: "Contraseña incorrecta" });
    }

    if (!userStorage.active) {
      return res.status(401).send({ msg: "Usuario no autorizado o no activo" });
    }

    res.status(200).send({
      access: jwt.createAccessToken(userStorage, JWT_SECRET_KEY),
      refresh: jwt.createRefreshToken(userStorage, JWT_SECRET_KEY),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error del servidor" });
  }
}

async function refreshAccessToken(req, res) {
  try {
    const { token } = req.body;
    const { user_id } = jwt.decoded(token);

    const userStorage = await User.findOne({ _id: user_id }).exec();
    if (!userStorage) {
      return res.status(404).send({ msg: "Usuario no encontrado" });
    }

    const accessToken = jwt.createAccessToken(userStorage);
    res.status(200).send({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error del servidor" });
  }
}

module.exports = {
  register,
  login,
  refreshAccessToken,
};
