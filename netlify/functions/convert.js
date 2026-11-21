const { Resvg } = require('@resvg/resvg-js');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Gunakan method POST' };
  }

  // --- CEK PASSWORD / API KEY ---
  const secretKey = process.env.API_SECRET;
  const authHeader = event.headers['x-api-key'] || event.headers['X-Api-Key'];

  if (authHeader !== secretKey) {
    return { statusCode: 401, body: 'Unauthorized: Password salah' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    if (!body.svg) {
      return { statusCode: 400, body: 'Field svg kosong' };
    }

    const resvg = new Resvg(body.svg, {
      fitTo: { mode: 'width', value: 4000 },
      background: 'rgba(0, 0, 0, 0)'
    });

    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'image/png' },
      body: pngBuffer.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (err) {
    return { statusCode: 500, body: err.message };
  }
};
