// Only show the site when it is served over http(s), not opened as a file.
if (location.protocol === 'file:') {
  window.stop()
  document.documentElement.innerHTML = `
    <head><meta charset="UTF-8"><title>Start the server</title></head>
    <body style="font-family:system-ui,sans-serif;max-width:34rem;margin:15vh auto;padding:0 1.5rem;line-height:1.6;color:#111">
      <h1 style="font-size:1.6rem">This site needs a server</h1>
      <p>It can’t be opened as a file. Start a local server, then open the address it shows.</p>
      <p><strong>Terminal:</strong> <code>python3 -m http.server 8000</code> in this folder, then visit <code>http://localhost:8000</code></p>
      <p><strong>VS Code:</strong> right-click <code>index.html</code> → Open with Live Server</p>
    </body>`
}
