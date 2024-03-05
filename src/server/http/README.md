### Server irá agir como se fosse a camada MAIN, possuindo as seguintes responsabilidades:
- Responsável pela a configuração e execução do sistema

- Irá conter todos os módulos principais do sistema
	> Pega todos os módulos definidos no sistema e fazem eles funcionarem

- Irá configurar a minha aplicação, definindo as implementações de baixo nível
  > Irá lidar com os detalhes de menor nível do sistema
  > Tem conhecimento dos detalhes de implementação do sistema (como o servidor irá rodar, rotas, bibliotecas usadas, middlewares...)

- Conecta as camadas mais internas ( domínio, casos de uso...) com as camadas mais externas (infra, db, ...)
	> Entrega o que é mais de baixo nível para as porções de alto nível
