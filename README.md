# Projeto full-stack com Web Scrapping

Esse projeto consiste em uma aplicação full-stack para extração de dados das fontes especificadas.

## Rodando o Projeto
Para rodar o projeto, utilize da infraestrutura docker proporcionada na pasta `/infra`. Ao entrar nela pela linha de comando, execute:
```
docker compose --profile prod up
```
Assim, os containers de produção serão criados e enviados

## Ressalvas
Para que seja possivel realizar o scrapping de uma página, você deve criar a fonte relacionada à página (`/font`) e deve criar um adaptador para ela (`/adapter`), pois é ele que torna possivel extrair de inúmeras fontes.

Tenha certeza também de que o site que deseja extrair permite o web scrapping

Para que o scrapping seja feito, antes você também deve criar categorias, de forma que a aplicação vai pesquisar produtos de cada categoria dentro da fonte informada

## Automação
Para você conseguir utilizar a automação em n8n, uma conta de administrador precisa estar criada. Após isso, faça login nela e pegue o token retornado pela API. No n8n, crie uma **crendencial** de **Bearer Authentification** e adicione o token que copiou. Depois disso, importe o workflow presente em `/n8n/workflow-export.json` e inicie manualmente o scrapping (Pode configurar para fazê-lo sazonalmente)
