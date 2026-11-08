import { useEffect, useMemo, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import './index.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_ROOT = `${API}/api`;
const readUser = () => {
  try { return JSON.parse(localStorage.getItem('syncmusic-user') || 'null'); }
  catch { return null; }
};
async function request(path, options = {}) {
  const response = await fetch(`${API_ROOT}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || data.message || `Request failed (${response.status})`);
  return data;
}
function Shell({ children }) {
  return <div className="shell">
    <header><Link className="logo" to="/">♫ sync<span>music</span></Link><small>a little music, a little togetherness ♡</small></header>
    {children}
    <footer>Made for sharing songs & little moments <b>♥</b></footer>
  </div>;
}
function Landing() {
  return <Shell><main className="hero">
    <div className="eyebrow">YOUR SHARED MUSIC SPACE</div>
    <h1>Good music is<br/>better <i>together.</i></h1>
    <p>Create a room, invite your people, and enjoy music while you chat. Simple moments, better memories.</p>
    <div className="actions"><Link className="btn" to="/signup">Get started →</Link><Link className="btn outline" to="/login">I have an account</Link></div>
    <div className="disc">♫<span>♡</span></div>
    <div className="features">♡ Private rooms　　♫ Shared listening　　☁ Live conversations</div>
  </main></Shell>;
}
function Auth({ signup = false }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  async function submit(event) {
    event.preventDefault(); setError(''); setBusy(true);
    try {
      const data = await request(`/auth/${signup ? 'signup' : 'login'}`, {
        method: 'POST',
        body: JSON.stringify({ displayName: name.trim(), email: email.trim().toLowerCase(), password })
      });
      localStorage.setItem('syncmusic-user', JSON.stringify(data.user));
      navigate('/dashboard', { replace: true });
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <Shell><main className="auth"><div className="panel">
    <div className="heart">♡</div><h2>{signup ? 'Create your space' : 'Welcome back'}</h2>
    <p>{signup ? 'A little account for a lot of good music.' : 'Your people and playlists are waiting.'}</p>
    <form onSubmit={submit}>
      {signup && <label>Your name<input value={name} onChange={e => setName(e.target.value)} required minLength={2} maxLength={40} placeholder="What should we call you?"/></label>}
      <label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"/></label>
      <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} placeholder="At least 8 characters"/></label>
      {error && <div className="error">{error}</div>}
      <button className="btn wide" disabled={busy}>{busy ? 'Please wait…' : signup ? 'Create account →' : 'Sign in →'}</button>
    </form>
    <p className="switch">{signup ? 'Already here?' : 'New to SyncMusic?'} <Link to={signup ? '/login' : '/signup'}>{signup ? 'Sign in' : 'Create account'}</Link></p>
  </div></main></Shell>;
}
function Dashboard() {
  const [roomName, setRoomName] = useState('Our little room');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const navigate = useNavigate();
  const currentUser = readUser();
  async function createRoom() {
    setError(''); setBusy('create');
    try {
      const data = await request('/rooms', { method: 'POST', body: JSON.stringify({ name: roomName.trim() || 'Our little room', permission: 'everyone' }) });
      navigate(`/room/${data.room.roomId}`);
    } catch (err) { setError(err.message); }
    finally { setBusy(''); }
  }
  async function joinRoom() {
    const normalized = code.trim().toUpperCase();
    if (!/^[A-Z0-9]{6}$/.test(normalized)) { setError('Enter a valid 6-character room code.'); return; }
    setError(''); setBusy('join');
    try {
      await request(`/rooms/${normalized}`);
      navigate(`/room/${normalized}`);
    } catch (err) { setError(err.message || 'Room not found. Check the code and try again.'); }
    finally { setBusy(''); }
  }
  async function signOut() {
    try { await request('/auth/logout', { method: 'POST' }); } catch {}
    localStorage.removeItem('syncmusic-user');
    navigate('/login', { replace: true });
  }
  return <Shell><main className="dash">
    <div className="eyebrow">YOUR MUSIC CORNER</div>
    <h1>Hey{currentUser?.displayName ? `, ${currentUser.displayName}` : ''} <i>♡</i></h1>
    <p>Who would you like to listen with today?</p>
    <div className="cards">
      <section className="panel"><div className="symbol">♫</div><h2>Create a room</h2><p>Start a listening party and invite your friends with a room code.</p>
        <label>Room name<input value={roomName} onChange={e => setRoomName(e.target.value)} maxLength={60}/></label>
        <button className="btn wide" onClick={createRoom} disabled={!!busy}>{busy === 'create' ? 'Creating…' : 'Create room →'}</button>
      </section>
      <section className="panel second"><div className="symbol">♡</div><h2>Join a room</h2><p>Have a room code? Pop it in and meet everyone there.</p>
        <label>Room code<input value={code} onChange={e => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))} maxLength={6} placeholder="A7K2QX"/></label>
        <button className="btn wide" onClick={joinRoom} disabled={!!busy}>{busy === 'join' ? 'Joining…' : 'Join room →'}</button>
      </section>
    </div>
    {error && <div className="error">{error}</div>}
    <button className="textbtn" onClick={signOut}>Sign out</button>
  </main></Shell>;
}
function TrackCard({ track, onPlay, onAdd, active }) {
  return <div className={`trackrow ${active ? 'track-active' : ''}`}>
    {track.artworkUrl ? <img src={track.artworkUrl} alt="" onError={e => { e.currentTarget.style.visibility = 'hidden'; }}/> : <div className="track-placeholder">♫</div>}
    <div className="trackmeta"><b>{track.title}</b><small>{track.artist || 'Unknown artist'} · {formatDuration(track.duration)}</small></div>
    <button className="mini-btn" onClick={() => onPlay(track)} title="Play now">▶</button>
    <button className="mini-btn secondary-mini" onClick={() => onAdd(track)} title="Add to queue">＋</button>
  </div>;
}
function formatDuration(seconds = 0) {
  const value = Math.max(0, Math.floor(Number(seconds) || 0));
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;
}
function Room() {
  const { roomId } = useParams();
  const currentUser = readUser();
  const [tab, setTab] = useState('music');
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [typing, setTyping] = useState([]);
  const [queue, setQueue] = useState([]);
  const [track, setTrack] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [connection, setConnection] = useState('connecting');
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState('off');
  const historyRef = useRef([]);
  const socketRef = useRef(null);
  const audioRef = useRef(null);
  const queueRef = useRef([]);
  const trackRef = useRef(null);
  const enabledRef = useRef(false);
  const lastSeekSent = useRef(0);
  useEffect(() => { queueRef.current = queue; }, [queue]);
  useEffect(() => { trackRef.current = track; }, [track]);
  useEffect(() => { enabledRef.current = audioEnabled; }, [audioEnabled]);

  useEffect(() => {
    let active = true;
    const socket = io(API, { withCredentials: true, reconnection: true, reconnectionAttempts: Infinity, reconnectionDelay: 700, timeout: 10000 });
    socketRef.current = socket;
    socket.on('connect', () => {
      if (!active) return;
      setConnection('connected');
      socket.emit('room:join', { roomId, displayName: currentUser?.displayName || 'Listener' });
    });
    socket.on('disconnect', () => { if (active) setConnection('reconnecting'); });
    socket.on('connect_error', err => { if (active) { setConnection('offline'); setError(err.message === 'Authentication required' ? 'Your login session expired. Sign in again.' : 'Room connection failed. Check that the backend is running.'); } });
    socket.on('room:error', data => setError(data?.reason || 'Could not join this room.'));
    socket.on('room:state', data => {
      setMembers(data.members || []); setQueue(data.queue || []); setMessages(data.chat || []);
      if (data.playback?.track) applyPlayback(data.playback);
    });
    socket.on('room:members', setMembers);
    socket.on('chat:history', setMessages);
    socket.on('chat:new', item => setMessages(old => [...old, item].slice(-200)));
    socket.on('chat:typing', data => setTyping(old => data.typing ? [...new Set([...old, data.displayName || 'Someone'])] : old.filter(x => x !== (data.displayName || 'Someone'))));
    socket.on('queue:update', data => setQueue(data.items || []));
    socket.on('music:state', applyPlayback);
    function applyPlayback(data) {
      if (!data?.track) return;
      setTrack(data.track); setPlaying(!!data.isPlaying);
      const audio = audioRef.current;
      if (!audio) return;
      const nextUrl = data.track.streamUrl;
      if (nextUrl && audio.src !== nextUrl) { audio.src = nextUrl; audio.load(); }
      if (data.isPlaying && enabledRef.current) {
        const elapsed = Math.max(0, (Date.now() - Number(data.updatedAt || Date.now())) / 1000);
        const target = Math.max(0, Number(data.position || 0) + elapsed);
        if (Number.isFinite(target) && Math.abs((audio.currentTime || 0) - target) > 0.8) {
          try { audio.currentTime = target; } catch {}
        }
        audio.play().catch(() => setError('Tap “Enable audio” once to hear the room music.'));
      } else if (!data.isPlaying) audio.pause();
    }
    return () => {
      active = false;
      // Disconnect only. Server-side grace period preserves a room through refresh/reconnect.
      socket.disconnect();
      socketRef.current = null;
    };
  // room is intentionally rejoined when the route changes
  }, [roomId]);

  async function searchTracks(event) {
    event?.preventDefault();
    const query = search.trim();
    if (!query) return;
    setSearching(true); setError('');
    try {
      const data = await request(`/music/search?query=${encodeURIComponent(query)}&source=audius&page=1`);
      setResults(data.items || []);
      if (!data.items?.length) setError('No tracks found. Try another song or artist name.');
    } catch (err) { setError(`Music search failed: ${err.message}`); }
    finally { setSearching(false); }
  }
  function emitQueue(next) {
    setQueue(next);
    socketRef.current?.emit('queue:update', { roomId, items: next });
  }
  function addToQueue(item) {
    const next = [...queueRef.current, item];
    emitQueue(next);
    setError('Added to your shared queue ♡');
  }
  async function playTrack(item) {
    if (trackRef.current && trackRef.current.sourceId !== item?.sourceId) historyRef.current.push(trackRef.current);
    setError('');
    setTrack(item); trackRef.current = item; setPlaying(true);
    const audio = audioRef.current;
    if (!audio || !item.streamUrl) { setError('This track does not currently have a playable stream.'); return; }
    try {
      if (audio.src !== item.streamUrl) { audio.src = item.streamUrl; audio.load(); }
      await audio.play();
      setAudioEnabled(true); enabledRef.current = true;
      socketRef.current?.emit('music:play', { roomId, track: item, position: audio.currentTime || 0 });
    } catch { setPlaying(false); setError('The browser could not play this track. Try another track or press Enable audio.'); }
  }
  async function togglePlayback() {
    const audio = audioRef.current;
    if (!track?.streamUrl || !audio) { setError('Search for a song and press Play first.'); return; }
    try {
      if (audio.paused) {
        await audio.play(); setPlaying(true);
        socketRef.current?.emit('music:play', { roomId, track, position: audio.currentTime || 0 });
      } else {
        audio.pause(); setPlaying(false);
        socketRef.current?.emit('music:pause', { roomId, track, position: audio.currentTime || 0 });
      }
    } catch { setError('Playback was blocked. Press Enable audio and try again.'); }
  }
  async function enableAudio() {
    setAudioEnabled(true); enabledRef.current = true;
    const audio = audioRef.current;
    if (audio && track?.streamUrl && playing) {
      try { await audio.play(); } catch { setError('Audio is still unavailable for this track.'); }
    }
  }
  function seeked() {
    const audio = audioRef.current;
    if (!audio || !track) return;
    const now = Date.now();
    if (now - lastSeekSent.current < 350) return;
    lastSeekSent.current = now;
    socketRef.current?.emit('music:seek', { roomId, position: audio.currentTime, track });
  }
  function playNext() {
    const list = queueRef.current;
    if (!list.length) {
      setPlaying(false);
      socketRef.current?.emit('music:pause', { roomId, track: trackRef.current, position: audioRef.current?.currentTime || 0 });
      return;
    }
    if (repeat === 'one' && trackRef.current) { playTrack(trackRef.current); return; }
    const currentIndex = list.findIndex(item => item.sourceId === trackRef.current?.sourceId);
    const nextIndex = shuffle ? Math.floor(Math.random() * list.length) : (currentIndex + 1 + list.length) % list.length;
    const next = list[nextIndex];
    if (next) playTrack(next);
  }
  function playPrevious() {
    const previous = historyRef.current.pop();
    if (previous) playTrack(previous);
    else if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      socketRef.current?.emit('music:seek', { roomId, position: 0, track: trackRef.current });
      socketRef.current?.emit('music:play', { roomId, track: trackRef.current, position: 0 });
    }
  }
  function moveQueue(index, direction) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= queueRef.current.length) return;
    const next = [...queueRef.current];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    emitQueue(next);
  }
  function sendChat(event) {
    event.preventDefault();
    if (!message.trim()) return;
    socketRef.current?.emit('chat:send', { roomId, text: message.trim() });
    setMessage('');
    socketRef.current?.emit('chat:typing', { roomId, typing: false });
  }
  function typingChanged(value) {
    setMessage(value);
    socketRef.current?.emit('chat:typing', { roomId, typing: !!value });
  }
  function leaveRoom() {
    socketRef.current?.emit('room:leave', { roomId });
    window.location.assign('/dashboard');
  }
  const currentIndex = useMemo(() => queue.findIndex(x => x.sourceId === track?.sourceId), [queue, track]);
  return <Shell><main className="room">
    <div className="roomtitle"><div className="eyebrow">LISTENING ROOM</div><h1>{roomId} <span className="live">●</span></h1><p>You're in your shared little space.</p></div>
    <div className="layout">
      <section className="panel roompanel">
        <nav className="tabs"><button className={tab === 'music' ? 'on' : ''} onClick={() => setTab('music')}>♫ Music</button><button className={tab === 'chat' ? 'on' : ''} onClick={() => setTab('chat')}>♡ Chat</button></nav>
        <div className="persistent-audio"><audio ref={audioRef} controls onEnded={playNext} onSeeked={seeked}/></div>
        {tab === 'music' ? <div className="inside">
          <div className="cover"><span>♡</span><b>SYNC<br/>YOUR<br/>SOUNDS</b></div>
          <div className="now"><div className="eyebrow">NOW PLAYING</div><h2>{track?.title || 'Choose your first song'}</h2><p>{track?.artist || 'Your room soundtrack starts here'}</p>
            <div className="player-actions"><button className="btn outline" onClick={playPrevious}>← Previous</button><button className="btn" onClick={togglePlayback}>{playing ? 'Ⅱ Pause' : '▶ Play'}</button><button className="btn outline" onClick={playNext}>Next →</button><button className={`btn ${shuffle ? '' : 'outline'}`} onClick={() => setShuffle(value => !value)}>Shuffle {shuffle ? 'On' : 'Off'}</button><button className={`btn ${repeat !== 'off' ? '' : 'outline'}`} onClick={() => setRepeat(value => value === 'off' ? 'all' : value === 'all' ? 'one' : 'off')}>Repeat: {repeat}</button><button className="btn outline" onClick={enableAudio}>Enable audio ♡</button></div>
            {track && <small className="subtle">Track {currentIndex >= 0 ? `${currentIndex + 1} of ${queue.length}` : 'selected'}</small>}
          </div>
          <div className="search-section">
            <h3>Find your music ♡</h3><p className="hint">Search Audius tracks by song or artist. Available tracks depend on the provider catalogue.</p>
            <form className="search-form" onSubmit={searchTracks}><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search songs or artists…" maxLength={120}/><button className="btn" disabled={searching}>{searching ? 'Searching…' : 'Search'}</button></form>
            {results.length > 0 && <div className="tracklist">{results.map(item => <TrackCard key={item.sourceId} track={item} onPlay={playTrack} onAdd={addToQueue} active={track?.sourceId === item.sourceId}/>)}</div>}
          </div>
          <div className="queue"><h3>Up next <small>{queue.length} songs</small></h3>
            {queue.length === 0 && <p className="hint">Your shared queue is waiting for its first song.</p>}
             {queue.map((item, index) => <div className="queue-row" key={`${item.sourceId}-${index}`}><button className="queue-title" onClick={() => playTrack(item)}>{index + 1}. {item.title}<small>{item.artist}</small></button><button className="mini-btn secondary-mini" onClick={() => moveQueue(index, -1)} title="Move up">↑</button><button className="mini-btn secondary-mini" onClick={() => moveQueue(index, 1)} title="Move down">↓</button><button className="mini-btn secondary-mini" onClick={() => emitQueue(queue.filter((_, i) => i !== index))} title="Remove">×</button></div>)}
          </div>
        </div> : <div className="chat"><h3>Little conversations <small>{members.length} here now</small></h3>
          <div className="messages">{messages.map((item, index) => <div className="bubble" key={item.id || index}><b>{item.displayName || 'Friend'}</b><p>{item.text}</p><small>{item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</small></div>)}{!messages.length && <div className="empty">Say hello, share a song, or send a little heart. ♡</div>}</div>
          {typing.length > 0 && <small className="typing">{typing.join(', ')} typing…</small>}
          <form onSubmit={sendChat}><input value={message} onChange={e => typingChanged(e.target.value)} placeholder="Write something sweet…" maxLength={1000}/><button className="btn">↑</button></form>
        </div>}
      </section>
      <aside className="panel members"><h3>IN THIS ROOM ♡</h3><p className="connection-state">{connection === 'connected' ? '● Connected' : connection === 'reconnecting' ? 'Reconnecting…' : connection === 'offline' ? 'Offline' : 'Connecting…'}</p>
        {members.map(member => <p key={member.userId}>♡　{member.displayName || 'Listener'}</p>)}
        <div className="invite">Invite your people<br/><b>Share code {roomId}</b></div><button className="btn outline wide" onClick={leaveRoom}>Leave room</button>
      </aside>
    </div>
    {error && <div className="error">{error}</div>}
  </main></Shell>;
}
function Protected({ children }) {
  const [status, setStatus] = useState('checking');
  useEffect(() => {
    let active = true;
    request('/auth/me')
      .then(data => {
        if (!active) return;
        localStorage.setItem('syncmusic-user', JSON.stringify(data.user));
        setStatus('authenticated');
      })
      .catch(() => {
        if (!active) return;
        localStorage.removeItem('syncmusic-user');
        setStatus('guest');
      });
    return () => { active = false; };
  }, []);
  if (status === 'checking') return <Shell><main className="auth"><div className="panel"><h2>Opening your space… ♡</h2><p>Checking your sign-in session.</p></div></main></Shell>;
  return status === 'authenticated' ? children : <Navigate to="/login" replace/>;
}
function App() {
  return <BrowserRouter><Routes>
    <Route path="/" element={<Landing/>}/>
    <Route path="/login" element={<Auth/>}/>
    <Route path="/signup" element={<Auth signup/>}/>
    <Route path="/dashboard" element={<Protected><Dashboard/></Protected>}/>
    <Route path="/room/:roomId" element={<Protected><Room/></Protected>}/>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes></BrowserRouter>;
}
export default App;
