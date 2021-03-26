***grades-control-api***

****Objetivo****

  O objetivo foi desenvolver uma API chamada para controlar notas de alunos em diferentes matérias, utilizando Node.js e Express. Foram criados endpoints para I) criação, II) atualização, III) exclusão e IV) consulta de notas (aqui chamadas de grades). As grades foram salvas em um arquivo json, chamado “grades.json” e os endpoints atuam considerando os registros já existentes.
  
****Modelo dos registros****

  Uma grade deve possuir os campos abaixo:
 - id (int): identificador único da grade, que foi gerado automaticamente pela API
 - student (string): nome do aluno
 - subject (string): nome da matéria
 - type (string): nome da atividade
 - value (float): nota da atividade
 - timestamp (string): data e horário do lançamento
 
 ****Endpoints desenvolvidos****
 
1. Endpoint para criar uma grade. Este endpoint recebe como parâmetros os campos student, subject, type e value conforme descritos acima. Esta grade é então salva no arquivo json grades.json com um id único associado. O endpoint retorna o objeto da grade que foi criada. O incremento do identificador é feito de forma automática pela API. Dentro do arquivo grades.json foi criado o campo nextId para gerar os identificadores
2. Endpoint para atualizar uma grade. Este endpoint recebe como parâmetros o id da grade a ser alterada e os campos student, subject, type e value. O endpoint valida se a grade informada existe, caso não exista ele retorna um erro. Caso exista, o endpoint atualiza as informações no arquivo grades.json
3. Endpoint para excluir uma grade. Este endpoint recebe como parâmetro o id da grade e realiza sua exclusão do arquivo grades.json
4. Endpoint para consultar uma grade em específico. Este endpoint recebe como parâmetro o id da grade e retornar suas informações
5. Endpoint para consultar a nota total de um aluno em uma disciplina. O endpoint recebe como parâmetro o student e o subject, e realizar a soma de
todas as notas de atividades correspondentes àquele subject para aquele student. O endpoint retorna a soma da propriedade value dos registros encontrados
6. Endpoint para consultar a média das grades de determinado subject e type. O endpoint recebe como parâmetro um subject e um type, e retornar a média. A média é calculada somando o value de todos os registros que possuem o subject e type informados, e dividindo pelo total de registros que possuem este mesmo subject e type
7. Endpoint para retornar as três melhores grades de acordo com determinado subject e type. O endpoint recebe como parâmetro um subject e um type, e retornar um array com os três registros de maior value daquele subject e type
