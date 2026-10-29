import bcrypt from "bcryptjs";
import { poolDB } from "../data/db.js";

/*

função para cadastrar o usuário no banco

*/

export const userRegister = async (req, res) => {
  try {
    const { user, password } = req.body;

    // >> Verificar se os dados foram realmente enviados
    if (!user || !password)
      return res.status(400).json({
        message: "🔴 Fields are required",
      });

    // >> Verificar se o usuário já existe no banco
    const userHasRegister = await poolDB.query(
      "SELECT id FROM usuarios WHERE user=? LIMIT=1",
      [user],
    );
    if (userHasRegister)
      return res.status(409).json({
        message: "🔴 User already registered",
      });

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
