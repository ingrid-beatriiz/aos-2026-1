const findAll = async (models) => {
  return await models.User.findAll();
};

const findById = async (models, id) => {
  return await models.User.findByPk(id);
};

const create = async (models, data) => {
  return await models.User.create(data);
};

const update = async (models, id, data) => {
  return await models.User.update(data, { where: { id } });
};

const remove = async (models, id) => {
  return await models.User.destroy({ where: { id } });
};

export default { findAll, findById, create, update, remove };