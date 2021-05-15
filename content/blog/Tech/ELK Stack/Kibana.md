---
title: Kibana
author: Deepak
tags: [tech, framework]
date: "2021-02-27"
thumbnail: ./images/giuseppe-argenziano.jpg
description: Setting up Kibana module of ELK stack [Part 4].
---

This article is the fourth module of the **Self-managed ELK Stack** article behind [Introduction](https://www.deepakgouda.com/Self-managed-ELK-Stack), [Filebeat](https://www.deepakgouda.com/Filebeat) and [Logstash](https://www.deepakgouda.com/Logstash). Hence, it is recommended to go through the aforementioned articles before proceeding with Kibana.

# Kibana

## Creating visualizations from filtered data
1. Open _Kibana_ -> _Discover_
2. Select appropriate index (`sample_index*`) and necessary columns
3. Click on _Save_ to save your discover search so you can use it in visualizations and dashboards 
4. If this is your first time using Kibana visualizations, you must reload your field list before proceeding. To reload, _Stack Management_ -> _Index Patterns_ -> _hft_file*_ -> _Refresh file list_ icon (on top right)
5. Click on _Visualize_ and create a new visualization
6. Click on _Dashboard_ and create a new dashboard and add the visualization

## Aggregation query
```json
POST /sample_index/_search
{
  "aggs": 
  {
    "eq_entries": 
    {
      "aggs": {
        "min_ts": { "min": { "field": "@timestamp" } }
      },
      "terms": {
        "field": "agent.keyword",
        "size": 10
      }
    }
  }
}
```

## Visualization tools
Most of visualization tools like bar and line charts are pretty straightforward and intuitive to work with. I have mentioned a couple of more advanced tools that are not completely GUI based.

### Timelion
Can be used to plot time series sequential data and allows mathematical operations. For instance, it can be used to perform point wise subtraction of two timestamp sequences to obtain latency.

#### Sample syntax
1. Offset a sequence of data by 1 hour and plot the count of logs with label `last_hour`.
  ```
  .es(offset=-1h,index=sample-filebeat,timefield='@timestamp',metric=count).label('last_hour')
  ```

2. Plot a bar graph of the frequency of logs containing the field `condition_type` such that `condition_type == exit`
  ```
  .es(index=sample-filebeat,timefield='@timestamp', metric=count,q='_exists_ : condition_type AND condition_type : exit').label('exit').bars(width=10,stack=yes),
  .es(index=sample-filebeat,timefield='@timestamp', metric=count,q='_exists_ : condition_type AND condition_type : entry').label('entry').bars(width=10,stack=yes)
  ```

3. Plot the sum of field `quantity` of logs containing the field `condition_type` such that `condition_type == entry` and assign the label `entry_sum`
  ```
  .es(index=sample-filebeat,timefield='@timestamp', metric='sum:quantity.value',q='_exists_ : condition_type AND condition_type : entry').sum().label('entry_sum')
  ```

#### Additional Links
1. [Visualization](https://www.elastic.co/guide/en/kibana/7.10/timelion-tutorial-create-time-series-visualizations.html)
2. [Conditional Logic](https://www.elastic.co/guide/en/kibana/7.10/timelion-tutorial-create-visualizations-withconditional-logic-and-tracking-trends.html)
3. [Mathematical funtions](https://www.elastic.co/guide/en/kibana/6.8/timelion-math.html)
4. [Aggregations(Highly useful)](https://coralogix.com/log-analytics-blog/advanced-guide-to-kibana-timelion-functions/)
5. [Sparse time series](https://www.elastic.co/blog/sparse-timeseries-and-timelion)

### Vega
Similar to Timelion but provides support for more complex queries such as groupby aggregations.

1. [Visualization](https://stackoverflow.com/questions/60151507/filtering-an-aggregated-chart-with-another-aggregation-field)
2. [Aggregation](https://john.soban.ski/aggregations-the-elasticsearch-group-by.html)
