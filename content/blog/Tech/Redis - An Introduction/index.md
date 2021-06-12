---
title: Redis - An Introduction
author: Deepak
tags: [tech, framework, database]
date: "2021-05-15"
thumbnail: ./images/key-gompa.jpg
description: My notes on setting up Redis and solving a standard problem.
---
# What is Redis?
Redis is an in-memory data storage system which is often used as a cache as well as database. It provides standard data structures such as Hash Tables, Lists, Sorted sets and Streams. It is a high performance key-value based data store and uses the RAM for storage as opposed to non-volatile disks used by conventional data bases. 

While this enables Redis to offer high performance, it cannot guarantee recoverability in case of an unforeseen event on the Redis host. Redis offers persistent data storage onto disk in several modes where one can take a snapshot of the data at specific time intervals(RDB), maintain a persistent log file(similar to [Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html)) or no persistence at all. Advantages, disadvantages and tradeoffs mentioned [here](https://redis.io/topics/persistence).

Redis also offers a leader-follower or Master-slave architecture through replication, as well as high availability through [Redis Clusters](https://redis.io/topics/cluster-tutorial) or [Redis Sentinel](https://redis.io/topics/sentinel). Redis replication is non-blocking on the master side and it uses asynchronous replication calls. More details on replication [here](https://redis.io/topics/replication). Redis offers partitioning of data as well, allowing us to break the limitations of RAM storage on a single machine. More details on partitioning [here](https://redis.io/topics/partitioning).

Access the complete Redis documentation [here](https://redis.io/documentation).

# Message passing in Redis
Redis offers interesting data structures to implement message passing. Three of them namely Redis Streams, Message Queues and Redis Pub/Sub have been briefed here.

### Redis Streams
* doubles as a communication channel for building streaming architectures and as a log-like data structure for persisting data
* events are immutable and the history, when trimmed, is often saved in cold storage
* each service writes to its own stream and other services will optionally observe (i.e. “pull” from) it. This makes one-to-many communication much more efficient than with message queues.
* you don’t need to specify the event-subscribers in advance
* streams can be trimmed to remove older entries and deleted history often gets preserved in an archival format.
* being a reliable streaming communication channel, it is an **at-least-once** system

### Message Queues
* based on mutable lists
* use a “push” type of communication
* when successfully processed, they are deleted from the system

### Redis Pub/Sub
*  an **at-most-once** messaging system that allows publishers to broadcast messages to one or more channels. 
*  Redis Pub/Sub is designed for real-time communication between instances where low latency is of the utmost importance, and as such doesn’t feature any form of persistence or acknowledgment. 
*  It is the leanest possible real-time messaging system, perfect for financial and gaming applications, where every millisecond matters.

[Source](https://redislabs.com/solutions/use-cases/messaging/)

# Installation
On Debian distros
```bash
$ sudo add-apt-repository ppa:redislabs/redis
$ sudo apt-get update
$ sudo apt-get install redis
```

Check the server status with
```bash
service redis-server status
```
## Manual Installation
### Download
```bash
wget https://download.redis.io/releases/redis-6.2.3.tar.gz
```

### Install & Run

```bash
make 						# default config
make USE_SYSTEMD=yes		# build with systemd support. Needs libsystemd-dev.
```

```bash
cd src
./redis-server						# with default config
./redis-server /path/to/redis.conf	# with custom config
```

#### Install system wide (```/usr/local/bin```)
```bash
make install

# To configure init scripts and config files
cd utils
./install_server.sh
```


#### Start and Stop Redis
You'll be able to stop and start Redis using the script named
`/etc/init.d/redis_<portnumber>`, for instance `/etc/init.d/redis_6379`

## Manual Uninstall
```bash
make uninstall
```


# Redis Clients
Redis has a multitude of clients, all of which are listed [here](https://redis.io/clients). The C++ client is discussed here.
## Redis Plus Plus
The recommended Redis client for C++ is [Redis Plus Plus](https://github.com/sewenew/redis-plus-plus). It has been well documented with an active developement community.
### Download, Build and Install
Redis-plus-plus is based on [Hiredis](https://github.com/redis/hiredis) which is a C Client for Redis. Hence, install hiredis first. 
```bash
git clone https://github.com/redis/hiredis.git
cd hiredis

# Install in default path (/usr/local)
make
make install

# Install in custom path
make PREFIX=/custom/path/
make PREFIX=/custom/path/ install
```

Next, install redis-plus-plus (uses cmake)
```bash
git clone https://github.com/sewenew/redis-plus-plus.git
cd redis-plus-plus
mkdir build
cd build
cmake ..
make
make install
```
If hiredis is installed at non-default location, use `CMAKE_PREFIX_PATH` to specify the installation path of hiredis. By default, redis-plus-plus is installed at `/usr/local`. However, you can use `CMAKE_INSTALL_PREFIX` to install redis-plus-plus at non-default location.
```bash
cmake -DCMAKE_PREFIX_PATH=/path/to/hiredis -DCMAKE_INSTALL_PREFIX=/path/to/install/redis-plus-plus ..
```

### Adding Redis as a package to an existing cmake file
```cpp
set(SOURCE_FILES app.cpp)
add_executable(app ${SOURCE_FILES})

find_path(HIREDIS_HEADER hiredis)
target_include_directories(app PUBLIC ${HIREDIS_HEADER})

find_library(HIREDIS_LIB hiredis)
target_link_libraries(app ${HIREDIS_LIB})

find_path(REDIS_PLUS_PLUS_HEADER sw)      # NOTE: this should be *sw* NOT *redis++*
target_include_directories(app PUBLIC ${REDIS_PLUS_PLUS_HEADER})

find_library(REDIS_PLUS_PLUS_LIB redis++)
target_link_libraries(app ${REDIS_PLUS_PLUS_LIB})
```

## Benchmarks
Link the hiredis and redis++ libraries while compiling a c++ file
```bash
g++ -std=c++11 -o app app.cpp -lhiredis -lredis++ -pthread
```
I ran some benchmarking tests for the write speeds of Redis. Here's the code snippet
```cpp
#include <iostream>
#include <future>
#include <thread>
#include <sw/redis++/redis++.h>
#include <unistd.h>

using namespace sw::redis;

int main()
{
    try
    {
        // Number of tests to run.
        int max_iter = 10;
        double total_time = 0;
        // Length of data packet, number of packets to write
        int data_len = 500, num_records = 1e5;
        std::string data;
        for (int i = 0; i < data_len; i++)
        {
            data += "*";
        }
        for (int iter = 0; iter < max_iter; iter++)
        {
            redis.flushall();
            auto start = high_resolution_clock::now();
            for (int i = 0; i < num_records; i++)
            {
                redis.set(std::to_string(i), data);
                // To read data
                // redis.get(std::to_string(i));
            }
            auto end = high_resolution_clock::now();
            auto elapsed = duration_cast<milliseconds>(end - start).count() / 1000.0;
            total_time += elapsed;
        }

        std::cout << "Record size : " << data_len << " Bytes" << std::endl;
        std::cout << "Num records : " << num_records << std::endl;
        std::cout << "Avg : " << total_time / max_iter << " seconds" << std::endl;
        std::cout << "Avg : " << num_records / (total_time / max_iter) << " records/second" << std::endl;
    }
    catch (const Error &e)
    {
        // Error handling.
    }
    return 0;
}
```

Results:
```bash
# Write
Record size : 200 Bytes
Num records : 100000
Avg : 1.7691 seconds
Avg : 56525.9 records/second

Record size : 500 Bytes
Num records : 100000
Avg : 1.8067 seconds
Avg : 55349.5 records/second

Record size : 2000 Bytes
Num records : 100000
Avg : 1.9342 seconds
Avg : 51701 records/second

# Read
Num records : 100000
Avg : 1.7055 seconds
Avg : 58633.8 records/second
```

I did not observe significant throttling or degradation in performance as I increased the packet size or number of packets. The [C# client](https://github.com/ServiceStack/ServiceStack.Redis) had significantly slower write throughput
```bash
Record size : 200 Bytes
Num records : 1e5
Time : 4.159 s
Avg : 24041 records/sec

Record size : 500 Bytes
Num records : 1e5
Time : 4.213 s
Avg : 23732 records/sec

Record size : 2000 Bytes
Num records : 1e5
Time : 4.320 s
Avg : 23146 records/sec
```

## Sample Producer-Consumer problem
Now we come to the standard [producer consumer problem](https://en.wikipedia.org/wiki/Producer%E2%80%93consumer_problem). In this case, I have considered only a single producer and single consumer since I intend to discuss the data structures and their usage rather than locks and synchronisation procedures.

I have used a [Redis List](https://redis.io/topics/data-types) here, to simulate a queue. I create two separate threads simulating a producer and a consumer who push a data packet into the queue and pop from the queue respecively.
```cpp
#include <iostream>
#include <future>
#include <thread>
#include <sw/redis++/redis++.h>
#include <unistd.h>

using namespace sw::redis;

#define prompt(x) std::cout << x << std::endl;

int pushData()
{
    Redis redis = Redis("tcp://127.0.0.1:6379");
    redis.flushall();
    int n = 100;
    while (n--)
    {
        redis.rpush("list", std::to_string(n));
        prompt("Pushed " + std::to_string(n));
    }
    return 0;
}

int popData()
{
    Redis redis = Redis("tcp://127.0.0.1:6379");
    sleep(1);
    long long len = redis.llen("list");
    while (len > 0)
    {
        auto val = redis.lpop("list");
        prompt("Popped " + *val);
        len = redis.llen("list");
    }
    return 0;
}

int main()
{
    try
    {
        std::future<int> fut1, fut2;
        fut1 = std::async(std::launch::async, pushData);
        fut2 = std::async(std::launch::async, popData);

        fut1.get();
        fut2.get();
    }
    catch (const Error &e)
    {
        // Error handling.
    }
    return 0;
}
```

Further C++ examples and usage documented [here](https://github.com/sewenew/redis-plus-plus#getting-started).
C# Hash usage [here](http://taswar.zeytinsoft.com/redis-hash-datatype/) and Set usage [here](http://taswar.zeytinsoft.com/redis-sets-datatype/).