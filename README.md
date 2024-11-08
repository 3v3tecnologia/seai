# Instalando para produção

### 1 - Criar arquivo .env e definir as seguintes variáveis de ambiente

```bash
# Comunicação com o banco de dados do censo e governo
DB_HOST="Host"
DB_USER="Usuário do banco"
DB_PASSWORD="Senha do banco"
DB_PORT= #Porta

# Comunicação com o banco de dados que de tarefas assíncronas
ASYNC_JOB_URL="postgresql://USUARIO:SENHA@HOST:PORTA/BANCO_DE_DADOS"

# Chave gerada que será usada para assinar o token JWT (autenticação no sistema usando JWT)
HASH_SALT="Chave para autenticar tokens"

# Chave da API usada para a comunicação entre serviços
API_KEY="Chave da API"

# URL do sistema do irrigante
IRRIGANT_WEB_PAGE_BASE_URL="http://url_do_sistema_do_irrigante/#"
# URL do sistema do governo
GOVERNMENT_WEB_PAGE_BASE_URL="http://url_do_sistema_do_governo/#"
```

### 2 - Subir a API em modo de produção

### Método 1 - Usando docker compose

No projeto há o arquivo **docker-compose-api.yml** aonde irá conter as instruções para rodar apenas a API usando apenas o comando abaixo.

```bash
docker compose -f docker-compose-api.yml up --build -d
```

### Método 2 - Gerando a build sem usar o docker compose

O cenário abaixo descreve como rodar o projeto gerando a build da imagem da API e executando o serviço na máquina em modo localhost.

```bash
# Gerar a build da imagem
docker image build -t api -f Dockerfile.prod .

# Subir o container que irá rodar a API
docker container run -d --name api-service --network host api
```

Para verificar se a API está rodando com sucesso baixa verificar o status do container e também os logs da aplicação.

```bash
# Verificar se o contaneiner api-service subiu corretamente
docker container ls

# Verificar os logs da API
docker container logs -f --tail 10 api-service
```

# Instalação do banco de dados

## Método 1 - Instalando sem usar o Docker compose

### 1 - Criar um diretório aonde irá ficar as configurações e arquivos sql relacionados apenas ao banco de dados

```bash
mkdir seai-database
```

### 2 - Acessar o diretório criado e adicionar os arquivos .sql contendo os scripts necessários para subir os bancos de dados

```bash
cd seai-database
```

No diretório criado será adicionado os arquivos sql do censo e governo.

```bash
seai-database/
├── censo.sql
├── government.sql
```

### 3 - Rodar os comandos para subir o container do docker do postgres

Dentro do diretório criado, execute o comando abaixo.

```bash
# Criar banco de dados sem docker compose
docker run -d --name seai-database -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=iaes -v $(pwd)/.docker/postgres/data:/var/lib/postgresql/data --health-cmd="pg_isready -d db_prod" --health-interval=30s --health-timeout=60s --health-retries=5 --health-start-period=80s --restart always --network host postgis/postgis:15-3.3-alpine
```

