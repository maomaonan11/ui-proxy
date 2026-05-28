
export default async function handler(req, res) {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send('缺少url参数');
  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Referer': new URL(targetUrl).origin,
      },
      ignoreURI: true,
      credentials: 'omit'
    });
    const body = await response.text();
    res.setHeader('Content-Type', response.headers.get('content-type'));
    res.send(body);
  } catch (err) {
    res.status(500).send('代理出错：' + err.message);
  }
}
