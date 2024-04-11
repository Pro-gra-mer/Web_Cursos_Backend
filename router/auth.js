const express = require("express");
const authController = require("../controllers/auth");

const api = express.Router();

api.post("/auth/register", authController.register);

module.exports = api;
