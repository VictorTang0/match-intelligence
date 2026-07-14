export async function onRequest(context) {
  const targetUrl = "https://webapi.sporttery.cn/gateway/uniform/football/getMatchCalculatorV1.qry?channel=c";
  
  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://m.sporttery.cn/',
        'Accept': 'application/json, text/javascript, */*; q=0.01'
      }
    });
    
    if (!response.ok) {
      return new Response(JSON.stringify({ error: `Backend returned status ${response.status}` }), {
        status: response.status,
        headers: {
          "content-type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    
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
      headers: {
        "content-type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
