const mongoose = require("mongoose");
// Cuando se conece la base de datos debemos levantar el servidor
const app = require("./app");

const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  IP_SERVER,
  API_SERVER,
  API_VERSION,
} = require("./constants");

const PORT = process.env.POST || 3977;

mongoose
  .connect(
    `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log("####################");
      console.log("##### API REST #####");
      console.log("####################");
      console.log(`http://${IP_SERVER}:${PORT}/api/${API_VERSION}`);
    });
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos:", error);
  });
