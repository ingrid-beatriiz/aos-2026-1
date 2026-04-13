import { MessageService } from '../services/index.js';

const getAll = async (req, res) => {
  const messages = await MessageService.findAll(req.context.models);
  return res.status(200).send(messages);
};

const getById = async (req, res) => {
  const message = await MessageService.findById(req.context.models, req.params.messageId);
  if (!message) return res.status(404).send({ error: "Mensagem não encontrada." });
  return res.status(200).send(message);
};

const create = async (req, res) => {
  const message = await MessageService.create(req.context.models, {
    text: req.body.text,
    userId: req.context.me.id,
  });
  return res.status(201).send(message);
};

const update = async (req, res) => {
  const [updatedRows] = await MessageService.update(req.context.models, req.params.messageId, {
    text: req.body.text,
  });
  if (updatedRows === 0) return res.status(404).send({ error: "Mensagem não encontrada para atualização." });
  return res.status(200).send({ success: "Mensagem atualizada com sucesso." });
};

const remove = async (req, res) => {
  const result = await MessageService.remove(req.context.models, req.params.messageId);
  if (result === 0) return res.status(404).send({ error: "Mensagem não encontrada para exclusão." });
  return res.status(200).send({ success: "Mensagem eliminada com sucesso." });
};

export default { getAll, getById, create, update, remove };