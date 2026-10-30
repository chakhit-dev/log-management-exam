import { clickhouse } from '@/lib/clickhouse';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { status: 'error', message: 'No file uploaded.' },
        { status: 400 }
      );
    }

    const textContent = await file.text();
    let logs: any[];

    try {
      logs = JSON.parse(textContent);
    } catch (e) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid JSON file format.' },
        { status: 400 }
      );
    }

    if (!Array.isArray(logs)) {
      return NextResponse.json(
        { status: 'error', message: 'JSON root structure must be an array.' },
        { status: 400 }
      );
    }

    const rows = logs.map((item) => {
      let timestamp = item['@timestamp'];
      if (timestamp) {
        timestamp = timestamp.replace('Z', '.000Z');
      }

      const cloud = item.cloud || {};
      const rawVal = item.raw ? JSON.stringify(item.raw) : null;
      const ipAddress = item.src_ip || item.ip || null;

      return {
        timestamp: timestamp || new Date().toISOString(),
        tenant: item.tenant || 'default',
        source: item.source || 'unknown',
        event_type: item.event_type || 'unknown',
        event_id: item.event_id ?? null,
        user: item.user ?? null,
        src_ip: ipAddress, // ใช้ตัวแปรที่ดึงค่าจาก ip หรือ src_ip
        host: item.host ?? null,
        status: item.status ?? null,
        workload: item.workload ?? null,
        cloud_service: cloud.service ?? null,
        cloud_account_id: cloud.account_id ?? null,
        cloud_region: cloud.region ?? null,
        logon_type: item.logon_type ?? null,
        raw: rawVal,
      };
    });

    await clickhouse.insert({
      table: 'log_manage_db.central_logs',
      values: rows,
      format: 'JSONEachRow',
    });

    return NextResponse.json(
      {
        status: 'success',
        filename: file.name,
        message: `Successfully processed and ingested ${rows.length} logs.`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}