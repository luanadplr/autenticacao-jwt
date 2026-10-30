import jwt from "jsonwebtoken";
import "dotenv/config";

export const auth = (req, res, next) => {
  // >> Armazena o valor do token enviado no header da requisição
  const authHeader = req.headers["authorization"];

  // >> Verificar se o token foi enviado e se inicia com Bearer
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "🔴 Token is missing...",
    });
  }

  // >> Armazenar o valor do token sem o Bearer inicial
  const token = authHeader.split(" ")[1];

  try {
    // >> Verifica se o token é válido e armazena os dados do usuário enviados no jwt.sign ({id, user})
    const payload = jwt.verify(token, process.env.SECRET_KEY_JWT);
    // >> Envia os dados do usuário na requisição, isso serve para que o sistema saiba qual usuário está logado.
    req.user = payload;
    // >> Autoriza passar para a próxima etapa, nessa caso, o controller da rota.
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      message: "🔴 Expired ou Invalid Token",
    });
  }
};
