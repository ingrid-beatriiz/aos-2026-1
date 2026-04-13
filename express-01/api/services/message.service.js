const findAll = async (models) => {
  return await models.Message.findAll();
};

const findById = async (models, id) => {
  return await models.Message.findByPk(id);
};

const create = async (models, data) => {
  return await models.Message.create(data);
};

const update = async (models, id, data) => {
  return await models.Message.update(data, { where: { id } });
};

const remove = async (models, id) => {
  return await models.Message.destroy({ where: { id } });
};

export default { findAll, findById, create, update, remove };