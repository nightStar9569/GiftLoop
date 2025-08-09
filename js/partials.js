document.addEventListener("DOMContentLoaded", () => {
  // Check if we're running on file:// protocol (which causes CORS issues)
  if (window.location.protocol === 'file:') {
    console.error('CORS Error: This page is running on file:// protocol. Please serve the files through a web server.');
    document.querySelectorAll("[data-include]").forEach((el) => {
      const file = el.getAttribute("data-include");
      el.innerHTML = `
        <div style="padding: 20px; border: 2px dashed #e91e63; background: #fff7fb; color: #e91e63; margin: 10px 0;">
          <strong>CORS Error: Cannot load ${file}</strong><br>
          <small>
            This error occurs because you're opening the HTML file directly in the browser.<br>
            <strong>Solution:</strong> Please serve the files through a web server:<br>
            • Python: <code>python -m http.server 8000</code><br>
            • Node.js: <code>npx http-server</code><br>
            • Then open: <code>http://localhost:8000</code>
          </small>
        </div>
      `;
    });
    return;
  }

  document.querySelectorAll("[data-include]").forEach(async (el) => {
    const file = el.getAttribute("data-include");
    
    try {
      const resp = await fetch(file);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}: Failed to load ${file}`);
      el.innerHTML = await resp.text();
    } catch (error) {
      console.error('Error loading partial:', file, error);
      el.innerHTML = `
        <div style="padding: 10px; border: 1px dashed #e91e63; background: #fff7fb; color: #e91e63; margin: 10px 0;">
          <strong>Failed to load partial: ${file}</strong><br>
          <small>Error: ${error.message}</small>
        </div>
      `;
    }
  });
});