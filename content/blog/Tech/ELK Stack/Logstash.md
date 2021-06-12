---
title: Logstash
author: Deepak
tags: [tech, framework]
date: "2021-02-25"
thumbnail: ./images/corbett.jpg
description: Setting up Logstash module of ELK stack [Part 3].
---

This article is the third module of the **Self-managed ELK Stack** article behind [Introduction](https://www.deepakgouda.com/Self-managed-ELK-Stack) and [Filebeat](https://www.deepakgouda.com/Filebeat). Hence, it is recommended to go through the aforementioned articles before proceeding with Logstash.

# Logstash

### Installation
[Instructions here](https://www.elastic.co/guide/en/logstash/current/installing-logstash.html)

### Configuration
Workflow : 
We have installed filebeat on multiple machines which produce various types of logs. For instance let us consider the situation where machine M1 and M2 each run processes P1 and P2, hence producing logs of category C1 and C2 each. Segregating logs at filebeat is difficult but we can add tags to differentiate the logs in logstash. We setup two separate pipilines such that, logs of type C1 and C2 are parsed separately with a modular config file for each of them. 

1. Assign a source name for each filebeat in _filebeat.yml_. This source name will be used to segregate logs and redirect them to different pipelines.
  ```yaml
    filebeat.inputs:
    - type: log
      fields:
        source: 'samplename'
      fields_under_root: true
  ```

2. Create _pipeline.yml_ in `/etc/logstash/` with the following configuration
  ```yaml
    - pipeline.id: beats-server
      config.string: |
        input { beats { port => 5044 } }
        output
		{
            if [source] == 'dbservername'
			{
              pipeline { send_to => dblog }
            }
			else if [source] == 'apiservername'
			{
              pipeline { send_to => apilog }
            }
			else if [source] == 'webservername'
			{ 
              pipeline { send_to => weblog } 
            }
        }

    - pipeline.id: dblog
      path.config: "/Logstash/config/pipelines/dblogpipeline.conf"

    - pipeline.id: apilog 
      path.config: "/Logstash/config/pipelines/apilogpipeline.conf"

    - pipeline.id: weblog
      path.config: "/Logstash/config/pipelines/weblogpipeline.conf"
  ```

3. Create separate Logstash configuration files for each pipeline at: `/etc/logstash/conf.d/<conf_name>.conf`. According to this pipeline config, the three config files should be `dblogpipeline.conf`, `apilogpipeline.conf` and `weblogpipeline.conf`.

4. Create the individual logstash configurations using the following template. The grok parse instances have been mentioned in a separate article later.

**_config.conf_**
```json
input
{
	pipeline
	{
		address => sample_filebeat
	}
}

filter
{
	grok
	{
		match => {
						"message" => [
				"%{TIMESTAMP_ISO8601:log_ts}\+05\:30  \[%{DATA:log_class}\]  \"%{DATA:error_msg} for class \: %{DATA:class_name}\"",
				"%{TIMESTAMP_ISO8601:log_ts}\+05\:30  \[%{DATA:log_class}\]  \"response received at \:%{TIMESTAMP_ISO8601:response_ts} for class \: %{DATA:segment}\""
						]
		}
	}

	date
	{
		match => ["log_ts", "YYYY-MM-dd HH:mm:ss.SSS"]
		target => "@timestamp"
	}
}

output
{
	elasticsearch
	{
		index => "sample_index"
		hosts => ["localhost:9200"]
	}
}
```
5. Create a systemd service and start Logstash with `sudo service logstash start`
6. In Kibana, go to Management → Kibana Index Patterns. Kibana will display the Logstash index along with the parsed logs.

### Grok Patterns
Non-intuitive and custom grok pattern as well as examples have been mentioned in a [separate post](https://www.deepakgouda.com/GrokPatterns.md)

### Source
I would like mention [this article](https://www.codeproject.com/Tips/5271551/Configure-Multiple-Pipeline-in-Logstash) from Code Project which helped me understand the required configurations needed to set multiple pipelines and have put forth the same concisely.

Follow up with the [Kibana](https://www.deepakgouda.com/Kibana) article next and [Grok Patterns](https://www.deepakgouda.com/Grok-Patterns) article optionally.

