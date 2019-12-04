docker-compose -f deploy/docker-compose.yml down
docker build -f deploy/DockerfileNodemon .
docker-compose -f deploy/docker-compose.yml build
docker-compose -f deploy/docker-compose.yml up -d
docker-compose -f deploy/docker-compose.yml logs -f
