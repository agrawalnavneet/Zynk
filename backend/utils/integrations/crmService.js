const https = require('https');
const http = require('http');
const { URL } = require('url');

const CRM_BASE_URL = process.env.CRM_BASE_URL;
const CRM_API_KEY = process.env.CRM_API_KEY;

/**
 * Maps a saved booking document (with populated user and service) to the CRM payload shape.
 */
function buildCrmPayload(booking) {
  const address = [booking.PgName, booking.RoomNo, booking.Landmark]
    .filter(Boolean)
    .join(', ');

  return {
    branch: 'jalandhar',
    user_name: booking.user?.name ?? '',
    user_id: booking.user?._id?.toString() ?? '',
    user_phone: booking.user?.phone ?? '',
    address,
    live_location_url: '',
    house_helper_name: '',
    booking_via: 'app',
    booking_created_date_and_time: booking.createdAt?.toISOString() ?? new Date().toISOString(),
    package_name: booking.service?.name ?? '',
    payment_method: 'online',
    payment_amount: booking.totalPrice ?? 0,
    payment_status: booking.paymentStatus ?? 'pending',
  };
}

/**
 * POSTs the booking to the CRM API.
 * Returns a promise that resolves with the response body string.
 */
function sendBookingToCrm(booking) {
  return new Promise((resolve, reject) => {
    if (!CRM_BASE_URL || !CRM_API_KEY) {
      return reject(new Error('CRM_BASE_URL or CRM_API_KEY is not configured'));
    }

    const payload = buildCrmPayload(booking);
    const body = JSON.stringify(payload);

    const endpoint = new URL('/api/v1/bookings', CRM_BASE_URL);
    const isHttps = endpoint.protocol === 'https:';
    const lib = isHttps ? https : http;

    const options = {
      hostname: endpoint.hostname,
      port: endpoint.port || (isHttps ? 443 : 80),
      path: endpoint.pathname,
      method: 'POST',
      headers: {
        'accept': '*/*',
        'x-api-key': CRM_API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = lib.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`CRM responded with ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

module.exports = { sendBookingToCrm };
