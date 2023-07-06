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

### Prerequisites
This is an example of how to list things you need to use the software and how to install them.
 * npm
  ```
  npm install npm@latest -g
  ```
## Installation

Clone the repo
   ```sh
   git clone https://github.com/your_username_/Project-Name.git
   ```
Create ***env_file*** in root folder before run docker container:
```shell
    POSTGRES_USER=""
    POSTGRES_PASSWORD=""
``` 

Create **.env** file, in `/backend` folder 
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
### Install NPM packages
   ```sh
   npm install
   ```
### Run docker container 
>Using docker compose
```shell
docker compose up -d
```
### Run server in localhost
   ```sh
   npm run build:clean
   npm run start:prod
   ```
### Connect to Postgres 
```shell
docker container exec -it seai-database psql
```
Or
```shell
psql -h localhost -U root
```
## Usage
### API documentation
If server is running in localhost, open API documentation url in browser
```
url: http://localhost:8080/api-docs/
```
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

Your Name - email@example.com

Project Link: [https://github.com/your_username/repo_name](https://github.com/your_username/repo_name)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/