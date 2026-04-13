const getSession = async (req, res) => {
  return res.status(200).send(req.context.me);
};

export default { getSession };