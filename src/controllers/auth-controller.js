import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { poolDB } from "../data/db.js";

/*

função para cadastrar o usuário no banco

*/

export const userRegister = async (req, res) => {
  try {
    const { user, password } = req.body;

    // >> Verificar se os dados foram realmente enviados
    if (!user || !password) {
      return res.status(400).json({
        message: "🔴 Fields are required",
      });
    }

    // >> Verificar se o usuário já existe no banco
    const [userHasRegister] = await poolDB.query(
      "SELECT id FROM usuarios WHERE user=? LIMIT 1",
      [user],
    );
    if (userHasRegister.length > 0) {
      return res.status(409).json({
        message: "🔴 User already registered",
      });
    }
    // >> Criptografar senha
    const hashPassword = await bcrypt.hash(password, 10);

    // >> Enviar os dados para o banco
    const [result] = await poolDB.query(
      "INSERT INTO usuarios (user, password) VALUES (?,?)",
      [user, hashPassword],
    );

    // >> Retornar ao usuário
    return res.status(200).json({
      message: "🟢 Registered user",
      user: { id: result.insertId, user },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "🔴 Error registering the user",
    });
  }
};

/*

função de fazer login com os dados recebidos

*/

export const userLogin = async (req, res) => {
  try {
    const { user, password } = req.body;

    // >> Verificar se o usuário enviou os dados
    if (!user || !password) {
      return res.status(400).json({
        message: "🔴 Fields are required",
      });
    }

    // >> Recuperar os dados do usuário no banco
    const [users] = await poolDB.query(
      "SELECT * FROM usuarios WHERE user=? LIMIT 1",
      [user],
    );

    // >> Verificar se o usuário existe no banco
    if (users.length == 0) {
      return res.status(401).json({
        message: "🔴 User or Password are wrong",
      });
    }

    // >> Armazenar o usuário encontrado
    const userData = users[0];

    // >> Verificar se senha foi digitada corretamente
    const verifyPassword = await bcrypt.compare(password, userData.PASSWORD);
    if (!verifyPassword) {
      return res.status(401).json({
        message: "🔴 User or Password are wrong",
      });
    }

    // >> Gerar o token do usuário
    const token = jwt.sign(
      { id: userData.id, user: userData.USER },
      process.env.SECRET_KEY_JWT,
      { expiresIn: "30s" },
    );

    // >> Retornar ao usuário que o login foi realizado
    return res.status(200).json({
      message: "🟢 Logged",
      user: { id: userData.id, user: userData.USER },
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "🔴 Error logging in",
    });
  }
};

/*

Rota para teste ; Acessar a lista de usuários cadastrados caso o login for bem sucedido.


*/

export const userList = async (req, res) => {
  try {
    const [users] = await poolDB.query(
      "SELECT id, USER, created_at FROM usuarios ORDER BY id",
    );

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "🔴 List error",
    });
  }
};
