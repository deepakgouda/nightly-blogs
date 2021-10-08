---
title: Grok Patterns
author: Deepak
tags: [tech, framework]
date: "2021-02-26"
thumbnail: ./images/hampta.jpg
description: Custom formatting rules and examples to parse logs.
---

Although this article is a part of the [Self-managed ELK Stack](https://www.deepakgouda.com/Self-managed-ELK-Stack) articles, it can be read as an independent module as well due to the fact that Grok patterns are a common standard and not ELK specidic.

# Grok Patterns

### Parsing timestamps :
```
%{YEAR}-%{MONTHNUM}-%{MONTHDAY} %{HOUR}:%{MINUTE}:%{SECOND}
```
**Ideal method **
```config
filter {
  if [type] == "artim-learning" {
    grok {
      match => {
        "message" => [
          "%{TIMESTAMP_ISO8601:logdate} ....other fields..."
        }
      }
    }
    date {
      match => [ "logdate", "YYYY-MM-dd HH:mm:ss,SSS" ]
    }
  }
}
```

### Add field to grok pattern
```config
filter {
  grok {
    match => [ "message", "\A%{SYSLOG5424PRI}%{SYSLOGTIMESTAMP}%{SPACE}%{BASE16NUM:docker_id}%{SYSLOG5424SD}%{GREEDYDATA:python_log_message}" ]
    add_field => { "container_id" => "%{docker_id}" }    
  }  
}
```

### Example Log
```config
# 1,30-12-2020 15:56:59,Thor,Asgard,Mjolnir and Stormbreaker,27-Jan-2021,100,97.29
1,%{DATESTAMP:log_ts},%{WORD:hero},%{WORD:origin},%{DATA:weapons},%{DATA:curr_date},%{INT:dps},%{NUMBER:hp}
```
**NOTE 1** : `WORD` will parse only a single word whereas `DATA` uses a greedy approach to parse multiple words

**NOTE 2** : Specifying `{INT:dps}` doesn't parse the value to an integer but a string only. To convert the value to an integer use `mutate`
```json
filter {
  mutate {
    convert => { "dps" => "integer" }
  }
}
```

### Custom formats of timestamps
```config
date {
		match => ["log_ts", "YYYY-MM-dd HH:mm:ss.SSS"]
		target => "@timestamp"
}
```

### GROK Parse failures : 
[GROK Debugger 1](http://localhost:5601/app/kibana#/dev_tools/grokdebugger)

[GROK Debugger 2](https://grokdebug.herokuapp.com/)

[Commonly used patterns](https://github.com/logstash-plugins/logstash-patterns-core/blob/master/patterns/grok-patterns)