import { UserService } from '../services/index.js';

const getAll = async (req, res) => {
  const users = await UserService.findAll(req.context.models);
  return res.status(200).send(users);
};

const getById = async (req, res) => {
  const user = await UserService.findById(req.context.models, req.params.userId);
  if (!user) return res.status(404).send({ error: "Utilizador não encontrado." });
  return res.status(200).send(user);
};

const create = async (req, res) => {
  const user = await UserService.create(req.context.models, {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password, 
  });
  return res.status(201).send(user);
};

const update = async (req, res) => {
  const [updatedRows] = await UserService.update(req.context.models, req.params.userId, {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  if (updatedRows === 0) return res.status(404).send({ error: "Utilizador não encontrado para atualização." });
  return res.status(200).send({ success: "Utilizador atualizado com sucesso." });
};

const remove = async (req, res) => {
  const result = await UserService.remove(req.context.models, req.params.userId);
  if (result === 0) return res.status(404).send({ error: "Utilizador não encontrado para exclusão." });
  return res.status(200).send({ success: "Utilizador eliminado com sucesso." });
};

export default { getAll, getById, create, update, remove };