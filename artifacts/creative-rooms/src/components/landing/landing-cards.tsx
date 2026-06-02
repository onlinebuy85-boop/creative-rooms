import { WHAT_HAPPENS_CARDS } from "@/lib/landing-data";

export function LandingCards() {
  return (
    <section className="cr-landing-section cr-landing-section--fade" id="what-happens">
      <div className="cr-landing-container">
        <h2 className="cr-landing-section-title font-serif">What happens here?</h2>

        <ul className="cr-landing-value-grid">
          {WHAT_HAPPENS_CARDS.map((card, index) => {
            const Icon = card.icon;
            return (
              <li
                key={card.id}
                className="cr-landing-value-card"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <span className="cr-landing-value-icon">
                  <Icon className="w-5 h-5" strokeWidth={1.75} />
                </span>
                <h3 className="cr-landing-value-title">{card.title}</h3>
                <p className="cr-landing-value-desc">{card.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
