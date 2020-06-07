## demo add um novo Botão: "Como chegar?" no app mobile
<iframe  title="YouTube video player" width="480" height="390" src="http://www.youtube.com/watch?v=2ydDvdFP1Gs?autoplay=1" frameborder="0" allowfullscreen></iframe>
<iframe width="560" height="315" src="https://www.youtube.com/embed/-2ydDvdFP1Gs" frameborder="0" allowfullscreen></iframe>

# ANOTAÇÕES DO BACKEND
## API RESTful

> Responsabilidade do Back-end
  - Regras de negocio
  - Conexão com bd
  - Envio de e-mails ou cnn com servidores externos
  - Autenticação de usuários
  - Criptografia e segurança

# Estruturas:
## MVC (Model/View/Controller)
  o back que gerencia e retorna todo o HTML e CSS

## REST
  o back manipula JSON, e o front fica o HTML e CSS, deixando a comunicação 
  mais leve

## TYPESCRIPT
 -- Ele facilita e fortalece o codigo, ajuda o desenvolvedor e os times, 
 principalmente no futuro!

## *************************************** PADROES *****************************
-- Usar para nomes de funcioes de um controller:
  >index    (listar itens)
  >show     (mostrar um item)
  >create   (criar um item)
  >update   (atualizar um item)
  >delete   (deletar um item)
 _______________________________________________________________________________

 ## Entidade do banco de dados
 - points (Pontos de Coleta)
    >image
    >name
    >email
    >whatsapp
    >latitude
    >longitude
    >city
    >uf
 - items (Itens de Coleta)
    >image
    >title
 - point_items (N-N | tabela 'pivot' | Itens que um ponto coleta)
    >point_id
    >item_id
 _______________________________________________________________________________

 ## Funcionalidades da aplicação
  # WEB
    [x] Cadastro de ponto de coleta
    [x] Lista os itens de coleta
  # MOBILE
    [x] Listar pontos (filtro por estado/cidade/itens)
    [x] Listar um ponto de coleta específico
    '''desafio: atualizar ponto/itens'''
