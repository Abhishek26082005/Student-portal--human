// Simple front-end demo (no build tools) - student style
// Note: In real project use React CRA/Vite. This is kept simple to run quickly.
const io = window.io || null;

(function() {
  // try to load socket.io client from CDN if not bundled
  function loadScript(url, cb) {
    const s = document.createElement('script');
    s.src = url;
    s.onload = cb;
    document.head.appendChild(s);
  }

  function startApp() {
    const socket = io('http://localhost:4000');
    const root = document.getElementById('root');

    root.innerHTML = `
      <h2>Faculty-Student Portal — Chat Demo (student build)</h2>
      <div>
        <label>Course ID: <input id="courseId" value="1" /></label>
        <button id="joinBtn">Join</button>
      </div>
      <div id="chat" style="border:1px solid #ddd; padding:8px; margin-top:8px; height:200px; overflow:auto"></div>
      <input id="msg" placeholder="Type message..." style="width:70%" />
      <button id="sendBtn">Send</button>
      <p style="color:gray; font-size:12px">Note: this is a simple demo. improvements pending.</p>
    `;

    const chat = document.getElementById('chat');
    document.getElementById('joinBtn').onclick = () => {
      const courseId = document.getElementById('courseId').value || 1;
      socket.emit('joinCourse', courseId);
    };
    socket.on('chatHistory', (msgs) => {
      chat.innerHTML = msgs.map(m => `<div><b>${m.sender}</b>: ${m.content}</div>`).join('');
    });
    socket.on('newMessage', (m) => {
      chat.innerHTML += `<div><b>${m.sender}</b>: ${m.content}</div>`;
      chat.scrollTop = chat.scrollHeight;
    });

    document.getElementById('sendBtn').onclick = () => {
      const courseId = document.getElementById('courseId').value || 1;
      const content = document.getElementById('msg').value;
      if (!content) return alert('Please type message');
      socket.emit('sendMessage', { courseId, sender: 'Student_abc', content });
      document.getElementById('msg').value = '';
    };
  }

  // load socket.io client CDN then start
  loadScript('https://cdn.socket.io/4.7.2/socket.io.min.js', () => {
    window.io = window.io || io;
    startApp();
  });
})();
