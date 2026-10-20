import { strict as assert } from 'node:assert';
import { describe, it } from 'vitest';
import { createApp } from '../src/app';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function request(
  method: string,
  path: string,
  options: { headers?: Record<string, string>; body?: string } = {},
) {
  const server = createApp().listen(0);

  try {
    await new Promise<void>((resolve) => server.once('listening', resolve));
    const address = server.address();
    if (!address || typeof address === 'string') {
      throw new Error('Unable to determine test server address');
    }

    const response = await fetch(`http://127.0.0.1:${address.port}${path}`, {
      method,
      headers: options.headers,
      body: options.body,
    });
    const text = await response.text();
    let body: Record<string, unknown> = {};
    try {
      const parsed: unknown = JSON.parse(text);
      if (isRecord(parsed)) {
        body = parsed;
      }
    } catch {
      // Keep status-only assertions usable for non-JSON responses.
    }

    return { status: response.status, body };
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

describe('GET /api/health', () => {
  it('trả về 200 và status ok', async () => {
    const res = await request('GET', '/api/health');

    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'ok');
    assert.equal(typeof res.body.uptime, 'number');
    assert.equal(typeof res.body.timestamp, 'string');
  });

  it('route không tồn tại trả về 404 dạng JSON', async () => {
    const res = await request('GET', '/api/khong-ton-tai');

    assert.equal(res.status, 404);
    const error = res.body.error;
    assert.ok(isRecord(error));
    assert.equal(error.code, 'NOT_FOUND');
  });

  it('JSON sai cú pháp trả về 400, không phải 500', async () => {
    const res = await request('POST', '/api/health', {
      headers: { 'Content-Type': 'application/json' },
      body: '{ invalid json',
    });

    assert.equal(res.status, 400);
  });
});
