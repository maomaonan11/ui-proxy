exports.handler = async (event) => {
  const targetUrl = event.queryStringParameters?.url;
  if (!targetUrl) {
    return { statusCode: 400, body: "缺少url参数" };
  }
  try {
    const res = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      },
      redirect: "follow"
    });

    const contentType = res.headers.get("content-type") || "text/html";
    const content = await res.arrayBuffer();

    return {
      statusCode: res.status,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*"
      },
      body: Buffer.from(content).toString("base64"),
      isBase64Encoded: true
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: "代理出错：" + err.message
    };
  }
};
