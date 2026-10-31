backup sql
BACKUP TABLE log_manage_db.central_logs TO File('central_logs_20261031.zip');

copy file
docker cp clickhouse_db:/var/lib/clickhouse/backups/central_logs_20261031.zip /Users/faraday/Git/GitHub/log-management-exam/backups/