console.log('Script started');

function handleError() {
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: Arial; max-width: 800px; margin: 0 auto;">
      <h1 style="color: #e53e3e;">Error Detected!</h1>
      <p>An error occurred while loading the application. Here's what you can try:</p>
      
      <ol>
        <li>Check the browser console for error details</li>
        <li>Try clearing your browser cache</li>
        <li>Verify your Supabase connection</li>
        <li>Check your environment variables</li>
      </ol>
      
      <div style="margin-top: 20px;">
        <button onclick="location.reload()" style="padding: 10px 15px; background: #3182ce; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Reload Page
        </button>
      </div>
    </div>
  `;
}

window.addEventListener('error', function(event) {
  console.error('Global error caught:', event.error);
  handleError();
});

// Inject diagnostic HTML immediately
document.addEventListener('DOMContentLoaded', function() {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="padding: 20px; font-family: Arial;">
        <h1>Testing Ride Rental App Loading...</h1>
        <p>This diagnostic message should be replaced by React.</p>
        <p>If you continue to see this message, React is failing to initialize.</p>
        <div id="diagnostics" style="margin-top: 20px; padding: 15px; background: #f0f0f0; border-radius: 6px;">
          <p>Running diagnostics...</p>
        </div>
      </div>
    `;
  }
});

// Try to load React after a delay to see if the diagnostic message gets replaced
setTimeout(() => {
  const diagElement = document.getElementById('diagnostics');
  if (diagElement) {
    diagElement.innerHTML += `<p>React initialization may have failed. The diagnostic message is still visible.</p>`;
  }
}, 3000);

// Import the actual entry point
import './main.tsx';
