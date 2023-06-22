## ADM:
- Irá criar o usuário apenas com o Email, Acessos, e Tipo de usuário
- Caso o email existir, deverá retornar uma mensagem de erro.
- Deverá ser informado qual tipo de acesso o usuário irá ter, caso contrário irá retornar uma mensagem de erro.
- Caso o email tiver um formato inválido ou não existir, deverá retornar uma mensagem de erro.
- Ao criar um novo usuário, irá ter que enviar um email para o usuário para ele continuar o processo de cadastramento
- Deve ser capaz de enviar um email para o usuário contendo o link para o processo de cadastramento caso o usuário
- Ao criar o usuário, deverá criar o ID único do usuário.

## USER:
- Deve ser capaz de atualizar os campos Login, Nome pelo o ID do usuário.
- Não ser capaz de criar um usuário com nome já existente
- Não deve ser capaz de criar um usuário com login existentes
- Caso não confirmar a senha, deverá emitir uma mensagem de erro informando que a senha não é igual.
- Ao tentar criar um usuário sem confirmar a senha, deverá retornar uma mensagem de error.
- Se criar uma senha com quantidade de caracteres inferior a 6, deverá emitir um erro na resposta.
- Deverá realizar o hash da senha ao criar o usuário com sucesso
- Deverá ser criado o token de acesso do usuário quando o cadastro for realizado com sucesso.
