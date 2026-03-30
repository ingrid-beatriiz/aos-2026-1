# aos-2026-1
Aplicação Orientada a Serviços (2026.1)

---------
200 OK: curl -i http://localhost:3000/users

201 Created (Criado com Sucesso): curl -i -X POST http://localhost:3000/users -H "Content-Type: application/json" -d '{"username": "user_status", "email": "status@email.com"}'

400 Bad Request (Erro do Cliente / Regra do Banco): curl -i -X POST http://localhost:3000/users -H "Content-Type: application/json" -d '{"username": "user_status", "email": "status@email.com"}'


