export function isLocalhost() {
  // Get the current URL
  var currentUrl = window.location.href;

  // Create a regular expression to match "localhost" or "127.0.0.1"
  var localhostRegex =
    /^(http:\/\/localhost(:\d+)?|http:\/\/127.0.0.1(:\d+)?|https:\/\/localhost(:\d+)?|https:\/\/127.0.0.1(:\d+)?)\//;

  // Check if the current URL matches the localhost pattern
  return localhostRegex.test(currentUrl);
}
