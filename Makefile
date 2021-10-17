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

.PHONY: build dev prod clean