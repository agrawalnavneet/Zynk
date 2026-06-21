const { sendBookingToCrm } = require('./crmService');

/**
 * Dispatches a new booking to all registered third-party integrations.
 * Each integration is called independently so one failure doesn't block others.
 * Returns a promise that resolves when all integrations have been attempted.
 */
async function notifyIntegrationsOnBooking(booking) {
  const integrations = [
    { name: 'CRM', fn: () => sendBookingToCrm(booking) },
    // Add future integrations here, e.g.:
    // { name: 'Analytics', fn: () => sendBookingToAnalytics(booking) },
  ];

  await Promise.allSettled(
    integrations.map(({ name, fn }) =>
      fn().catch((err) => {
        console.error(`[Integration:${name}] Failed to sync booking ${booking._id}:`, err.message);
      })
    )
  );
}

module.exports = { notifyIntegrationsOnBooking };
