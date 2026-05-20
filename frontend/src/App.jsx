import React, { useState, useEffect } from 'react';
import { auth, signInWithGoogle } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [useCloud, setUseCloud] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('http://localhost:8000/upload', { method: 'POST', body: formData });
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('message', input);
      formData.append('use_cloud', useCloud ? 'true' : 'false');
      const res = await fetch('http://localhost:8000/chat', { method: 'POST', body: formData });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'bot', content: data.response }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'bot', content: 'Error: Backend dead.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleShortcut = async (task) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('task', task);
      formData.append('use_cloud', useCloud ? 'true' : 'false');
      const res = await fetch('http://localhost:8000/shortcut', { method: 'POST', body: formData });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'bot', content: data.response }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'bot', content: 'Shortcut failed.' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'serif' }}>
        <h1>BYOC (Badly Yielded Old Code)</h1>
        <p>Login to my masterpiece.</p>
        <button onClick={signInWithGoogle} style={{ padding: '10px 20px', fontSize: '20px' }}>
          LOGIN WITH GOOGLE
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'serif', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <div style={{ border: '5px solid red', padding: '10px', backgroundColor: 'white' }}>
        <h2>Welcome, {user.displayName} (Design is my passion)</h2>
        <button onClick={() => signOut(auth)}>LOGOUT</button>
      </div>

      <div style={{ display: 'flex', marginTop: '20px' }}>
        <div style={{ width: '200px', border: '2px dashed blue', padding: '10px', marginRight: '20px' }}>
          <h3>TOOLS</h3>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <button onClick={handleUpload} style={{ marginTop: '10px', width: '100%' }} disabled={uploading}>
            {uploading ? 'WAIT...' : 'UPLOAD PDF'}
          </button>
          
          {uploading && (
            <div style={{ marginTop: '10px', height: '50px', backgroundColor: '#ccc', animation: 'pulse 1s infinite', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
              INDEXING MAGIC...
            </div>
          )}

          <hr />
          <button onClick={() => handleShortcut('summarize')} style={{ width: '100%', marginBottom: '5px' }}>SUMMARIZE</button>
          <button onClick={() => handleShortcut('quiz')} style={{ width: '100%', marginBottom: '5px' }}>QUIZ ME</button>
          <button onClick={() => handleShortcut('explain')} style={{ width: '100%', marginBottom: '5px' }}>EXPLAIN</button>
          <hr />
          <label>
            <input type="checkbox" checked={useCloud} onChange={(e) => setUseCloud(e.target.checked)} />
            USE CLOUD??
          </label>
        </div>

        <div style={{ flex: 1, border: '2px solid green', padding: '10px', backgroundColor: 'white' }}>
          <h3>CHAT BOX</h3>
          <div style={{ height: '300px', overflowY: 'scroll', border: '1px inset gray', padding: '10px', marginBottom: '10px' }}>
            {uploading && <div style={{ color: 'red', fontWeight: 'bold', marginBottom: '10px' }}>SYSTEM: READING YOUR PDF... DON'T TOUCH ANYTHING!</div>}
            {messages.map((msg, idx) => (
              <div key={idx} style={{ marginBottom: '10px', color: msg.role === 'user' ? 'blue' : 'black' }}>
                <strong>{msg.role.toUpperCase()}:</strong> {msg.content}
              </div>
            ))}
            {loading && <p>Thinking really hard...</p>}
          </div>
          <form onSubmit={handleSendMessage}>
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Type here..." 
              style={{ width: '80%', padding: '5px' }}
            />
            <button type="submit">SEND</button>
          </form>
        </div>
      </div>
      <p style={{ marginTop: '50px', fontSize: '12px' }}>Copyight 2026 - My First Website</p>
    </div>
  );
}

export default App;
