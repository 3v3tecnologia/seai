<a name="readme-top"></a>

<br />

<div align="center">
    <h1 align="center">SEAI</h1>
    <p align="center">
        Software 
        <br />
        <a href="https://github.com/othneildrew/Best-README-Template"><strong>Explore the docs »</strong></a>
        <br />
        <br />
        <a href="https://github.com/">View Demo</a>
        ·
        <a href="https://github.com/issues">Report Bug</a>
        ·
        <a href="https://github.com/issues">Request Feature</a>
    </p>
</div>

## About The Project
## Built With
* [![Vue][Vue.js]][Vue-url]
  
## Getting Started
This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Pré requisitos
* Node sendo recomendável versão superior a v16 para caso for necessário rodar o servidor na máquina host
 * Docker e Docker Compose
## Instalação

Clone o repositório
   ```sh
   git clone https://github.com/3v3tecnologia/seai.git
   ```
Criar o arquivo ***env_file*** na pasta raiz do projeto:
```shell
POSTGRES_USER=""
POSTGRES_PASSWORD=""
``` 

Criar o arquivo de variáveis ambiente **.env** na pasta `/backend` 
```shell
PORT=
EMAIL_PORT=
EMAIL_HOST=
EMAIL_PASSWORD=
EMAIL_USERNAME=
EMAIL_FROM=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=

```   
### Rodar o docker em modo de desenvolvimento 
Os serviços irão estar sendo executados no docker, e por meio dos volumes, irão serem compartilhados arquivos da máquina host com o daemon, possibilitando o live-reload no docker, ou seja, qualquer alteração feita nos arquivos da pasta `src` do backend irão afetar na execução do servidor no processo executado pelo o docker.
Para isso, será necessário instalar as dependências do servidor na pasta `/backend`
   ```sh
   npm ci
   ```
Será necessário checar no arquivo de comfiguração `docker-compose.dev.yml` se todas as pastas e arquivos presentes no volume do docker estão criadas na máquina host, caso contrário terá que criar eles antes de tentar seguir os próximos passos.

```sh
volumes:
      - ./backend:/usr/src/app
      - backend_node_modules:/usr/src/app/node_modules
```
No exemplo acima, será de suma importância haver o arquivo node_modules criado antes de tentar executar os containers.

Para rodar o projeto em modo de desenvolvimento usando o docker-compose, será necessário infomar o nome do arquivo usando a tag `-f`
```shell
docker compose -f docker-compose.dev.yml up -d 
```

Para remover todos os serviços, basta rodar o seguinte script
```shell
docker compose -f docker-compose.dev.yml down -d 
```
### Executar em modo de produção usando o docker compose 
Para **iniciar** o projeto em modo de produção, será necessário informa por meio da taq `-f` o arquivo YML do docker compose.
```shell
docker compose -f docker-compose.prod.yml up -d 
```
Para **remover** todos os processos, será necessário também informar o nome do arquivo
```shell
docker compose -f docker-compose.prod.yml down -d 
```
### Rodar o servidor na máquina host
Caso houver necessidade de haver que executar o servidor na máquina host, será necessário garantir que os bancos de dados estão executando e as configurações necessárias foram declaradas.

Desta forma, no arquivo `package-json` haverá scripts específicos para serem executados. 

Para rodar em modo de **produção** terá que executar o seguinte script
```sh
npm run start:prod
```
Já para modo de **desenvolvimento** haverá o seguinte script 
```sh
npm run start:dev
```
### Conectar ao PostgreSQL
```shell
docker container exec -it seai-database psql
```
## Usage
### Documentação da API
Se o servidor estiver rodando, para acessar a documentação da API do projeto, basta abrir no browser o seguinte link
```sh
http://localhost:${PORTA}/api-docs/
```
Sendo que a PORTA será variável dependendo do modo de desenvolvimento.
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

Your Name - email@example.com

Project Link: [https://github.com/your_username/repo_name](https://github.com/your_username/repo_name)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
