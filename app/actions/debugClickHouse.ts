
"use server";

import { clickhouse } from "@/lib/clickhouse";

export async function debugClickHouse() {
  const result = await clickhouse.query({
    query: `
      SELECT
        currentDatabase() AS database_name,
        currentUser() AS username,
        count() AS total_logs,
        max(\`@timestamp\`) AS latest_log
      FROM central_logs
    `,
    format: "JSONEachRow",
  });

  const rows = await result.json();

  console.log("ClickHouse connection check:", rows);

  return rows;
}
