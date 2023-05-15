# seai

- Create ***env_file*** in root folder before run docker container:
    ```shell
    POSTGRES_USER=""
    POSTGRES_PASSWORD=""
    ```    
## Run docker container 
>Using docker compose
```shell
docker compose up -d
```
## Connect to Postgres 
```shell
docker container exec -it seai-database psql
```
Or
```shell
psql -h localhost -U root
```

