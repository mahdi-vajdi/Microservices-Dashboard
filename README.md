# Nestsj Microservice App
A showcase of a microservices back-end web app created with NestJs utilizing Nats and GRPC for commumncation between services.
<br>
The services are merely mock examples of how a real world microservice would be.

# How to run in development environment
1. Create env for each service based on the env.example file in the root directory of each service.
Application can be built and run using docker compose tool.

2. Make sure you have Docker installed and running, then run this command in the root directory of the project
```bash
# linux
$ docker compose up --build -V
```
