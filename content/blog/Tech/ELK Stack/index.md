---
title: Self-managed ELK Stack
author: Deepak
tags: [tech, framework]
date: "2021-02-22"
thumbnail: ./images/kalpa.png
description: Introduction to ELK Stack [Part 1].
---

# Introduction
**ELK** is a combination of _**E**lasticsearch_, _**L**ogstash_ and _**K**ibana_. Together with _Beats_ the combination is a self-sufficient pipeline to collect logs, parse and extract data points, store them in a non relational database that provides querying and indexing data followed by creating powerful and stunning visualizations in real time, in one swift motion. This post would describe the setup of a self-managed ELK stack to ingest custom logs using Filebeat. 

**Note** : Given that ELK setup consitutes of multiple moving parts along with a huge number of add-ons, custom configurations as well as additional concepts like Index templates and Lifecycle policies, I would be adding multiple links to documentations and this article _would not be an exhaustive guide_ to understand and setup the complete stack. This article offers a _basic understanding of what ELK is_, what are the _important documentations_ you should go through, what are _the latest configurations_ you would need, along with solutions to multiple errors or known bugs that consume appreciable time and effort to discover and resolve.

The entire ELK stack documentation is ginormous and I mention only the documentations you would require for the initial setup and depending on your use-case you might need to read up additional documentations.

### Components 
1. Beats : Data collection
	* Filebeat - collect and ship log files, most commonly used beat
	* Auditbeat - audit user and process activity on Linux servers
	* Metricbeat - monitor various PC and OS stats like system-level CPU usage, memory, file system, disk IO, and network IO statistics
2. Logstash : Data aggregation and processing
3. ElasticSearch : Indexing and storage
4. Kibana : Analysis and visualization

# Policies and Index Patterns
Before starting this section I would ask the reader to understand what is an [Elasticsearch Index](https://www.elastic.co/blog/what-is-an-elasticsearch-index), [Lifecycle policy](https://www.elastic.co/guide/en/elasticsearch/reference/master/set-up-lifecycle-policy.html) and [Index lifecycle management](https://www.elastic.co/guide/en/elasticsearch/reference/current/index-lifecycle-management.html). The complete documentation can be found [here](https://www.elastic.co/guide/en/kibana/current/index.html).

To create a fresh data stream, [create a custom lifecycle policy](https://www.elastic.co/guide/en/elasticsearch/reference/7.10/set-up-lifecycle-policy.html#ilm-policy-definition). 

Create a [new index pattern](https://www.elastic.co/guide/en/kibana/current/index-patterns.html#index-patterns-read-only-access) to select data belonging to a particular index and define their properties. Once additional data fields are added to an index, **refresh the field list** for the changes to take place.Once the fields are declared with a specific data type, they cannot be changed and a new index pattern has to be created.

# [Filebeat](https://www.deepakgouda.com/Filebeat)

---

# [Logstash](https://www.deepakgouda.com/Logstash)

---

# [Kibana](https://www.deepakgouda.com/Kibana)

---

# Logging and Troubleshooting
1. Error : 
	```config
	error => "mapper_parsing_exception"
	reason =>  "failed to parse field [host] of type [text] in documents with id 'blah blah'. Preview of field's value: '{name=my.host.name}'"
	caused_by => "illegal state exception"
	reason => "Can't get text on START_OBJECT at 1:974"

	```
	[Solution 1](https://discuss.elastic.co/t/failed-to-parse-field-host-of-type-text-cant-get-text-on-a-start-object-at-1-974/235221/2) : 

	Solution 2 : I had to add index in the output section of logstash config
	```yaml
	output {
			elasticsearch {
					index => "hft-filebeat"
					hosts => ["localhost:9200"]
			}
	}
	```
2. Filebeat logs
	```bash
	journalctl -f -u filebeat.service
	cat /var/log/filebeat/filebeat.log
	```
3. Logstash logs
	```bash
	sudo journalctl -f -u logstash.service
	cat /var/log/logstash/logstash-plain.log
	```

---

# FAQ 
### Deleting a range of index logs
1. Open dev console of Kibana at `http://<ip_address>:5601/app/kibana#/dev_tools/console`
2. Make a delete query
```json
POST hft-filebeat/_delete_by_query
{
	"query": {
		"range" : {
			"@timestamp" : {
				"gte" : "12/05/2020",
				"lte" : "12/09/2020",
				"format": "MM/dd/yyyy||yyyy"
					}
				}
		}
} 
```
Sources

1. [Docs](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-delete-by-query.html)
2. [Forum](https://discuss.elastic.co/t/delete-logs-in-elasticsearch-after-certain-period/75067/8)

### Making GET and PUT requests
* To make GET and PUT requests, open dev console of Kibana(`http://<ip_address>:5601/app/kibana#/dev_tools/console`)

### Important Links
1. [Logstash](https://logz.io/learn/complete-guide-elk-stack/#installing-elk)
2. [ELK Filebeat](http://localhost:5601/app/kibana#/home/tutorial/systemLogs)
3. [Beats](https://logz.io/blog/beats-tutorial/)
4. [Filebeat Config](https://www.elastic.co/guide/en/beats/filebeat/6.8/filebeat-configuration.html)