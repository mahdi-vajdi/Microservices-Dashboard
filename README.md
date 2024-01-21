# Nestsj Microservice App
A showcase project of a microservices back-end web app created with NestJs, utilizing NATS and GRPC for commumncation between services.<br>
The services in the project are merely mock examples of how a real world microservice would be.

# How to run in a development environment
1. Create env for each service based on the env.example file in the root directory of each service.
2. Application can be built and run using docker compose tool.<br>
   Make sure you have Docker installed and running on your machine;
   then run this command in the root directory of the project
```bash
# linux
$ docker compose up --build -V
```
