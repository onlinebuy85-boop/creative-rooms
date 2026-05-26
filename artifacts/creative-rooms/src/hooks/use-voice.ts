import { useRef, useState, useCallback, useEffect } from "react";

const STUN: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export interface VoiceMember {
  profileId: number;
  displayName: string;
  speaking: boolean;
}

interface PeerConn {
  pc: RTCPeerConnection;
  audioEl: HTMLAudioElement;
  speaking: boolean;
  displayName: string;
}

interface UseVoiceParams {
  myProfileId: number | undefined;
  myDisplayName: string | undefined;
  sendWsMessage: (msg: unknown) => void;
}

export function useVoice({ myProfileId, myDisplayName, sendWsMessage }: UseVoiceParams) {
  const [isInVoice, setIsInVoice] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceMembers, setVoiceMembers] = useState<VoiceMember[]>([]);

  const isInVoiceRef = useRef(false);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peersRef = useRef(new Map<number, PeerConn>());
  const audioCtxRef = useRef<AudioContext | null>(null);
  const speakTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── Create / manage a peer connection ── */
  const createPeer = useCallback(
    (remoteId: number, remoteName: string, initiator: boolean) => {
      /* Don't duplicate */
      if (peersRef.current.has(remoteId)) return;

      const pc = new RTCPeerConnection(STUN);
      const audioEl = new Audio();
      audioEl.autoplay = true;

      peersRef.current.set(remoteId, { pc, audioEl, speaking: false, displayName: remoteName });

      /* Add local tracks */
      if (localStreamRef.current) {
        for (const track of localStreamRef.current.getTracks()) {
          pc.addTrack(track, localStreamRef.current);
        }
      }

      /* Remote stream → audio element */
      pc.ontrack = (e) => {
        audioEl.srcObject = e.streams[0];
      };

      /* ICE candidates */
      pc.onicecandidate = (e) => {
        if (e.candidate) {
          sendWsMessage({
            type: "voice_signal",
            to: remoteId,
            signal: { type: "ice", candidate: e.candidate.toJSON() },
          });
        }
      };

      if (initiator) {
        pc.createOffer()
          .then((offer) => {
            pc.setLocalDescription(offer);
            sendWsMessage({
              type: "voice_signal",
              to: remoteId,
              signal: { type: "offer", sdp: offer },
            });
          })
          .catch(() => {});
      }
    },
    [sendWsMessage],
  );

  /* ── Join voice ── */
  const joinVoice = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localStreamRef.current = stream;

      /* Speaking detection */
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      speakTimerRef.current = setInterval(() => {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        setSpeaking(avg > 12);
      }, 80);

      isInVoiceRef.current = true;
      setIsInVoice(true);
      sendWsMessage({ type: "voice_join", profileId: myProfileId, displayName: myDisplayName });
    } catch {
      /* Microphone denied or unavailable — fail silently */
    }
  }, [myProfileId, myDisplayName, sendWsMessage]);

  /* ── Leave voice ── */
  const leaveVoice = useCallback(() => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;

    for (const [, peer] of peersRef.current) {
      peer.pc.close();
      peer.audioEl.srcObject = null;
    }
    peersRef.current.clear();

    if (speakTimerRef.current) clearInterval(speakTimerRef.current);
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;

    isInVoiceRef.current = false;
    setIsInVoice(false);
    setIsMuted(false);
    setSpeaking(false);
    setVoiceMembers([]);

    sendWsMessage({ type: "voice_leave", profileId: myProfileId });
  }, [myProfileId, sendWsMessage]);

  /* ── Mute toggle ── */
  const toggleMute = useCallback(() => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setIsMuted(!track.enabled);
  }, []);

  /* ── Handle incoming voice_signal ── */
  const handleVoiceSignal = useCallback(
    async (msg: {
      from: number;
      displayName: string;
      signal: {
        type: "offer" | "answer" | "ice";
        sdp?: RTCSessionDescriptionInit;
        candidate?: RTCIceCandidateInit;
      };
    }) => {
      const { from, displayName, signal } = msg;

      if (signal.type === "offer" && signal.sdp) {
        createPeer(from, displayName, false);
        const peer = peersRef.current.get(from);
        if (!peer) return;
        await peer.pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
        const answer = await peer.pc.createAnswer();
        await peer.pc.setLocalDescription(answer);
        sendWsMessage({
          type: "voice_signal",
          to: from,
          signal: { type: "answer", sdp: answer },
        });
      } else if (signal.type === "answer" && signal.sdp) {
        const peer = peersRef.current.get(from);
        if (peer) await peer.pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
      } else if (signal.type === "ice" && signal.candidate) {
        const peer = peersRef.current.get(from);
        if (peer) {
          await peer.pc
            .addIceCandidate(new RTCIceCandidate(signal.candidate))
            .catch(() => {});
        }
      }
    },
    [createPeer, sendWsMessage],
  );

  /* ── Handle voice_presence events ── */
  const handleVoicePresence = useCallback(
    (msg: {
      profileId: number;
      displayName: string;
      action: "join" | "leave";
      voiceMembers: Array<{ profileId: number; displayName: string }>;
    }) => {
      setVoiceMembers(msg.voiceMembers.map((m) => ({ ...m, speaking: false })));

      if (msg.action === "join" && msg.profileId !== myProfileId && isInVoiceRef.current) {
        /* We're already in voice → initiate to the new joiner */
        createPeer(msg.profileId, msg.displayName, true);
      } else if (msg.action === "leave") {
        const peer = peersRef.current.get(msg.profileId);
        if (peer) {
          peer.pc.close();
          peer.audioEl.srcObject = null;
          peersRef.current.delete(msg.profileId);
        }
      }
    },
    [myProfileId, createPeer],
  );

  /* Cleanup on unmount */
  useEffect(() => {
    return () => {
      if (isInVoiceRef.current) leaveVoice();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isInVoice,
    isMuted,
    speaking,
    voiceMembers,
    joinVoice,
    leaveVoice,
    toggleMute,
    handleVoiceSignal,
    handleVoicePresence,
  };
}
