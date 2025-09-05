// functions/delete-image.js
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const ALLOWED_FOLDER = process.env.CLOUDINARY_ALLOWED_FOLDER || '';
exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
    try {
        const body = JSON.parse(event.body || '{}');
        const public_id = body.public_id;
        if (!public_id) return { statusCode: 400, body: JSON.stringify({ error: 'missing public_id' }) };
        if (ALLOWED_FOLDER && !public_id.startsWith(ALLOWED_FOLDER + '/')) {
            return { statusCode: 403, body: JSON.stringify({ error: 'deletion outside allowed folder is forbidden' }) };
        }
        const result = await cloudinary.uploader.destroy(public_id, { resource_type: 'image', invalidate: true });
        return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(result) };
    } catch (err) {
        console.error('delete-image error', err);
        return { statusCode: 500, body: JSON.stringify({ error: err.message || String(err) }) };
    }
};
