import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  const users = await req.context.models.User.findAll();
  return res.send(users);
});

router.get("/:userId", async (req, res) => {
  const user = await req.context.models.User.findByPk(req.params.userId);
  return res.send(user);
});

router.post("/", async (req, res) => {
  try {
    const user = await req.context.models.User.create({
      username: req.body.username,
      email: req.body.email,
    });
    return res.send(user);
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

router.put("/:userId", async (req, res) => {
  try {
    const [updatedRows] = await req.context.models.User.update(
      {
        username: req.body.username,
        email: req.body.email,
      },
      {
        where: { id: req.params.userId },
      }
    );
    return res.send(updatedRows > 0); 
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

router.delete("/:userId", async (req, res) => {
  try {
    const result = await req.context.models.User.destroy({
      where: { id: req.params.userId },
    });
    return res.send(result > 0);
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

export default router;