# no docker
backend:
	npm run start:dev

# no docker
frontend:
	yarn start

rebuild all:
	docker-compose up -d --no-deps  --force-recreate --build frontend backend$(argument)

rebuild:
	docker-compose up -d --no-deps  --force-recreate --build $(service)

# dev
dev:
	docker-compose up -d --no-deps backend frontend

# docker logs
logs:
	docker-compose logs -f --tail=50 backend frontend

console:
	 docker exec -it frontend bash

migrate:
	docker exec -it `docker ps -aqf "name=backend"` npx knex migrate:latest