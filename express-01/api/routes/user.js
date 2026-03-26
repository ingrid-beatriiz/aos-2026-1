import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const users = await req.context.models.User.findAll();
    return res.status(200).send(users);
  } catch (error) {
    return res.status(500).send({ error: "Erro interno do servidor." });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const user = await req.context.models.User.findByPk(req.params.userId);
    
    if (!user) {
      return res.status(404).send({ error: "Usuário não encontrado." });
    }
    
    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send({ error: "Erro interno do servidor." });
  }
});

router.post("/", async (req, res) => {
  try {
    const user = await req.context.models.User.create({
      username: req.body.username,
      email: req.body.email,
    });
    return res.status(201).send(user);
  } catch (error) {
  
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).send({ error: "Este e-mail ou usuário já está cadastrado." });
    }
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).send({ error: "Dados inválidos." });
    }
    
    return res.status(500).send({ error: "Erro interno do servidor." });
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
    
    if (updatedRows === 0) {
      return res.status(404).send({ error: "Usuário não encontrado para atualização." });
    }
    
    return res.status(200).send({ success: "Usuário atualizado com sucesso." });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).send({ error: "Este e-mail ou usuário já está em uso por outra conta." });
    }
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).send({ error: "Dados inválidos para atualização." });
    }
    return res.status(500).send({ error: "Erro interno do servidor." });
  }
});

router.delete("/:userId", async (req, res) => {
  try {
    const result = await req.context.models.User.destroy({
      where: { id: req.params.userId },
    });
    
    if (result === 0) {
      return res.status(404).send({ error: "Usuário não encontrado para exclusão." });
    }
    
    return res.status(200).send({ success: "Usuário deletado com sucesso." });
  } catch (error) {
    return res.status(500).send({ error: "Erro interno do servidor." });
  }
});

export default router;