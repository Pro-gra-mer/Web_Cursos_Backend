const Course = require("../models/course");
const image = require("../utils/image");
async function createCourse(req, res) {
  try {
    const course = new Course(req.body);
    const imagePath = image.getFilePath(req.files.miniature);
    course.miniature = imagePath;
    const courseStored = await course.save();
    return res.status(201).send(courseStored);
  } catch (error) {
    return res.status(400).send({ msg: "Error al crear el curso" });
  }
}

async function getCourse(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const options = {
      page,
      limit,
    };
    const result = await Course.paginate({}, options);

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
    console.error("Error al obtener los cursos:", error);
    return res.status(500).send({ msg: "Error interno del servidor" });
  }
}

async function updateCourse(req, res) {
  try {
    const { id } = req.params;
    const courseData = req.body;

    if (req.files.miniature) {
      const imagePath = image.getFilePath(req.files.miniature);
      courseData.miniature = imagePath;
    }

    await Course.findByIdAndUpdate({ _id: id }, courseData);

    return res.status(200).send({ msg: "Actualización correcta" });
  } catch (error) {
    return res.status(400).send({ msg: "Error al actualizar el curso" });
  }
}

async function deleteCourse(req, res) {
  try {
    const { id } = req.params;

    await Course.findByIdAndDelete({ _id: id });

    return res.status(200).send({ msg: "Curso eliminado" });
  } catch (error) {
    return res.status(400).send({ msg: "Error al eliminar el curso" });
  }
}

module.exports = {
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
};
