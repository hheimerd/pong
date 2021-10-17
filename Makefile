DOCKER_COMPOSE_FILE=docker-compose.yml
DOCKER_COMPOSE_PROD_FILE=docker-compose.prod.yml

all: build

# Build containers
build:
	docker-compose -f $(DOCKER_COMPOSE_FILE) build $(c)

# Start development version
dev:
	docker-compose -f $(DOCKER_COMPOSE_FILE) up $(c)

# Start production version
prod:
	docker-compose -f $(DOCKER_COMPOSE_FILE) -f $(DOCKER_COMPOSE_PROD_FILE) up

# Remove containers
clean:
	docker-compose -f $(DOCKER_COMPOSE_FILE) down

# Docker full clean
fclean: confirm clean
	docker stop $$(docker ps -qa)
	docker rm -f $$(docker ps -qa)
	docker rmi -f $$(docker images -qa)
	docker volume rm -f $$(docker volume ls -q)
	docker network rm $$(docker network ls -q) 2>/dev/null

confirm:
	@echo -n "Are you sure? [y/N] " && read ans && [ $${ans:-N} = y ]

.PHONY: build dev prod clean fclean confirm
