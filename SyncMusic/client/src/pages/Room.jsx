import { useState } from 'react';
import RoomTabs from '../components/RoomTabs.jsx';
import MusicPlayer from '../components/MusicPlayer.jsx';
import ChatBox from '../components/ChatBox.jsx';
import MemberList from '../components/MemberList.jsx';
import TapToJoinOverlay from '../components/TapToJoinOverlay.jsx';

export default function Room() {
  const [tab, setTab] = useState('music');
  // TODO: Join the socket room and hydrate the complete server snapshot.
  // Keep MusicPlayer mounted across tab changes so playback continues.
  return <main className="p-6">
    <RoomTabs activeTab={tab} onChange={setTab} />
    <TapToJoinOverlay />
    <MusicPlayer />
    {tab === 'music' ? <MemberList /> : <ChatBox />}
  </main>;
}
