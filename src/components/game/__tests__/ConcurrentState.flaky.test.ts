import { describe, test, expect } from 'vitest';

let sharedCounter = 0;

describe('INTENTIONALLY FLAKY: Concurrent shared state', () => {
  test.concurrent('increment A', async () => {
    const before = sharedCounter;
    await new Promise(res => setTimeout(res, Math.floor(Math.random()*10)));
    sharedCounter = before + 1;
    expect(sharedCounter).toBe(before + 1);
  });

  test.concurrent('increment B', async () => {
    const before = sharedCounter;
    await new Promise(res => setTimeout(res, Math.floor(Math.random()*10)));
    sharedCounter = before + 1;
    expect(sharedCounter).toBe(before + 1);
  });

  test.concurrent('increment C', async () => {
    const before = sharedCounter;
    await new Promise(res => setTimeout(res, Math.floor(Math.random()*10)));
    sharedCounter = before + 1;
    expect(sharedCounter).toBe(before + 1);
  });
});
