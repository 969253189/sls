# Collect and analyze Nginx access logs {#concept_efy_c3q_zdb .concept}

Many webmasters use Nginx as the server to build websites. When analyzing the website traffic data, they must perform a statistical analysis on Nginx access logs to obtain data such as the page views and the access time periods of the website. In the traditional methods such as CNZZ, a js is inserted in the frontend page and will be triggered when a user accesses the website. However, this method can only record access requests. Stream computing and offline statistics & analysis can also be used to analyze Nginx access logs, which however requires to build an environment, and is subject to imbalance between timeliness and analytical flexibility.

Log Service supports querying and analyzing real-time logs, and saves the analytical results to Dashboard, which greatly decreases the analytical complexity of Nginx access logs and streamlines the statistics of website access data. This document introduces the detailed procedure of log analysis function by analyzing the Nginx access logs.

## Scenarios {#section_q5y_dmq_12b .section}

A webmaster builds a personal website by using Nginx as the server. The PV, UV, popular pages, hot methods, bad requests, client types, and referer tabulation of the website are obtained by analyzing Nginx access logs to assess the website access status.

## Log format {#section_qdx_2mq_12b .section}

**We recommend that you use the following `log_format` configuration for better meeting the analytic scenarios:**

```
    log_format main '$remote_addr - $remote_user [$time_local] "$request" $http_host '
                        '$status $request_length $body_bytes_sent "$http_referer" '
                        '"$http_user_agent" $request_time $upstream_response_time';
```

The meaning of each field is as follows.

|Field|Meaning|
|:----|:------|
|remote\_addr|Client address|
|remote\_user|The client username.|
|time\_local|The server time.|
|request|The request content, including method name, address, and HTTP protocol.|
|http\_host|The HTTP address used by the user request.|
|Status|The returned HTTP status code.|
|request\_length|The request size.|
|body\_bytes\_sent|The returned size.|
|http\_referer|The referer.|
|http\_user\_agent|The client name.|
|Request\_time|The overall request latency.|
|upstream\_response\_time|The processing latency of upstream services.|

## Procedure {#section_vvf_jmq_12b .section}

## 1. Open the data import wizard {#section_e33_kmq_12b .section}

Log Service provides the data import wizard to access data sources fast. To collect Nginx access logs to Log Service, use the following two methods to enter the data import wizard.

-   Creat a Project

    Click **Wizard** after creating a Logstore in an existing project or a newly created project.

     ![](images/5889_en-US.png "Data Access wizard")

-   For an existing Logstore, click the Data Import Wizard icon 1 on the Logstore List page.

    ![](images/5890_en-US.png "Logstore List")


## 2. Select a data source {#section_mkt_nmq_12b .section}

Log Service provides many types of data sources, such as cloud service, third-party software, API, and SDK. To analyze the Nginx access logs, select **NGINX ACCESSLOG** \> **Third-Party Software**.

## 3. Configure the data source {#section_tvf_qmq_12b .section}

1.  Enter the Configuration Name and Log Path according to your actual situation. Then, enter the recommended `log_format` information in the NGINX Log Format field.

    ![](images/5891_en-US.png "Configure a data source")

    Log Service automatically extracts the corresponding keys.

    **Note:** `$request` is extracted as two keys: `request_method`and `request_uri`.

    ![](images/5892_en-US.png "Nginx key")

2.  Apply to the machine groups.

    If you have not created a machine group, you must create one first. For how to create a machine group, see [Create a machine group with an IP address as its identifier](../../../../reseller.en-US/User Guide/Logtail collection/Machine Group/Create a machine group with an IP address as its identifier.md).

    **Note:** It takes up to three minutes for the Logtail configuration to take effect, so be patient.


## 4. Search, analysis, and visualization {#section_lzx_wmq_12b .section}

Make sure the heartbeat statuses of the machine groups that apply the Logtail configuration are normal and you can click Preview on the right to obtain the collected data.

![](images/5894_en-US.png "Preview")

Log Service provides predefined keys for analysis and usage. You can select the actual keys \(generated according to the previewed data\) to map with the default keys.

![](images/5895_en-US.png "Key value index Properties")

Click Next. Log Service configures the index attributes for you and creates the `nginx-dashboard` dashboard for analysis and usage.

## 5. Analyze access logs {#section_mz1_1nq_12b .section}

After the index feature is enabled, you can view the analysis of each indicator on the page where dashboards are generated by default. For how to use dashboards, see [Create and delete a dashboard](../../../../reseller.en-US/User Guide/Query and visualization/Dashboard/Create and delete a dashboard.md).