O comando acima irá criar um banco de dados rodando no [localhost](http://localhost) com usuário postgres e senha iaes. Ao rodar o container irá ser criado um diretório **.docker/postgres/data** aonde irá ficar os dados do banco na máquina compartilhado com os arquivos do container, dessa forma se por acaso o container do banco de dados der algum problema e precisar deletar ele para subir una nova instância não irá perder os dados pois irá ficar na máquina host.

Ao executar o comando irá ser criado a pasta .docker

```bash
seai-database/
├── .docker/postgres/data
├── censo.sql
├── government.sql
```

Lembrando que o banco dados irá rodar na porta 5432 no [localhost](http://localhost) por padrão.

### E se precisar mudar a porta do banco?

Se for necessário configurar a porta para ser outra então dentro da pasta criada no máquina para inserir configurações de banco terá que criar um arquivo `postgresql.conf` e nele configurar a porta que irá ser usada.

```bash
# Especifique a porta que irá rodar
port = 5432
```

Depois basta subir o container compartilhando o arquivo de configuração do postgres com o container.

```bash
# Criar banco de dados sem docker compose
docker run -d --name seai-database -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=iaes -v $(pwd)/.docker/postgres/data:/var/lib/postgresql/data -v $(pwd)/postgresql.conf:/var/lib/postgresql/data/postgresql.conf --health-cmd="pg_isready -d db_prod" --health-interval=30s --health-timeout=60s --health-retries=5 --health-start-period=80s --restart always --network host postgis/postgis:15-3.3-alpine
```

### 4 - Mover os arquivos .sql para o container

Para executar a restauração dos bancos será necessário antes enviar os arquivos localizados na máquina host para o container. Os arquivos irão serem enviados para o diretório /tmp do container.

```bash
# Mover para a pasta do container
docker container cp government.sql seai-database:/tmp/government.sql
docker container cp censo.sql seai-database:/tmp/censo.sql
```

### 5 - Criação dos bancos de dados

Antes de restaurar, irá ser necessário criar os bancos de dados, para isso irá ser necessário acessar o bash no container e criar os bancos.

```bash
# Conectar ao Container
docker container exec -it seai-database bash

# Conectar ao banco informando o usuário
psql -U postgres

# Criar o banco de dados do governo
create database government;

# Criar o banco de dados do censo
create database censo;

# Terminar operação
\q

# Sair do container (se quiser)
exit
```

### 6 - Criação das tabelas e inserção de dados default

Acessando o container, basta executar o psql informando o diretório dos arquivos sql do banco, dessa forma irá executar os arquivos .sql criando as tabelas para cada banco.

```bash
# Conectar ao Container
docker container exec -it seai-database bash

# Recuperar os dados
psql -U postgres -d government  -1 -f /tmp/government.sql

# Recuperar os dados do censo
psql -U postgres -d censo -1 -f /tmp/censo.sql

# Sair do container
exit
```

## Método 2 - Instalando com docker compose

Embora seja mais usado em modo de desenvolvimento e testes, esse método acaba sendo mais prático para subir a API e o banco de dados localmente com poucas configurações usando o docker compose presente no repositório da API.

Nesse caso irá ser necessário criar arquivos DDL contendo somente os comandos de criação dos bancos e tabelas que serão adicionados na pasta **schemas** e arquivos sql com comandos de inserção de dados que serão adicionados na pasta **seeds**.

### 1 - Acessar o repositório do seai (API) e adicionar os arquivos sql na pasta de schemas e seeds dentro do diretório .docker/postgres

```bash
.docker/
├── postgres/
│   ├── schemas/
│   │   ├── censo.sql
│   │   ├── government.sql
│   ├── seeds/
│   │   ├── censo.sql
│   │   ├── government.sql
│   └── seed.sh

```

Na pasta de schemas ficará os scripts DDL de criação de banco e tabelas.

Na pasta de seeds ficará os scripts de inserção dos dados nas tabelas.

### 2 - Dar permissão de execução para o script seed.sh

Esse script irá ser responsável por executar os comandos de inserção de dados nas tabelas criadas no momento que executa o container, para isso será necessário dar permissão de execução para ele.

```bash
chmod +x .docker/postgres/seed.sh
```

### 3 - Subir o banco usando o docker compose

Antes será necessário checar se o arquivo .env foi criado no diretório raiz do projeto e se há o nome do usuário e senha do banco

```bash
# Comunicação com o banco de dados do censo e governo
DB_USER="postgres"
DB_PASSWORD="iaes"
```

Agora basta executar o compose para subir apenas o banco dados

```bash
docker compose up database -d
```

### 4 - Rodar o script para popular o banco

Para popular o banco com dados presentes no **.docker/postgres/seeds** basta rodar o comando abaixo.

```bash
docker container exec -w /usr/src seai-database bash seed.sh
```
