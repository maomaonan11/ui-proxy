exports.handler = async (event) => {
  const targetUrl = event.queryStringParameters?.url;
  if (!targetUrl) {
    return { statusCode: 400, body: "缺少url参数" };
  }
  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": new URL(targetUrl).origin,
      },
      ignoreURI: true,
      credentials: "omit"
    });
    const body = await response.text();
    return {
      statusCode: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") || "text/html",
        "Access-Control-Allow-Origin": "*"
      },
      body: body
    };
  } catch (err) {
    return { statusCode: 500, body: "代理出错：" + err.message };
  }
};