![](images/5896_en-US.png "Dashboard")

-   **PV/UV statistics \(pv\_uv\)** 

    Count the numbers of PVs and UVs in the last day.

    ![](images/5897_en-US.png "PV/UV Statistics ")

    Statistical statement:

    ```
      * | select approx_distinct(remote_addr) as uv ,
             count(1) as pv , 
             date_format(date_trunc('hour', __time__), '%m-%d %H:%i') as time
             group by date_format(date_trunc('hour', __time__), '%m-%d %H:%i')
             order by time
             limit 1000
    ```

-   **Count the top 10 access pages \(top\_page\)** 

    Count the top 10 pages with the most PVs in the last day.

    ![](images/5899_en-US.png "Statistical access")

    Statistical statement:

    ```
     * | select split_part(request_uri,'?',1) as path, 
         count(1) as pv  
         group by split_part(request_uri,'?',1) 
         order by pv desc limit 10
    ```

-   **Count the ratios of request methods \(http\_method\_percentage\)** 

    Count the ratio of each request method used in the last day.

    ![](images/5900_en-US.png "Request Method share")

    Statistical statement:

    ```
     * | select count(1) as pv,
             request_method
             group by request_method
    ```

-   **Count the ratios of request statuses \(http\_status\_percentage\)** 

    Count the ratio of each request status \(HTTP status code\) in the last day.

    ![](images/5901_en-US.png "Count the ratios of request statuses")

    Statistical statement:

    ```
     * | select count(1) as pv,
             status
             group by status
    ```

-   **Count the ratios of request UA \(user\_agent\)** 

    Count the ratio of each browser used in the last day.

    ![](images/5902_en-US.png "Count the ratios of request UA ")

    Statistical statement:

    ```
     * | select count(1) as pv,
         case when http_user_agent like '%Chrome%' then 'Chrome' 
         when http_user_agent like '%Firefox%' then 'Firefox' 
         when http_user_agent like '%Safari%' then 'Safari'
         else 'unKnown' end as http_user_agent
         group by http_user_agent
         order by pv desc
         limit 10
    ```

-   **Count the top 10 referers \(top\_10\_referer\)** 

    Count the top 10 referers in the last day.

    ![](images/5903_en-US.png "Count the top 10 referers ")

    Statistical statement:

    ```
     * | select count(1) as pv,
             http_referer
             group by http_referer
             order by pv desc limit 10
    ```


## 6 Access diagnostics and Optimization {#section_qkz_mnq_12b .section}

In addition to some default access indicators, webmasters often have to diagnose some access requests to check the latency of request processing, what are the long latencies, and on what pages long latencies occur. Then, you can enter the query page for fast analysis.

-   **Count the average latency and the maximum latency** 

    With the average latency and the maximum latency every five minutes, you can get a picture of the latency issue.

    Statistical statement:

    ```
      * | select from_unixtime(__time__ -__time__% 300) as time, 
              avg(request_time) as avg_latency ,
              max(request_time) as max_latency  
              group by __time__ -__time__% 300
    ```

-   **Count the request page with the maximum latency** 

    After knowing the maximum latency, you need to identify the corresponding request page to optimize page response.

    Statistical statement:

    ```
      * | select from_unixtime(__time__ - __time__% 60) , 
              max_by(request_uri,request_time)  
              group by __time__ - __time__%60
    ```

-   **Count the distribution of request latencies** 

    Count the distribution of all the request latencies on the website. Place the latencies in ten buckets, and check the number of requests in each latency interval.

    Statistics statement:

    ```
    * |select numeric_histogram(10,request_time)
    ```

-   **Count the ten longest latencies** 

    In addition to the maximum latency, the second to the tenth longest latencies and their values are also counted.

    Statistics statement:

    ```
    * | select max(request_time,10)
    ```

-   **Tune the page with the maximum latency** 

    Assume that the maximum access latency occurs on the `/url2` page. To tune the `/url2` page, count the PVs, UVs, numbers of various methods, statuses, and browsers, the average latency, and the maximum latency of the `/url2` page.

    Statistical statement:

    ```
       request_uri:"/url2" | select count(1) as pv,
              approx_distinct(remote_addr) as uv,
              histogram(method) as method_pv,
              histogram(status) as status_pv,
              histogram(user_agent) as user_agent_pv,
              avg(request_time) as avg_latency,
              max(request_time) as max_latency
    ```


After obtaining the preceding data, you can make targeted and detailed assessments on the access status of this website.

