CREATE TABLE log_manage_db.central_logs
(
    `@timestamp` DateTime64(3, 'UTC') CODEC(DoubleDelta, ZSTD(1)),
    `tenant` LowCardinality(String),
    `source` LowCardinality(String),
    `vendor` LowCardinality(String),
    `product` LowCardinality(String),
    `event_type` LowCardinality(String),
    `event_subtype` LowCardinality(String),
    `severity` UInt8,
    `action` LowCardinality(String),
    `src_ip` IPv4,
    `src_port` UInt16,
    `dst_ip` IPv4,
    `dst_port` UInt16,
    `protocol` LowCardinality(String),
    `user` String,
    `host` String,
    `process` String,
    `url` String,
    `http_method` LowCardinality(String),
    `status_code` UInt16,
    `rule_name` String,
    `rule_id` String,
    `cloud_account_id` String,
    `cloud_region` LowCardinality(String),
    `cloud_service` LowCardinality(String),
    `raw` String CODEC(ZSTD(3)),
    `_tags` Array(String),
    `src_country_code` String, 
    `src_country_name` String, 
    `src_city` String, 
    `src_latitude` Float64, 
    `src_longitude` Float64
)

ENGINE = MergeTree()
PARTITION BY toYYYYMM(`@timestamp`)
ORDER BY (tenant, source, event_type, `@timestamp`)
SETTINGS index_granularity = 8192;