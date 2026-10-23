CREATE TABLE default.central_logs
(
    -- Timestamp & Metadata
    `@timestamp` DateTime64(3, 'UTC') CODEC(DoubleDelta, ZSTD(1)),
    `tenant` LowCardinality(String),
    `source` LowCardinality(String),
    `vendor` LowCardinality(String),
    `product` LowCardinality(String),
    
    -- Event Classification
    `event_type` LowCardinality(String),
    `event_subtype` LowCardinality(String),
    `severity` UInt8,
    `action` LowCardinality(String),
    
    -- Network & Connection
    `src_ip` IPv4,
    `src_port` UInt16,
    `dst_ip` IPv4,
    `dst_port` UInt16,
    `protocol` LowCardinality(String),
    
    -- Context & Assets
    `user` String,
    `host` String,
    `process` String,
    `url` String,
    `http_method` LowCardinality(String),
    `status_code` UInt16,
    
    -- Rules & Alerts
    `rule_name` String,
    `rule_id` String,
    
    -- Cloud Attributes (แปลงจาก Object ให้เป็น Column แยก หรือใช้ Tuple)
    `cloud_account_id` String,
    `cloud_region` LowCardinality(String),
    `cloud_service` LowCardinality(String),
    
    -- Raw & Tags
    `raw` String CODEC(ZSTD(3)),
    `_tags` Array(String)
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(`@timestamp`)
ORDER BY (tenant, source, event_type, `@timestamp`)
SETTINGS index_granularity = 8192;