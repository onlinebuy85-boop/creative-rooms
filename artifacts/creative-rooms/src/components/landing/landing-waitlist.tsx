import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CREATOR_TYPES } from "@/lib/landing-data";
import roomCover2 from "@/assets/images/room-cover-2.png";

export function LandingWaitlist() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [creatorType, setCreatorType] = useState(CREATOR_TYPES[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      toast({
        title: "You're on the list",
        description: "We'll reach out when there's a spot for you.",
      });
      setName("");
      setEmail("");
      setCreatorType(CREATOR_TYPES[0]);
    }, 600);
  };

  return (
    <section className="cr-landing-section cr-landing-waitlist cr-landing-section--fade" id="waitlist">
      <div className="cr-landing-container">
        <div className="cr-landing-waitlist-card">
          <div className="cr-landing-waitlist-visual">
            <img src={roomCover2} alt="" className="cr-landing-waitlist-img" />
            <div className="cr-landing-waitlist-visual-overlay" />
            <p className="cr-landing-waitlist-script font-serif">
              Good songs start with honest people.
            </p>
          </div>

          <div className="cr-landing-waitlist-form-wrap">
            <h2 className="cr-landing-waitlist-title font-serif">Come early.</h2>
            <p className="cr-landing-waitlist-lead">
              We&apos;re still building this.
              <br />
              But if this feels like your kind of place, join us.
            </p>

            <form className="cr-landing-waitlist-form" onSubmit={handleSubmit}>
              <label className="cr-landing-field">
                <span className="cr-landing-field-label">Your name</span>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  className="cr-landing-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="How should we say hi?"
                />
              </label>

              <label className="cr-landing-field">
                <span className="cr-landing-field-label">Email address</span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  className="cr-landing-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                />
              </label>

              <label className="cr-landing-field">
                <span className="cr-landing-field-label">What do you create?</span>
                <div className="cr-landing-select-wrap">
                  <select
                    className="cr-landing-select"
                    value={creatorType}
                    onChange={(e) => setCreatorType(e.target.value as (typeof CREATOR_TYPES)[number])}
                  >
                    {CREATOR_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="cr-landing-select-icon w-4 h-4" />
                </div>
              </label>

              <button type="submit" className="cr-landing-btn-primary cr-landing-btn-primary--full" disabled={loading}>
                {loading ? "Saving your spot…" : "Get invited"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
