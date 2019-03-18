# CreateLogstore {#reference_xl4_ttq_12b .reference}

Create a Logstore in a project.

Example:

```
POST /logstores
```

## Request syntax {#section_it1_kl2_sy .section}

```
POST /logstores HTTP/1.1
Authorization: <AuthorizationString> 
Date: <GMT Date>
Host: <Project Endpoint>
x-log-apiversion: 0.6.0
x-log-signaturemethod: hmac-sha1
{
    "logstoreName" : <logStoreName>,
    "ttl": <ttl>,
    "shardCount": <shardCount>,
    "autoSplit": <autoSplit>,
    "maxSplitShard": <maxSplitShard>
}
```

## Request parameters {#section_d4g_ll2_sy .section}

|Attribute name|Type|Required|Description|
|:-------------|:---|:-------|:----------|
|logstoreName|string|Yes|The Logstore name, which must be unique in the same project.|
|ttl|integer|Yes|Data storage time in days, which is in the value range of 1 to 3600.|
|shardCount|Integer|Yes|The number of shards in this Logstore, which is in the range of 1 to 100.|
|enable\_tracking|bool|No|Determines whether to enable Web Tracking.|
|autoSplit|bool|No|Determines whether to automatically split a shard.|
|maxSplitShard|int|No|The maximum number of shards for automatic split, which is in the range of 1 to 64. You must specify this parameter when autoSplit is true.|

## Request header {#section_nqn_nl2_sy .section}

The CreateLogstore API does not have a special request header. For more information about the public request headers of Log Service APIs, see [Public request header](intl.en-US/API Reference/Public request header.md).

## Response header {#section_of3_4l2_sy .section}

The CreateLogstore API does not have a special response header. For more information about the public response headers of Log Service APIs, see [Public response header](intl.en-US/API Reference/Public response header.md).

## Response element {#section_hy4_pl2_sy .section}

The returned HTTP status code is 200.

## Error Code {#section_evd_ql2_sy .section}

Besides the [Common error codes](intl.en-US/API Reference/Common error codes.md) of Log Service APIs, the CreateLogstore API may return the following special error codes.

|HTTP status code |ErrorCode|Error message|
|:----------------|:--------|:------------|
|400|LogstoreAlreadyExist|logstore \{logstoreName\} already exists|
|500|InternalServerError|Specified Server Error Message|
|400|LogstoreInfoInvalid|logstore info is invalid|
|400|ProjectQuotaExceed|Project Quota Exceed|

## Details description {#section_rhb_tl2_sy .section}

The Logstore cannot be created if the quota is invalid.

## Examples {#section_ml2_5l2_sy .section}

**Request example**

```
POST /logstores HTTP/1.1
Header :
{
x-log-apiversion=0.6.0, 
Authorization=LOG AK\_ID:Signature, 
Host=ali-test-project.cn-hangzhou-devcommon-intranet.sls.aliyuncs.com, 
Date=Wed, 11 Nov 2015 07:35:00 GMT, 
Content-Length=55,
x-log-signaturemethod=hmac-sha1, 
Content-MD5=7EF43D0B8F4A807B95E775048C911C72, 
User-Agent=sls-java-sdk-v-0.6.0, 
Content-Type=application/json
}
Body : 
{
    "logstoreName": "test-logstore",
    "ttl": 1,
    "shardCount": 2,
    "autoSplit": true,
    "maxSplitShard": 64
}
```

**Response example:**

```
HTTP/1.1 200 OK
Header:
{
Date=Wed, 11 Nov 2015 07:35:00 GMT, 
Content-Length=0, 
x-log-requestid=5642EFA499248C827B012B39, 
Connection=close, 
Server=nginx/1.6.1
}
```

