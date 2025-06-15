import './style.css'
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/button/text-button.js';
import '@material/web/ripple/ripple.js';
import '@material/web/icon/icon.js';
import '@material/web/progress/circular-progress.js';
// Snackbar component is not available in @material/web, using custom implementation
import ClipboardJS from 'clipboard';

// Initialize the app with a loading state
document.querySelector('#app').innerHTML = `
  <div class="app-container">
    <header class="app-bar">
      <div class="app-bar-row">
        <section class="app-bar-section app-bar-section--start">
          <md-icon class="app-bar-icon">wifi</md-icon>
          <span class="app-bar-title">IP Quick Check</span>
        </section>
        <section class="app-bar-section app-bar-section--end">
          <md-icon class="app-bar-action-item">language</md-icon>
        </section>
      </div>
    </header>

    <main class="main-content">
      <div class="card ip-card">
        <div class="card-content">
          <h2 class="headline-medium">Your IPv4 Address</h2>
          <div class="ip-display-container">
            <md-circular-progress id="ip-loading" indeterminate aria-label="Loading..."></md-circular-progress>
            <div id="ip-display" class="ip-address body-large" style="display: none;"><span class="ip-text"></span></div>
            <md-filled-button id="copy-button" data-clipboard-target="#ip-display" disabled>
              <md-icon slot="icon">content_copy</md-icon>
              Copy
            </md-filled-button>
          </div>
        </div>
      </div>
    </main>

    <div id="snackbar" class="custom-snackbar">
      <span class="snackbar-message">IP address copied to clipboard!</span>
      <md-text-button id="snackbar-dismiss">Dismiss</md-text-button>
    </div>
  </div>
`;

// Initialize Material Components
const copyButton = document.querySelector('#copy-button');
const snackbarElement = document.querySelector('#snackbar');
const snackbarDismissButton = document.querySelector('#snackbar-dismiss');

// Custom snackbar implementation
function showSnackbar() {
  snackbarElement.classList.add('show');
  setTimeout(() => {
    if (snackbarElement.classList.contains('show')) {
      snackbarElement.classList.remove('show');
    }
  }, 5000); // Auto-hide after 5 seconds
}

// Add event listener to dismiss button
snackbarDismissButton.addEventListener('click', () => {
  snackbarElement.classList.remove('show');
});

// Initialize Clipboard.js
const clipboard = new ClipboardJS('#copy-button');
clipboard.on('success', function(e) {
  showSnackbar();
  e.clearSelection();
});

// Function to fetch with timeout
function fetchWithTimeout(url, options = {}, timeout = 5000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
}

// Function to get the user's IPv4 address with multiple fallback services
async function getIPAddress() {
  // Array of IP API services to try in order
  const ipServices = [
    { url: 'https://api.ipify.org?format=json', parser: data => data.ip },
    { url: 'https://api.ip.sb/jsonip', parser: data => data.ip },
    { url: 'https://api.myip.com', parser: data => data.ip },
    { url: 'https://ipinfo.io/json', parser: data => data.ip },
    { url: 'https://api64.ipify.org?format=json', parser: data => data.ip } // IPv6 fallback
  ];

  const ipDisplay = document.querySelector('#ip-display');

  // Try each service until one succeeds
  for (const service of ipServices) {
    try {
      console.log(`Trying to fetch IP from ${service.url}`);
      const response = await fetchWithTimeout(service.url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const ip = service.parser(data);

      // Display the IP address
      ipDisplay.querySelector('.ip-text').textContent = ip;

      // Hide loading indicator and enable copy button
      document.querySelector('#ip-loading').style.display = 'none';
      ipDisplay.style.display = 'block';
      copyButton.disabled = false;

      console.log(`Successfully fetched IP from ${service.url}: ${ip}`);
      return; // Exit the function if successful
    } catch (error) {
      console.error(`Error fetching IP from ${service.url}:`, error.message);
      // Continue to the next service
    }
  }

  // If all services fail, show error message with retry button
  ipDisplay.querySelector('.ip-text').innerHTML = `
    Error fetching IP address. 
    <md-outlined-button id="retry-button">
      <md-icon slot="icon">refresh</md-icon>
      Retry
    </md-outlined-button>
  `;
  ipDisplay.style.display = 'block';
  document.querySelector('#ip-loading').style.display = 'none';

  // Initialize retry button
  const retryButton = document.querySelector('#retry-button');
  retryButton.addEventListener('click', () => {
    // Reset display
    ipDisplay.querySelector('.ip-text').textContent = '';
    ipDisplay.style.display = 'none';
    document.querySelector('#ip-loading').style.display = 'block';
    copyButton.disabled = true;

    // Try again
    getIPAddress();
  });
}

// Get the IP address when the page loads
window.addEventListener('load', getIPAddress);
