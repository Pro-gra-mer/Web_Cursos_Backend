const Post = require("../models/post");
const image = require("../utils/image");

async function createPost(req, res) {
  try {
    const post = new Post(req.body);
    post.created_at = new Date();
    const imagePath = image.getFilePath(req.files.miniature);
    post.miniature = imagePath;

    const postStored = await post.save();
    return res.status(201).send(postStored);
  } catch (error) {
    return res.status(400).send({ msg: "Error al crear el post" });
  }
}

async function getPosts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const options = {
      page,
      limit,
    };
    const result = await Post.paginate({}, options);

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
    return res.status(400).send({ msg: "Error al obtener los posts" });
  }
}

async function updatePost(req, res) {
  try {
    const { id } = req.params;
    const postData = req.body;

    if (req.files.miniature) {
      const imagePath = image.getFilePath(req.files.miniature);
      postData.miniature = imagePath;
    }

    await Post.findByIdAndUpdate({ _id: id }, postData);
    return res.status(200).send({ msg: "Actualización correcta" });
  } catch (error) {
    return res.status(400).send({ msg: "Error al actualizar el post" });
  }
}

async function deletePost(req, res) {
  try {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    return res.status(200).send({ msg: "Post eliminado" });
  } catch (error) {
    return res.status(400).send({ msg: "Error al eliminar el post" });
  }
}

async function getPost(req, res) {
  try {
    const { path } = req.params;

    const postStored = await Post.findOne({ path });
    if (!postStored) {
      return res.status(404).send({ msg: "No se ha encontrado ningún post" });
    }
    return res.status(200).send(postStored);
  } catch (error) {
    return res.status(500).send({ msg: "Error del servidor" });
  }
}

module.exports = {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  getPost,
};
