export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // GitHub repository base URL for raw files
    const githubBase = "https://raw.githubusercontent.com/VictorTang0/match-intelligence/main";
    
    // 1. API proxy route for today's matches calculator
    if (pathname === "/api/getMatchCalculatorV1") {
      const targetUrl = "https://webapi.sporttery.cn/gateway/uniform/football/getMatchCalculatorV1.qry?channel=c";
      try {
        const response = await fetch(targetUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://m.sporttery.cn/',
            'Accept': 'application/json, text/javascript, */*; q=0.01'
          }
        });
        const text = await response.text();
        return new Response(text, {
          headers: {
            "content-type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*"
          }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.toString() }), {
          status: 500,
          headers: { "content-type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }
    }
    
    // 2. API proxy route for match results
    if (pathname === "/api/getMatchResultV1") {
      const targetUrl = "https://webapi.sporttery.cn/gateway/jc/zq/getMatchResultV1.qry?matchPage=1&matchType=1";
      try {
        const response = await fetch(targetUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://m.sporttery.cn/',
            'Accept': 'application/json, text/javascript, */*; q=0.01'
          }
        });
        const text = await response.text();
        return new Response(text, {
          headers: {
            "content-type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*"
          }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.toString() }), {
          status: 500,
          headers: { "content-type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }
    }
    
    // 3. Static assets proxy routes (fetch from raw GitHub with cache bypass)
    let assetUrl = "";
    let contentType = "text/html; charset=utf-8";
    
    if (pathname === "/" || pathname === "/index.html") {
      assetUrl = `${githubBase}/index.html`;
      contentType = "text/html; charset=utf-8";
    } else if (pathname === "/style.css") {
      assetUrl = `${githubBase}/style.css`;
      contentType = "text/css";
    } else if (pathname === "/app.js") {
      assetUrl = `${githubBase}/app.js`;
      contentType = "application/javascript; charset=utf-8";
    } else if (pathname === "/model.js") {
      assetUrl = `${githubBase}/model.js`;
      contentType = "application/javascript; charset=utf-8";
    } else {
      return new Response("Not Found", { status: 404 });
    }
    
    try {
      // Append a cache-busting timestamp to raw GitHub requests to get updates instantly
      const response = await fetch(`${assetUrl}?t=${Date.now()}`);
      if (!response.ok) {
        return new Response(`Failed to load asset from GitHub: ${response.statusText}`, { status: response.status });
      }
      const text = await response.text();
      return new Response(text, {
        headers: {
          "content-type": contentType,
          "Cache-Control": "no-cache, no-store, must-revalidate"
        }
      });
    } catch (e) {
      return new Response(`Error loading asset: ${e.toString()}`, { status: 500 });
    }
  }
};
