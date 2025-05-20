IMAGE_NAME := xcrypt0r/watchdog

.PHONY: up stop build clean

up:
	docker-compose -f docker-compose.yml up

stop:
	docker-compose down

build:
	npm run build
	docker-compose up --build

clean:
	docker-compose down --volumes --remove-orphans
	docker rmi ${IMAGE_NAME} || true
