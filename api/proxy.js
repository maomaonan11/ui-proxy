export default async function handler(req, res) {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send('Missing url parameter');
  try {
    const response = await fetch(targetUrl, { headers: { 'User-Agent': req.headers['user-agent'] } });
    const data = await response.arrayBuffer();
    res.setHeader('Content-Type', response.headers.get('content-type'));
    res.send(Buffer.from(data));
  } catch (e) {
    res.status(500).send('Proxy error');
  }
}
