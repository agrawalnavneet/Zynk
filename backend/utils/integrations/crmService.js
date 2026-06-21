const https = require('https');
const http = require('http');
const { URL } = require('url');
const User = require('../../models/User');

const LOG_PREFIX = '[Integration:CRM]';

function log(msg, data) {
  const ts = new Date().toISOString();
  if (data !== undefined) {
    console.log(`${ts} ${LOG_PREFIX} ${msg}`, data);
  } else {
    console.log(`${ts} ${LOG_PREFIX} ${msg}`);
  }
}

function logError(msg, err) {
  const ts = new Date().toISOString();
  console.error(`${ts} ${LOG_PREFIX} ${msg}`, err);
}

/**
 * Maps a saved booking document (with populated user and service) to the CRM payload shape.
 */
function buildCrmPayload(booking, userPhone) {
  const address = [booking.PgName, booking.RoomNo, booking.Landmark]
    .filter(Boolean)
    .join(', ');

  return {
    branch: 'jalandhar',
    user_name: booking.user?.name ?? '',
    user_id: booking.user?._id?.toString() ?? '',
    user_phone: userPhone || 'N/A',
    address,
    // live_location_url: 'N/A',
    // house_helper_name: 'N/A',
    booking_via: 'Website',
    booking_created_date_and_time: booking.createdAt?.toISOString() ?? new Date().toISOString(),
    package_name: booking.service?.name ?? '',
    payment_method: 'online',
    payment_amount: booking.totalPrice ?? 0,
    payment_status: booking.paymentStatus ?? 'pending',
  };
}

/**
 * POSTs the booking to the CRM API.
 */
async function sendBookingToCrm(booking) {
  // Resolve phone: use populated user.phone, else look up by user ID
  let userPhone = booking.user?.phone;
  if (!userPhone) {
    const userId = booking.user?._id ?? booking.user;
    if (userId) {
      try {
        const user = await User.findById(userId).select('phone').lean();
        userPhone = user?.phone;
      } catch (e) {
        logError('Failed to fetch user phone for booking', e.message);
      }
    }
  }

  return new Promise((resolve, reject) => {
    // Read env vars lazily so dotenv has always run before this point
    const crmBaseUrl = process.env.CRM_BASE_URL;
    const crmApiKey = process.env.CRM_API_KEY;

    log(`Attempting to sync booking ${booking._id}`);
    log('Env check', {
      CRM_BASE_URL: crmBaseUrl ? `${crmBaseUrl}` : 'MISSING',
      CRM_API_KEY: crmApiKey ? `${crmApiKey.slice(0, 8)}...` : 'MISSING',
    });

    if (!crmBaseUrl || !crmApiKey) {
      const err = new Error(
        `CRM_BASE_URL or CRM_API_KEY is not configured. ` +
        `CRM_BASE_URL=${crmBaseUrl ?? 'undefined'}, CRM_API_KEY=${crmApiKey ? 'set' : 'undefined'}`
      );
      logError('Configuration error', err.message);
      return reject(err);
    }

    const payload = buildCrmPayload(booking, userPhone);
    const body = JSON.stringify(payload);

    log('Payload built', payload);

    let endpoint;
    try {
      endpoint = new URL('/api/v1/bookings', crmBaseUrl);
    } catch (e) {
      logError('Invalid CRM_BASE_URL', e.message);
      return reject(new Error(`Invalid CRM_BASE_URL "${crmBaseUrl}": ${e.message}`));
    }

    const isHttps = endpoint.protocol === 'https:';
    const lib = isHttps ? https : http;

    const options = {
      hostname: endpoint.hostname,
      port: endpoint.port || (isHttps ? 443 : 80),
      path: endpoint.pathname,
      method: 'POST',
      headers: {
        accept: '*/*',
        'x-api-key': crmApiKey,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    log(`Sending POST to ${endpoint.href}`);

    const req = lib.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        log(`Response status: ${res.statusCode}`);
        log('Response body:', data);

        if (res.statusCode >= 200 && res.statusCode < 300) {
          log(`Booking ${booking._id} synced successfully`);
          resolve(data);
        } else {
          const err = new Error(`CRM responded with ${res.statusCode}: ${data}`);
          logError('Non-2xx response', err.message);
          reject(err);
        }
      });
    });

    req.on('error', (err) => {
      logError('Network error', err.message);
      reject(err);
    });

    req.setTimeout(10000, () => {
      logError('Request timed out after 10s', '');
      req.destroy(new Error('CRM request timed out'));
    });

    req.write(body);
    req.end();
  });
}

module.exports = { sendBookingToCrm };
