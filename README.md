# Servidor backend SEAI

# Iniciando o projeto em modo de desenvolvimento

Será necessário instalar as dependências do node rodando o comando abaixo:

```sh
npm ci
```

Será necessário criar um arquivo `.env.development.local` contendo as variáveis ambiente` baseado nas especificações abaixo:

```sh
NODE_ENV=development
PORT=

DB_USER=""
DB_PASSWORD=""
DB_HOST=
DB_PORT=

DB_JOBS_HOST=
DB_JOBS_PORT=
DB_JOBS_USER=
DB_JOBS_PASSWORD=

HASH_SALT=""
API_KEY=""
```

Após criar as variáveis, será necessário adicionar no diretório `.docker/postgres` os **schemas** e **seeds** do banco baixados (será necessário obter os arquivos .sql)

Para subir o servidor e o banco, será necessário rodar o comando abaixo:

```sh
docker compose --env-file .env.development.local -f docker-compose.dev.yml up -d
```

> ⚠️ Caso já tiver iniciado o servidor mas for necessário apagar tudo incluindo os dados salvos no banco no host para iniciar uma nova instância será necessário rodar o comando abaixo:

```sh
docker compose -f docker-compose.dev.yml down ; sudo rm -rf ./.docker/postgres/data ; docker compose -f docker-compose.dev.yml up -d
```

### Popular o banco

Para popular o banco com dados basta rodar o script `seed.sh` presente no diretório `docker`. Logo basta rodar o comando abaixo:

```sh
docker container exec -w /usr/src seai-database-dev bash seed.sh
```
