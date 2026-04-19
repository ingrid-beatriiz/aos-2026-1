import { userService } from "../services";

const getSession = async (req, res) => {
  const user = await userService.getUserById(req.context.me.id);

  if (!user) {
    return res.status(404).send();
  }

  return res.status(200).send(user);
};

export default {
  getSession,
};
