# Full Cycle Docker Challenge

Aplicação Node.js + Express + MySQL rodando em containers Docker com Nginx como proxy reverso.

## Configuração

### Pré-requisitos
- Docker e Docker Compose instalados
- Permissões para executar Docker (sudo ou grupo docker)

### Diretório
Este projeto está localizado em: `/docker/desafios/docker-1/`

## Como executar

### 1. Trazer a aplicação para cima

No diretório do projeto, execute:

```bash
cd /docker/desafios/docker-1
docker-compose up --build -d
```

**Nota:** Use `docker compose` (sem hífen) se estiver usando o Docker plugin moderno, ou `docker-compose` (com hífen) se estiver usando o binário clássico.

### 2. Criar a tabela do banco de dados

Na primeira execução, você precisa criar a tabela `people` no MySQL:

```bash
docker exec mysql mysql -uroot -psecret fullcycle \
  -e "CREATE TABLE IF NOT EXISTS people (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL)"
```

### 3. Acessar a aplicação

- **URL:** `http://localhost:8080/`
- A porta **8080** está exposta e serve como proxy Nginx para a aplicação Node.js
- Cada acesso insere um novo usuário aleatório na tabela `people` e exibe a lista completa

## Arquitetura

```
Nginx (porta 8080) 
  ↓ proxy_pass
Node.js App (porta 3000)
  ↓ connection
MySQL (porta 3306)
```

### Serviços

- **nginx**: Proxy reverso ouvindo na porta 8080
- **node-app**: Aplicação Express em Node.js 18
- **mysql**: Banco de dados MySQL 8.0

### Volumes

- `db-data`: Persistência de dados do MySQL
- `node-modules`: Isolamento de dependências Node.js
- `./node-app`: Bind mount para desenvolvimento local

## Fluxo de inicialização

1. Docker inicia o `mysql` com healthcheck (`mysqladmin ping`)
2. `node-app` aguarda até que TCP 3306 responda (via `dockerrize`)
3. `npm install` é executado para instalar dependências no volume `node-modules`
4. Node.js inicia e conecta ao banco
5. Nginx inicia e faz proxy para `node-app:3000`

## Credenciais

- **MySQL Root Password:** `secret`
- **Database:** `fullcycle`
- **Host:** `db` (intrafaixa Docker)

## Comandos úteis

### Ver status dos containers

```bash
docker-compose ps
```

### Ver logs de um serviço

```bash
docker-compose logs -f node-app
docker-compose logs -f mysql
docker-compose logs -f nginx
```

### Acessar o MySQL

```bash
docker exec -it mysql mysql -uroot -psecret fullcycle
```

### Parar tudo e remover volumes

```bash
docker-compose down -v
```

### Reconstruir imagens

```bash
docker-compose up --build -d
```

## Desenvolvimento

O diretório `./node-app` está montado como volume na aplicação. Mudanças em:
- `.js` são refletidas automaticamente
- `package.json` requerem rebuild (`docker-compose up --build`)

## Solução de problemas

### Erro: "Table 'fullcycle.people' doesn't exist"
Execute novamente o comando de criação de tabela (passo 2 acima).

### Erro: "Cannot find module 'mysql2'"
O `docker-entrypoint.sh` executa `npm install` automaticamente. Se persistir, remova volumes e refaça:
```bash
docker-compose down -v
docker-compose up --build -d
```

### Porta 8080 já em uso
Modifique o `docker-compose.yml` e altere `ports: - "8080:80"` para uma porta livre, ex.: `"8081:80"`.

## Notas importantes

- Credenciais são chumbadas para facilitar dev local. **NÃO use em produção.**
- O `depends_on` garante que `node-app` só inicia após `mysql` estar criado.
- O `dockerrize` aguarda a porta 3306 do MySQL para garantir que está pronto.
- O `healthcheck` do MySQL valida que a conexão está funcional.

---

**Status:** ✅ Pronto para usar. Rode `docker-compose up --build -d` e acesse `http://localhost:8080/`.
