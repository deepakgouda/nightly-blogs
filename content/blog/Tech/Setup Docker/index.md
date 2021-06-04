---
title: It's time for Docker
author: Deepak
tags: [tech, framework]
date: "2021-06-04"
thumbnail: ./images/nako.jpg
description: My notes on creating a docker image, spinning up containers and using docker volumes.
---

## Why Docker?
Recently we started working on a big project with two separate codebases and several modules with disparate dependencies. Each dependency had a separate installation procedure and replicating the setup in a new machine started getting cumbersome. Quite often either the installations failed, build failed or the CI/CD broke off. Hence, we moved the application into a docker image. 

A docker image is a standardized executable component that combines application source code with all the operating system (OS) libraries and dependencies required to run the code in any environment. Creating a docker image requires a one-time setup in a `Dockerfile`. Several frameworks, for instance database systems like Postgres can be installed as a docker image. One can pull the docker image and get the DB up and running in seconds, hence circumventing the entire installation procedure. Just like spawning virual machines, one can spin up several docker containers and each will be in an isolated environment hence precluding dependency errors, version issues and helping in error replications.

## How to setup a Docker image?
Let us consider a sample C++ project **Titan** which uses _cmake_ to build and further, interacts with a PostgreSQL database. We will be using the C++ client `libpqxx` to interact with the database. Hence, the `DockerFile` would install all the necessary frameworks just like setting up a fresh machine. We would be using an Ubuntu 20.04 environment for the same and the `DockerFile` would look like :


### Sample code and configurations
#### Docker
```docker
# Specify OS
FROM ubuntu:20.04

# Specify work directory
COPY . /usr/src/Titan

# Perform necessary installations
RUN apt-get update && apt-get -y install cmake git vim gdb gcc-9 g++-9 build-essential

# Install libpqxx
RUN apt install -y libpq-dev
WORKDIR /usr/src/Downloads/
RUN mkdir -p /usr/src/Downloads/
RUN git clone https://github.com/jtv/libpqxx.git
WORKDIR /usr/src/Downloads/libpqxx
RUN ./configure
RUN make
RUN make install

# Build the source
RUN mkdir -p /usr/src/Titan/build
WORKDIR /usr/src/Titan/build
RUN cmake ..
RUN make
```

#### CMake
```cmake
cmake_minimum_required(VERSION 3.0.0)
project(Titan VERSION 0.1.0)

# flags
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED True)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -pthread")

# include source files and header
include_directories(${CMAKE_SOURCE_DIR}/src ${CMAKE_SOURCE_DIR}/include)
set(SOURCES ./src/main.cpp ./src/utility.cpp)
add_executable(main ${SOURCES})

# include `libpq` and `libpqxx`
find_library(PQXX_LIB pqxx)
find_library(PQ_LIB pq)
target_link_libraries(main ${PQXX_LIB} ${PQ_LIB})
```

Here, we use C++ 20 and compile the source files `main.cpp` and `utility.cpp` into the binary `main`. We also link `libpqxx` and `libpq` to the binary.

### Building and running the container
We build the docker container using
```bash
docker build --pull --rm -f "/path/to/Dockerfile" -t titan:madman "/path/to/Titan" 
```
This creates a docker image which performas all the installations and builds necessary. Now one can spawn several instances of this environment instantaneously.

Additional `docker image` commands:
```bash
docker images                   # view all docker images using
docker image rm <image_name>    # remove a docker image
```

_Note : All Docker files are physically located in /var/lib/docker/_

Running to run a container using the docker image
```bash
docker run --rm -it titan:madman                                            # spawn an interactive terminal along with the container
docker run --rm -it --network=host titan:madman                             # connect container to network
docker run --name sanguine_strange --rm -it --network=host titan:madman     # give a custom name to the container
```
Additional `docker container` commands
```bash
docker container ls                         # list all containers
docker container stop <container-id/name>   # stop a container
docker container rm <container-id/name>     # remove a container
```

### Persistent storage
Individual docker containers do not have a persistent storage, making them lightweight and fast. To persist storage, one can use `docker volume`. Effectively, docker volumes are similar to [bind mounts](https://docs.docker.com/storage/bind-mounts/) except that volumes are managed by Docker and are isolated from the core functionality of the host machine. We map a specific directory on disk to a mount volume inside the docker.

```bash
docker volume create data_lake
docker run --network=host --rm -it -v data_lake:/mnt/data titan:madman      # the volume will be mounted to /mnt/data inside the container
```

*Note : the volume can be found at /var/lib/docker/volume/<volume_name>/_data*

A single docker volume can be mounted to multiple containers and hence can be used as data mounts or for interprocess communication as well.

### Setting up Postgres
```bash
# download the postgres latest image
docker pull postgres

# spawn a container
docker run --name bigger_banner -e POSTGRES_PASSWORD=postgres -it -p 5432:5432 -v data_lake:/var/lib/postgresql/data/ postgres:latest
```

Here, we map the volume `data_lake` to the postgres default installation directory.
Now, we can spin a separate container with the volume `data_lake` mapped to `/var/lib/postgresql/data/` and now the new container can access postgres although they are two separate instances.