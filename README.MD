# Autenticação JWT

Projeto Backend de autenticação JWT de usuários utilizando Node.js com Login, bcrypt e rotas protegidas.

### O que API permite?

- Cadastrar novos usuários
- Fazer Login
- Acessar uma rota protegida com token validado

## 🚀 Tecnologias e Bibliotecas

- Node.js
- MySQL
- Express
- jsonwebtoken
- dotenv
- bcryptjs

## 📁 Estrutura do Projeto

```bash
server.js
src/
├── controllers/
├── data/
├── middlewares/
└── routes/
```

## ▶️ Executando o Projeto

```
git clone <url-do-repositorio>
npm install # Instalar as dependências
# Atualizar as variáveis de ambiente
```

## 🧠 Conceitos Praticados

- Configurar o Node.js com Express e MySQL
- Criar e conectar um banco de dados MySQL
- Trabalhar com variáveis de ambiente
- Validar usuário e senha
- Evitar cadastros duplicados
- Proteger senhas utilizando bcrypt
- Criar login com consulta ao banco de dados
- Gerar tokens com JWT
- Configurar o payload e a expiração do token
- Criar um middleware de autenticação
- Trabalhar com o cabeçalho Authorization e Bearer Token
- Proteger rotas da API
- Testar token ausente, válido e expirado

## 💡 Insights

- Integrar com frontend
- Verificar e corrigir códigos de status (status code)
