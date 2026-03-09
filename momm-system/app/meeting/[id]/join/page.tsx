'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Video, Mic, Monitor, Users, Copy, Check,
  ArrowLeft, Calendar, Clock, MapPin, AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

export default function JoinMeetingPage() {
  const params = useParams();
  const meetingId = params.id as string;
  const { user } = useAuth();

  const [meeting, setMeeting] = useState<any>(null);
  const [meetingLoading, setMeetingLoading] = useState(true);
  const [meetingError, setMeetingError] = useState(false);

  const [displayName, setDisplayName] = useState('');
  const [joined, setJoined] = useState(false);
  const [iframeUrl, setIframeUrl] = useState('');
  const [copied, setCopied] = useState(false);

  // Auto-fill display name from logged-in user
  useEffect(() => {
    if (user) {
      setDisplayName(user.staff?.name || user.username || '');
    }
  }, [user]);

  // Determine if logged-in user is the organizer of this meeting
  const isOrganizer =
    !!user &&
    !!meeting &&
    (user.staff?.id === meeting.organizerStaffId || user.id === meeting.organizer?.userId);

  // ── Fetch meeting info ────────────────────────────────────────────
  useEffect(() => {
    fetch(`/api/meetings/${meetingId}`)
      .then((r) => r.json())
      .then((result) => {
        if (result.success) setMeeting(result.data);
        else setMeetingError(true);
      })
      .catch(() => setMeetingError(true))
      .finally(() => setMeetingLoading(false));
  }, [meetingId]);

  // ── Start meeting ─────────────────────────────────────────────────
  const handleJoin = useCallback(() => {
    const roomName = `MOMM-System-${meetingId}`;
    const name = displayName.trim() || 'Guest';
    const jitsiName = isOrganizer ? `${name} (Host)` : name;

    // Build config via URL hash — this is the only reliable way to grant
    // camera/microphone permissions to the iframe (allow attr is set in JSX
    // before the frame navigates, so timing is never an issue).
    const hash = [
      `userInfo.displayName=${encodeURIComponent(JSON.stringify(jitsiName))}`,
      'config.disableLobbyMode=true',
      'config.startWithAudioMuted=false',
      'config.startWithVideoMuted=false',
      'config.prejoinPageEnabled=false',
      'config.disableDeepLinking=true',
      'config.enableWelcomePage=false',
      'config.enableNoisyMicDetection=true',
    ].join('&');

    setIframeUrl(`https://meet.jit.si/${roomName}#${hash}`);
    setJoined(true);
  }, [meetingId, displayName, isOrganizer]);
        // Grant media permissions to the embedded iframe
  // ── Copy shareable link ──────────────────────────────────────────
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ── Helpers ──────────────────────────────────────────────────────
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' });

  const formatTime = (v: string) =>
    new Date(v).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  const getStatus = () => {
    if (!meeting) return null;
    if (meeting.isCancelled) return { label: 'Cancelled', cls: 'bg-gray-100 text-gray-600' };
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const meetDate = new Date(meeting.meetingDate); meetDate.setHours(0, 0, 0, 0);
    if (meetDate < today) return { label: 'Completed', cls: 'bg-green-100 text-green-700' };
    return { label: 'Upcoming', cls: 'bg-blue-100 text-blue-700' };
  };

  const status = getStatus();

  // ════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">

      {/* ── Top bar ──────────────────────────────────────────────── */}
      <header className="shrink-0 bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-white hover:text-blue-400 transition">
          <ArrowLeft size={18} />
          <span className="font-bold text-lg">MOMM</span>
          <span className="text-gray-400 text-sm hidden sm:inline">| Online Meeting</span>
        </Link>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition text-sm"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Share Link'}
        </button>
      </header>

      {/* ── Main area ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">

        {/* ── Pre-join screen ─────────────────────────────────────── */}
        {!joined && (
          <div className="w-full max-w-lg">

            {/* Meeting info card */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden mb-6">
              <div className="bg-blue-700 px-6 py-5">
                <div className="flex items-center gap-3 mb-1">
                  <Video size={20} className="text-blue-200" />
                  <span className="text-blue-200 text-sm font-medium uppercase tracking-wide">Online Meeting Room</span>
                </div>
                {meetingLoading ? (
                  <div className="h-7 bg-blue-600 rounded animate-pulse w-3/4 mt-1" />
                ) : meetingError ? (
                  <p className="text-white text-xl font-bold">Meeting #{meetingId}</p>
                ) : (
                  <p className="text-white text-xl font-bold leading-snug">{meeting?.meetingTitle}</p>
                )}
              </div>

              {!meetingLoading && !meetingError && meeting && (
                <div className="px-6 py-4 space-y-2.5 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar size={15} className="text-gray-500 shrink-0" />
                    <span>{formatDate(meeting.meetingDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={15} className="text-gray-500 shrink-0" />
                    <span>{formatTime(meeting.meetingStartTime)} – {formatTime(meeting.meetingEndTime)}</span>
                  </div>
                  {meeting.venue?.venueName && (
                    <div className="flex items-center gap-2">
                      <MapPin size={15} className="text-gray-500 shrink-0" />
                      <span>{meeting.venue.venueName}</span>
                    </div>
                  )}
                  {status && (
                    <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${status.cls}`}>
                      {status.label}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Name + Join */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 space-y-4">
              {isOrganizer && (
                <div className="flex items-center gap-2 bg-purple-900/40 border border-purple-600/50 rounded-lg px-3 py-2 text-sm text-purple-200 font-medium">
                  <Users size={14} className="text-purple-400 shrink-0" />
                  You are the <span className="text-purple-300 font-semibold">Host</span> of this meeting
                </div>
              )}
              <h2 className="text-white font-semibold text-lg">Enter your name to join</h2>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                placeholder="Your full name"
                className="w-full rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />

              <button
                onClick={handleJoin}
                className={`w-full flex items-center justify-center gap-2 rounded-xl text-white font-semibold py-3 text-sm transition ${
                  isOrganizer
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <Video size={16} /> Join Meeting
              </button>

              <div className="flex items-start gap-2 bg-amber-900/30 border border-amber-700/40 rounded-lg px-3 py-2.5 text-xs text-amber-200">
                <AlertCircle size={13} className="shrink-0 mt-0.5 text-amber-400" />
                <span>Your browser will ask for camera &amp; microphone permission when you join. You can mute/turn off either at any time inside the room.</span>
              </div>
            </div>

            {/* Features row */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { icon: Video, label: 'HD Video' },
                { icon: Mic, label: 'Clear Audio' },
                { icon: Monitor, label: 'Screen Share' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 flex flex-col items-center gap-2 text-gray-400 text-xs">
                  <Icon size={20} className="text-blue-400" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Active meeting — plain iframe with allow set in JSX ── */}
        {joined && iframeUrl && (
          <iframe
            src={iframeUrl}
            allow="camera; microphone; display-capture; autoplay; fullscreen"
            className="w-full rounded-xl border border-gray-700"
            style={{ height: 'calc(100vh - 140px)', border: 'none' }}
          />
        )}
      </div>
    </div>
  );
}
