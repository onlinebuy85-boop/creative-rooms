import { Plus, Smile, Mic, Send } from "lucide-react";

interface MessageComposerProps {
  placeholder: string;
}

export function MessageComposer({ placeholder }: MessageComposerProps) {
  return (
    <div className="cr-msg-composer">
      <button type="button" className="cr-msg-composer-icon" aria-label="Add">
        <Plus className="w-5 h-5" />
      </button>
      <input
        type="text"
        className="cr-msg-composer-input"
        placeholder={placeholder}
      />
      <button type="button" className="cr-msg-composer-icon" aria-label="Emoji">
        <Smile className="w-5 h-5" />
      </button>
      <button type="button" className="cr-msg-composer-icon" aria-label="Voice message">
        <Mic className="w-5 h-5" />
      </button>
      <button type="button" className="cr-msg-composer-send" aria-label="Send">
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
}
