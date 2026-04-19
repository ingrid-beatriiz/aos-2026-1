import models from "../models/index.js";

const getAllTarefas = async () => {
  return await models.Tarefa.findAll();
};

const getTarefaById = async (objectId) => {
  return await models.Tarefa.findByPk(objectId);
};

const createTarefa = async (tarefaData) => {
  return await models.Tarefa.create(tarefaData);
};

const updateTarefa = async (objectId, tarefaData) => {
  const response = await models.Tarefa.update(tarefaData, {
    where: { objectId },
    returning: true,
  });
  return response;
};

const deleteTarefa = async (objectId) => {
  return await models.Tarefa.destroy({
    where: { objectId },
  });
};

export default {
  getAllTarefas,
  getTarefaById,
  createTarefa,
  updateTarefa,
  deleteTarefa,
};