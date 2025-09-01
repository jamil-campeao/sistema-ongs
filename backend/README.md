# Projeto de Software - API do Website de Apoio a ONGs

Esta API foi desenvolvida para apoiar ONGs, fornecendo endpoints para gerenciar iniciativas, captar doações e conectar-se com voluntários. Ela serve como o backend do website de apoio a ONGs, facilitando a comunicação entre ONGs e a sociedade, promovendo impacto social positivo.

## Como Rodar o Projeto

### Rodando Localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/correalenon/projeto-de-software-website-apoio-ongs.git
   cd projeto-de-software-website-apoio-ongs/backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Certifique-se de que Docker está instalado:
   ```bash
   docker --version
   ```

4. Inicie o banco de dados PostgreSQL:
   ```bash
   docker-compose -f docker-compose.dev.yml up
   ```

5. Rode as migrations e popule o banco com dados fake:
   ```bash
   npm run migrate &&
   npm run seed
   ```

6. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

7. Acesse a API no endereço abaixo:
   ```
   http://localhost:3000
   ```

### Rodando em Produção (PRD)

1. Clone o repositório:
   ```bash
   git clone https://github.com/correalenon/projeto-de-software-website-apoio-ongs.git
   cd projeto-de-software-website-apoio-ongs/backend
   ```

2. Certifique-se de que Docker está instalado:
   ```bash
   docker --version
   ```

3. Faça build da imagem do Docker:
   ```bash
   docker-compose build
   ```

4. Inicie o Docker em modo de produção:
   ```bash
   docker-compose up
   ```

5. A API estará disponível no endereço configurado no servidor.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.
