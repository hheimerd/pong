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
fclean: clean
	rm -rf ./backend/node_modules
	rm -rf ./backend/dist
	rm -rf ./frontend/node_modules
	docker container prune --force
	docker images prune
	docker system prune --force
	docker volume rm -f $$(docker volume ls -q)

.PHONY: build dev prod clean fclean confirm
