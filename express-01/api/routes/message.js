import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const messages = await req.context.models.Message.findAll();
    return res.status(200).send(messages);
  } catch (error) {
    return res.status(500).send({ error: "Erro interno do servidor." });
  }
});

router.get("/:messageId", async (req, res) => {
  try {
    const message = await req.context.models.Message.findByPk(
      req.params.messageId,
    );
    
    if (!message) {
      return res.status(404).send({ error: "Mensagem não encontrada." });
    }
    
    return res.status(200).send(message);
  } catch (error) {
    return res.status(500).send({ error: "Erro interno do servidor." });
  }
});

router.post("/", async (req, res) => {
  try {
    const message = await req.context.models.Message.create({
      text: req.body.text,
      userId: req.context.me.id,
    });
    return res.status(201).send(message);
  } catch (error) {
   
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).send({ error: "Dados inválidos." });
    }
    
    return res.status(500).send({ error: "Erro interno do servidor." });
  }
});

router.put("/:messageId", async (req, res) => {
  try {
    const [updatedRows] = await req.context.models.Message.update(
      {
        text: req.body.text,
      },
      {
        where: { id: req.params.messageId },
      }
    );
    
    if (updatedRows === 0) {
      return res.status(404).send({ error: "Mensagem não encontrada para atualização." });
    }
    
    return res.status(200).send({ success: "Mensagem atualizada com sucesso." });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).send({ error: "Dados inválidos para atualização." });
    }
    return res.status(500).send({ error: "Erro interno do servidor." });
  }
});

router.delete("/:messageId", async (req, res) => {
  try {
    const result = await req.context.models.Message.destroy({
      where: { id: req.params.messageId },
    });
    
    if (result === 0) {
      return res.status(404).send({ error: "Mensagem não encontrada para exclusão." });
    }
    
    return res.status(200).send({ success: "Mensagem eliminada com sucesso." });
  } catch (error) {
    return res.status(500).send({ error: "Erro interno do servidor." });
  }
});

export default router;