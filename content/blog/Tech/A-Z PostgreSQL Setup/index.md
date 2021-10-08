---
title: A-Z PostgreSQL Setup
author: Deepak
tags: [tech, database, installation]
date: "2021-01-03"
thumbnail: ./images/shekwas.jpg
description: My notes to setup Postgres DB and access over network
---

# Installation
Follow the official [documentation](https://www.postgresql.org/download/).

# Initial Setup
### Switch user and open psql shell
Switch to user postgres and open shell
```bash
sudo su - postgres
psql
```

### Open without su
```bash
psql -U postgres # if you get error, check point 4, 6
```

### Switch to database `library` and view table : 
Here, we have a sample database named `library`
```
postgres=# \c library
library=# \dt+
```
Quit : `\q`

### 1. Create DB
* `sudo su - postgres`
* `$ createdb library`

### 2. Create users and grant access
* `createuser john`
* `createdb library`
#### Schema of a table
```SQL
SELECT table_catalog, table_schema 
FROM   information_schema.tables 
WHERE  table_name = 'books';
```
* `GRANT USAGE ON SCHEMA schema_name TO username;`
* `GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA schema_name TO username;`
* `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA schema_name TO username;`

### 3. Create read only user
* `sudo su - postgres`
* `CREATE USER username WITH PASSWORD 'your_password';`
* `GRANT CONNECT ON DATABASE database_name TO username;`
* `GRANT SELECT ON table_name TO username;`

### 4. Set password
1. Open the file `pg_hba.conf` for Ubuntu it will be in `/etc/postgresql/10/main` and change this line:
```
> local   all             postgres                                peer
```
to
```
> local   all             postgres                                trust
```
Restart the server

```bash
$ sudo service postgresql restart
```

Login into psql and set your password

```bash
$ psql -U postgres
db> ALTER USER postgres with password 'your-pass';
```


### 5. Enable remote access to PostgreSQL server 
```bash
sudo vim /etc/postgresql/10/main/postgresql.conf
```
Sample config
```conf
#------------------------------------------------------------------------------
# CONNECTIONS AND AUTHENTICATION
#------------------------------------------------------------------------------

# - Connection Settings -

listen_addresses = '*'     # what IP address(es) to listen on;

```
```bash
sudo service postgresql restart
```
Configure the server to accept remote connections by editing the `/etc/postgresql/10/main/pg_hba.conf` 

Sample file : 
```conf

# TYPE  DATABASE        USER            ADDRESS                 METHOD

# The user jane will be able to access all databases from all locations using a md5 password
host    all             jane            0.0.0.0/0                md5

# The user jane will be able to access only the janedb from all locations using a md5 password
host    janedb          jane            0.0.0.0/0                md5

# The user jane will be able to access all databases from a trusted location (192.168.1.134) without a password
host    all             jane            192.168.1.134            trust
```

### 6. Check status and logs
* `pg_lsclusters`
* `sudo service postgresql status`
* `sudo view /var/log/postgresql/postgresql-10-main.log`

### 7. Backup DB
Make backup
* `sudo su postgres`
* `pg_dump library > library_backup`

Restore backup
* `sudo su postgres`
* `psql library < library_backup`

# Using DB

### Useful commands
1. `\c` : current db and user
2. `\q` : quit
3. `\dt` : all tables
4. `\dt+` : all tables with size
5. `\du` : list all users
6. `\r` : cancel query
7. [Alter permissions of users](https://chartio.com/resources/tutorials/how-to-change-a-user-to-superuser-in-postgresql/)

### Syntax
1. [Source](https://www.postgresql.org/docs/9.6/sql-syntax.html)

### Schema
```SQL
CREATE TABLE library(
book_owner_id integer,
book_name text,
book_price double precision,
book_position integer DEFAULT -1,
book_damage boolean DEFAULT false);
```

# Python integration
## Insert row
```python
import psycopg2

# conn = psycopg2.connect("dbname=postgres user=postgres")
conn = psycopg2.connect("dbname=postgres user=john", password="sample_password")
cur = conn.cursor()

cur.execute("SELECT * FROM library;")
records = cur.fetchall()
print(records)

cur.execute("INSERT into library(book_owner_id, book_name, book_price) VALUES('1729', 'Odyssey', '53.21');")
cur.execute("SELECT * FROM library")
records = cur.fetchall()
print(records)

conn.commit()
conn.close()
```
### Source
1. [Full Doc](https://www.postgresql.org/docs/9.6/index.html)
2. [Official Doc](https://www.postgresql.org/docs/9.6/server-start.html)
3. [Source 1](https://linuxize.com/post/how-to-install-postgresql-on-ubuntu-18-04/)