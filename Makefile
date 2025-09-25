.PHONY: build up down logs clean

# Build all services
build:
	docker-compose build

# Start the application (build if needed)
up:
	docker-compose up --build

# Stop the application
down:
	docker-compose down

# View logs
logs:
	docker-compose logs -f

# Clean up containers, networks, and volumes
clean:
	docker-compose down -v --remove-orphans
	docker system prune -f
