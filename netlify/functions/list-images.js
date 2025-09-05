// netlify/functions/list-images.js
// Uses native fetch (Node 18+), no external deps.

exports.handler = async function(event) {
  const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
  const API_KEY = process.env.CLOUDINARY_API_KEY;
  const API_SECRET = process.env.CLOUDINARY_API_SECRET;
  const FOLDER = process.env.CLOUDINARY_FOLDER || ''; // e.g., "gallery"

  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing Cloudinary env vars on Netlify' }),
    };
  }

  try {
    // Cloudinary Admin API requires `type`. We use type=upload and optionally prefix for folder.
    const prefixParam = FOLDER ? `&prefix=${encodeURIComponent(FOLDER)}` : '';
    const max_results = 500;
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image?type=upload&max_results=${max_results}${prefixParam}`;

    const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');

    const res = await fetch(url, {
      headers: { Authorization: `Basic ${auth}` },
    });

    if (!res.ok) {
      const text = await res.text();
      // return the Cloudinary error body so client can see details
      return { statusCode: res.status, body: text };
    }

    const json = await res.json();
    const items = (json.resources || []).map(r => ({
      public_id: r.public_id,
      secure_url: r.secure_url,
      width: r.width,
      height: r.height,
      format: r.format,
      created_at: r.created_at
    }));

    items.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

    return {
      statusCode: 200,
      body: JSON.stringify({ images: items }),
    };
  } catch (err) {
    console.error('Function error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || String(err) }),
    };
  }
};
