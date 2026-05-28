
export default async function handler(req, res) {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).send('缺少url参数，请在代理链接后拼接?url=目标网址');
  }
  try {
    const response = await fetch(targetUrl, {
      headers: {
        // 这里是你之前设置的电脑Chrome UA，用来伪装成电脑访问
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Referer': targetUrl
      },
    });
    let body = await response.text();
    // 自动把页面里的图片、CSS等资源链接转成代理路径，解决跨域加载问题
    const urlObj = new URL(targetUrl);
    const baseDomain = urlObj.origin;
    body = body.replace(/(src|href)=["'](?!http)(\/\/)?([^"']+)["']/g, (match, p1, p2, p3) => {
      const fullUrl = p2 ? `https://${p3}` : `${baseDomain}/${p3}`;
      return `${p1}="https://ui-proxy.vercel.app/api/proxy?url=${encodeURIComponent(fullUrl)}"`;
    });
    // 把目标站的内容类型头原样返回，保证页面渲染正常
    res.setHeader('Content-Type', response.headers.get('content-type') || 'text/html; charset=utf-8');
    res.send(body);
  } catch (err) {
    res.status(500).send('代理出错了：' + err.message);
  }
}
