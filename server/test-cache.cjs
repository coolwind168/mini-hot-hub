const http = require('http');

async function testCache() {
  console.log('=== 缓存测试开始 ===\n');
  
  // 第1次请求 - 应该是 cache miss
  console.log('第1次请求 (预期: cache miss):');
  const r1 = await request('/api/hot/dongfangcaifu');
  console.log(`状态: ${r1.status}, updatedAt: ${r1.data.updatedAt}\n`);

  // 第2次请求 - 应该是 cache hit
  console.log('第2次请求 (预期: cache hit):');
  const r2 = await request('/api/hot/dongfangcaifu');
  console.log(`状态: ${r2.status}, updatedAt: ${r2.data.updatedAt}\n`);

  // 第3次请求 - 强制刷新，应该是 cache miss
  console.log('第3次请求 ?refresh=1 (预期: cache miss):');
  const r3 = await request('/api/hot/dongfangcaifu?refresh=1');
  console.log(`状态: ${r3.status}, updatedAt: ${r3.data.updatedAt}\n`);

  console.log('=== 缓存测试完成 ===');
  console.log('\n验证结果:');
  console.log(`✓ 第1次与第2次 updatedAt 相同: ${r1.data.updatedAt === r2.data.updatedAt}`);
  console.log(`✓ 第3次 updatedAt 不同 (强制刷新): ${r1.data.updatedAt !== r3.data.updatedAt}`);
}

function request(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, 'http://localhost:3001');
    http.get(url.href, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, data: JSON.parse(data) });
      });
    }).on('error', reject);
  });
}

testCache().catch(console.error);