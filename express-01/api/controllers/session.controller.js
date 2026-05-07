import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const generateAccessToken = (user) => {
  // Idealmente, o segredo deve vir do ficheiro .env (ex: process.env.JWT_SECRET)
  const secret = process.env.JWT_SECRET || 'chave-secreta-padrao';
  
  return jwt.sign({ id: user.id, login: user.username }, secret, {
    expiresIn: '15m'
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

export default { getSession, createSession };