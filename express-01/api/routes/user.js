import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  const users = await req.context.models.User.findAll();
  return res.status(200).send(users);
});

router.get("/:userId", async (req, res) => {
  const user = await req.context.models.User.findByPk(req.params.userId);
  if (!user) return res.status(404).send({ error: "Usuário não encontrado." });
  
  return res.status(200).send(user);
});

router.post("/", async (req, res) => {
  // Se der erro aqui, o Express 5 joga direto pro Middleware de erro!
  const user = await req.context.models.User.create({
    username: req.body.username,
    email: req.body.email,
  });
  return res.status(201).send(user);
});

router.put("/:userId", async (req, res) => {
  const [updatedRows] = await req.context.models.User.update(
    {
      username: req.body.username,
      email: req.body.email,
    },
    {
      where: { id: req.params.userId },
    }
  );
  
  if (updatedRows === 0) return res.status(404).send({ error: "Usuário não encontrado para atualização." });
  
  return res.status(200).send({ success: "Usuário atualizado com sucesso." });
});

router.delete("/:userId", async (req, res) => {
  const result = await req.context.models.User.destroy({
    where: { id: req.params.userId },
  });
  
  if (result === 0) return res.status(404).send({ error: "Usuário não encontrado para exclusão." });
  
  return res.status(200).send({ success: "Usuário deletado com sucesso." });
});

export default router;