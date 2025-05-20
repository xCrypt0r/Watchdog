IMAGE_NAME := xcrypt0r/watchdog

.PHONY: up stop build clean

up:
	docker-compose up

stop:
	docker-compose down

build:
	npm run build
	docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build

clean:
	docker-compose down --volumes --remove-orphans
	docker rmi ${IMAGE_NAME} || true
