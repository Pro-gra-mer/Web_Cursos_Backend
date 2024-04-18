function getFilePath(file) {
  const filePath = file.path;

  // Dividir la cadena usando una expresión regular que coincida con las barras invertidas y la barra inclinada hacia adelante
  const fileSplit = filePath.split(/[\\/]/);

  // Eliminar las barras invertidas de cada parte del arreglo
  const formattedFileSplit = fileSplit.map((part) => part.replace(/\\/g, ""));

  return `${formattedFileSplit[1]}/${formattedFileSplit[2]}`;
}

module.exports = {
  getFilePath,
};
