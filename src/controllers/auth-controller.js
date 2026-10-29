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

função de fazer login com os dados recebidos no banco
- para fazer o login precisa receber o user e a senha
-- acredito que precisa verificar o hash de senha?
- verificar se o user e a senha existe no bd
- se não retornar ao usuário o erro ao fazer login
- se existir retornar ao usuário o login feito com sucesso

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
    const [userData] = poolDB.query(
      "SELECT * FROM usuarios WHERE user=? LIMIT 1",
      [user],
    );

    // >> Verificar se o usuário existe no banco
    if (userData.length == 0) {
      return res.status(401).json({
        message: "🔴 User or Password are wrong",
      });
    }

    // >> Verificar se senha foi digitada corretamente
    const verifyPassword = bcrypt.compare(password, userData.password);
    if (!verifyPassword) {
      return res.status(401).json({
        message: "🔴 User or Password are wrong",
      });
    }

    // >> Gerar o token do usuário
    const token = jwt.sign(
      { id: userData.id, user: userData.user },
      process.env.SECRET_KEY_JWT,
      { expiresIn: "1h" },
    );

    // >> Retornar ao usuário que o login foi realizado
    return res.status(200).json({
      message: "🟢 Logged",
      user: { id: userData.id, user: userData.user },
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "🔴 Error logging in",
    });
  }
};
