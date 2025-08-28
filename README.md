# 🗓 Daily Diet – API de Estudo  

Este projeto foi desenvolvido com o objetivo de **praticar a construção de APIs RESTful** utilizando Node.js e TypeScript.  
O foco está em aplicar boas práticas de arquitetura, organização de código e integração com banco de dados relacional.  

---

## 📚 Objetivos de Aprendizado  
- Estruturação de uma API RESTful com Node.js e TypeScript.  
- Utilização do **Knex.js** como query builder.  
- Configuração de ambientes com arquivos `.env`.  
- Gerenciamento de banco de dados com **migrations** e **seeds**.  
- Padronização de código com **ESLint**.  

---

## 🛠️ Tecnologias Utilizadas  
- **Node.js**  
- **TypeScript**  
- **Knex.js**  
- **SQLite** (ajustar caso seja outro banco)  
- **ESLint**  

---

## 📂 Estrutura do Projeto  

```
.
├── src/  
│   ├── controllers/        # Lógica de controle das rotas  
│   ├── routes/             # Definição de endpoints da API  
│   ├── services/           # Regras de negócio  
│   ├── repositories/       # Camada de acesso ao banco de dados  
│   └── utils/              # Funções auxiliares  
├── .env.example  
├── .env.test.example  
├── knexfile.ts  
├── package.json  
└── tsconfig.json  
```

---

## ▶️ Como Executar Localmente  

1. Clone o repositório:  
   ```bash
   git clone https://github.com/ronaldo-lima-junior/daily-diet.git
   cd daily-diet
   ```

2. Instale as dependências:  
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:  
   - Copie o arquivo `.env.example` para `.env`  
   - Caso utilize testes, configure também o `.env.test`  

4. Execute as migrations:  
   ```bash
   npx knex migrate:latest
   ```

5. (Opcional) Popule o banco com seeds:  
   ```bash
   npx knex seed:run
   ```

6. Inicie o servidor em ambiente de desenvolvimento:  
   ```bash
   npm run dev
   ```

---

## 📡 Endpoints da API  

### Usuários  
| Método | Rota          | Descrição                    |  
|--------|---------------|------------------------------|  
| POST   | `/users`      | Cria um novo usuário         |  
| GET    | `/users/:id`  | Retorna dados de um usuário  |  

### Refeições  
| Método | Rota              | Descrição                           |  
|--------|-------------------|-------------------------------------|  
| POST   | `/meals`          | Cria uma nova refeição              |  
| GET    | `/meals`          | Lista todas as refeições do usuário |  
| GET    | `/meals/:id`      | Retorna detalhes de uma refeição    |  
| PUT    | `/meals/:id`      | Atualiza os dados de uma refeição   |  
| DELETE | `/meals/:id`      | Remove uma refeição                 |  

### Relatórios  
| Método | Rota                  | Descrição                                       |  
|--------|-----------------------|-------------------------------------------------|  
| GET    | `/metrics`            | Retorna estatísticas gerais do usuário          |  
| GET    | `/metrics/summary`    | Exibe resumo da dieta (refeições dentro/fora)   |  


---

## 📌 Observação  

Este projeto tem caráter **educacional** e foi desenvolvido para **estudos práticos** de desenvolvimento de APIs.  
