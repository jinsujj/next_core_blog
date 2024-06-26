# build
docker-build-backend:
	docker build -f ./dockerfile/dockerfile_back -t next_core_back .

docker-build-frontend:
	docker build -f ./dockerfile/dockerfile_front -t next_core_front .

# run
docker-run-backend:
	docker run -p 5001:5001 next_core_back

docker-run-frontend:
	docker run -p 3000:3000 next_core_front

# tag
docker-tag-backend:
	docker tag next_core_back:latest jinsujj/next_core_back:latest

docker-tag-frontend:
	docker tag next_core_front:latest jinsujj/next_core_front:latest

# push
docker-push-backend:
	docker push jinsujj/next_core_back:latest

docker-push-fronted:
	docker push jinsujj/next_core_front:latest

# pull
docker-pull-backend:
	docker pull jinsujj/next_core_back:latest

docker-pull-frontend:
	docker pull jinsujj/next_core_front:latest