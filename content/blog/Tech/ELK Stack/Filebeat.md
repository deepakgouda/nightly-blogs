---
title: Filebeat
author: Deepak
tags: [tech, framework]
date: "2021-02-23"
thumbnail: ./images/dzukou.jpg
description: Setting up Filebeat module of ELK stack [Part 2].
---

This article is the second module of the **Self-managed ELK Stack** article behind [Introduction](https://www.deepakgouda.com/Self-managed-ELK-Stack) . Hence, it is recommended to go through the aforementioned article before proceeding with Filebeat.

# Filebeat 

Filebeat, being the most commonly used beat has been explained here. Filebeat has to be installed on all the systems which produce logs. Filebeat collects the logs and ships them to Elasticsearch from where Kibana pulls the data for visualization.

### 1. Install
Instructions provided for [all major OS as well as Docker and Kubernetes](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-installation-configuration.html#installation).

Install filebeat version 7.8.1 on Debian
```bash
curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-7.8.1-amd64.deb
sudo dpkg -i filebeat-7.8.1-amd64.deb
```

### 2. Connect to Elastic Stack
Edit /etc/filebeat/filebeat.yml
```yaml
setup.kibana:
  host: "<kibana_ip>:5601" # kibana ip and port

output.elasticsearch:
  hosts: ["<es_ip>:9200"] # elasticsearch ip and port

  username: "elastic"
  password: "<add password>"

```

### 3. List and enable modules
```
filebeat modules list
filebeat modules enable system nginx mysql
```
Configure `/etc/filebeat/modules.d/<module>.yml` file

Add the path to log files in `/etc/filebeat/filebeat.yml`
```yaml
filebeat.inputs:
- type: log
  enabled: true
  paths:
    - /path/to/logs/*.log # load data from the corresponding path
  ignore_older: 17h       # ignore files created before the specified relative time
```
Multiple files with separate tags/configs
```yaml
filebeat.inputs:
- type: log
  enabled: true
  paths:
     - /path/to/data/*.csv
  tags: ["csv-type-x"]    # useful in performing queries to filter 
                          # logs and create visualizations

- type: log
  enabled: true
  paths:
     - /other/path/to/data/*.csv
  tags: ["csv-type-y"]

output.logstash:
   hosts: [ "<logstash_host>:5044"]
```
**Complete Config**
```yaml
filebeat.inputs:
- type: log
  enabled: true
  paths:
    - /path/to/logs/*.log
  ignore_older: 17h
  fields:
    source: 'Sample Name 1' # useful while setting multiple pipelines
    tags: ["tag1"]
- type: log
  enabled: true
  paths:
    - /path/to/logs/*.log
  ignore_older: 17h
  fields:
    source: 'Sample Name 2'
    tags: ["tag2"]  
filebeat.config.modules:
  path: ${path.config}/modules.d/*.yml
  reload.enabled: false
setup.ilm.enabled: auto
setup.ilm.policy_name: "sample-policy"
setup.ilm.overwrite: false
setup.ilm.rollover_alias: 'sample-alias-7.8.1'
setup.template.settings:
  index.number_of_shards: 1
  setup.template.enabled: true
  setup.template.overwrite: false
  setup.template.name: "sample-template"
  setup.template.pattern: "sample-template-7.8.1-*"
setup.kibana:
  host: "kibana_host:5601"
output.logstash:
   hosts: [ "logstash_host:5044"]

```

Detailed info on configurations [here](https://www.elastic.co/guide/en/beats/filebeat/current/configuring-howto-filebeat.html).
Find more configs [here](https://www.elastic.co/guide/en/beats/filebeat/current/configuration-filebeat-options.html).

**NOTE** Disable the defaults in `modules.d/system.yml` to avoid system logs.

### 4. Set up assets
From `/etc/filebeat` run
```bash
filebeat setup -e
```
`-e` is optional and it redirects the error messages from log files to console.

**NOTE** : In case you get errors static elasticsearch is not configured, it's a known [issue](https://github.com/elastic/beats/issues/16336) on github. Use 
```bash
filebeat -e
```

Create a systemd service for filebeat at `/etc/systemd/system/filebeat.service` with the config
```service
 [Unit]
 Description=Pystrat Filebeat Service
 After=network.target
 StartLimitIntervalSec=0
 [Service]
 Type=simple
 Restart=always
 RestartSec=5s
 User=deepak
 ExecStart=/usr/bin/filebeat -e
 
 [Install]
 WantedBy=multi-user.target
```

### 5. Start filebeat
```bash
# If you haven't set up filebeat as a systemd process, 
# it has been explained later
sudo service filebeat start 
```
OR
```bash
sudo filebeat -e -c filebeat.yml -d "publish"
```

### 6. Set up appropriate pipeline configurations
Further explanation on pipeline configurations in Logstash section.

### 7. View data in Kibana
Open Kibana dashboard(`http://kibana_host:5601`).

### 8. Filebeat Log location
```bash
/var/log/filebeat/
```

[Source](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-installation-configuration.html)

Follow up with the [Logstash](https://www.deepakgouda.com/Logstash) article next.