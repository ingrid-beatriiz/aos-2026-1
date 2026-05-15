import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const generateAccessToken = (user) => {
  const secret = process.env.JWT_SECRET || 'chave-secreta-padrao';

  return jwt.sign({ id: user.id, login: user.username }, secret, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION || '15m'
  });
};

const generateRefreshToken = async (models, user) => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7);

  const token = crypto.randomBytes(40).toString('hex');

  const refreshToken = await models.RefreshToken.create({
    token: token,
    expiryDate: expiryDate,
    userId: user.id
  });

  return refreshToken.token;
};

const getSession = async (req, res) => {
  return res.status(200).send(req.context.me);
};

const createSession = async (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).send({ error: 'É necessário fornecer login e palavra-passe.' });
  }

  try {
    const user = await req.context.models.User.findByLogin(login);

    if (!user) {
      return res.status(401).send({ error: 'Credenciais inválidas.' });
    }

    const isValidPassword = await user.validatePassword(password);

    if (!isValidPassword) {
      return res.status(401).send({ error: 'Credenciais inválidas.' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(req.context.models, user);

    return res.status(200).send({
      accessToken,
      refreshToken
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: 'Erro interno do servidor.' });
  }
};

const logout = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).send({ error: 'O refresh token é obrigatório.' });
  }

  try {

    await req.context.models.RefreshToken.destroy({ where: { token: refreshToken } });
    return res.status(200).send({ message: 'Logout efetuado com sucesso.' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: 'Erro interno do servidor.' });
  }
};

const refresh = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).send({ error: 'O refresh token é obrigatório.' });
  }

  try {

    const tokenInDb = await req.context.models.RefreshToken.findOne({
      where: { token: refreshToken },
      include: [req.context.models.User] 
    });

    if (!tokenInDb) {
      return res.status(401).send({ error: 'Refresh token inválido ou não encontrado.' });
    }

    if (req.context.models.RefreshToken.verifyExpiration(tokenInDb)) {
      await req.context.models.RefreshToken.destroy({ where: { id: tokenInDb.id } });
      return res.status(401).send({ error: 'Refresh token expirado. Faça o login novamente.' });
    }

    const newAccessToken = generateAccessToken(tokenInDb.user);

    const newTokenString = crypto.randomBytes(40).toString('hex');
    const newRefreshToken = await req.context.models.RefreshToken.create({
      token: newTokenString,
      expiryDate: tokenInDb.expiryDate,
      userId: tokenInDb.userId
    });

    await req.context.models.RefreshToken.destroy({ where: { id: tokenInDb.id } });

    return res.status(200).send({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken.token
    });

  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: 'Erro interno ao tentar renovar a sessão.' });
  }
};

export default { getSession, createSession, logout, refresh };