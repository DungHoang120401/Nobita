// rphimx.js
// power by dabeecao + hcsavn + chatgpt

/**
 * Safe patch for Rofilm API responses.
 * Do NOT modify when HTTP status is in: 400, 404, 500, 304, 307.
 * Otherwise, patch target endpoints:
 *  - /api/app/v1/auth/(register|login): update flags ONLY if result.user exists
 *  - /api/app/v1/user/info: update flags directly under result (create result if missing)
 *
 * Applied changes:
 *  - is_vip = true
 *  - is_verified = true
 *  - vip_expires_at = 253394586000 (far future, in milliseconds)
 *  - coin_balance = 999999
 *
 * Why this approach:
 *  - Avoid breaking login by not creating new "user" block if it doesn't exist in auth responses.
 *  - Keep original JSON structure intact as much as possible.
 *
 * Environment: Surge/Quantumult X/Loon (http-response script)
 */

/**
 * Safely parse a JSON string to object. Returns null if parsing fails.
 * @param {string} text - JSON string from $response.body
 * @returns {any|null} Parsed object or null on failure
 */
function safeParseJson(text) { try { return JSON.parse(text); } catch (e) { return null; } }

/**
 * Safely stringify an object to JSON. Falls back to original body on failure.
 * @param {object} obj - Object to stringify
 * @returns {string} JSON string
 */
function toJson(obj) { try { return JSON.stringify(obj); } catch (e) { return $response.body || ''; } }

(function main() {
  // Read current HTTP status from the environment
  const statusCode = typeof $response === 'object' && $response && typeof $response.status === 'number'
    ? $response.status
    : 0;

  // Do not patch when status is 400, 404, 500, 304, 307
  const blockedStatuses = new Set([400, 404, 500, 304, 307]);
  if (blockedStatuses.has(statusCode)) {
    return $done({ body: $response && $response.body ? $response.body : '' });
  }

  // Grab URL and body text
  const requestUrl = typeof $request === 'object' && $request && $request.url ? $request.url : '';
  const bodyText = typeof $response === 'object' && $response && $response.body ? $response.body : '';

  // Parse JSON safely
  const data = safeParseJson(bodyText);
  if (!data || typeof data !== 'object') {
    // If not valid JSON, return unchanged to avoid breaking anything
    return $done({ body: bodyText });
  }

  // Regex matchers for endpoints (case-insensitive, allow query strings)
  const authRegex = /^https?:\/\/api\.rofilm\.net\/api\/app\/v1\/auth\/(?:register|login)(?:\?.*)?$/i;
  const infoRegex = /^https?:\/\/api\.rofilm\.net\/api\/app\/v1\/user\/info(?:\?.*)?$/i;

  // Constants
  const FAR_FUTURE_VIP_MS = 253394586000; // far future VIP expiration in milliseconds
  const COIN_BALANCE_VALUE = 999999;      // desired coin balance

  // Branch by endpoint
  if (authRegex.test(requestUrl)) {
    // For auth endpoints, only modify if result.user exists to avoid breaking login/token flows
    if (data.result && typeof data.result === 'object' && data.result.user && typeof data.result.user === 'object') {
      data.result.user.is_vip = true;
      data.result.user.is_verified = true;
      data.result.user.vip_expires_at = FAR_FUTURE_VIP_MS;
      data.result.user.coin_balance = COIN_BALANCE_VALUE;
    }
    return $done({ body: toJson(data) });
  }

  if (infoRegex.test(requestUrl)) {
    // For user/info, ensure result exists and patch directly
    if (!data.result || typeof data.result !== 'object') {
      data.result = {};
    }
    data.result.is_vip = true;
    data.result.is_verified = true;
    data.result.vip_expires_at = FAR_FUTURE_VIP_MS;
    data.result.coin_balance = COIN_BALANCE_VALUE;
    return $done({ body: toJson(data) });
  }

  // If URL doesn't match target endpoints, leave body unchanged
  return $done({ body: bodyText });
})();
