# build
docker-build-backend:
	docker build -f ./docker/Dockerfile_back -t next_core_blog_backend .

docker-build-frontend:
	docker build -f ./docker/Dockerfile_front -t next_core_blog_front .

# run
docker-run-backend:
	docker run -p 5001:5001 next_core_blog_backend

docker-run-frontend:
	docker run -p 3000:3000 next_core_blog_front

# tag
docker-tag-backend:
	docker tag next_core_blog_backend:latest jinsujj/next_core_blog_backend:latest

docker-tag-frontend:
	docker tag next_core_blog_front:latest jinsujj/next_core_blog_frontend:latest

# push
docker-push-backend:
	docker push jinsujj/next_core_blog_backend:latest

docker-push-fronted:
	docker push jinsujj/next_core_blog_frontend:latest

# pull
docker-pull-backend:
	docker pull jinsujj/next_core_blog_backend:latest

docker-pull-frontend:
	docker pull jinsujj/next_core_blog_frontend:latest