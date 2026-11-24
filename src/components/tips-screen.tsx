const TIPS = [
  {
    title: "Nitrogen cycle",
    body: "Fish waste becomes ammonia. Bacteria turn ammonia into nitrite, then nitrate. Plants take up the nitrate. If ammonia climbs, the filter is behind the fish.",
  },
  {
    title: "Ranchu",
    body: "They need calm water near the temperature stored in settings. A jump like the 45 °C sample in the history is an emergency, not a warm afternoon.",
  },
  {
    title: "Feeding",
    body: "Feed once or twice a day, and only what they finish. Uneaten food becomes ammonia. The feeder row in devices only records whether that switch is on.",
  },
  {
    title: "Power cut",
    body: "The air pump and the circulation pump matter first. The water heater can wait. This week the app only shows the on/off state that is already stored.",
  },
];

export function TipsScreen() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Short notes for the bench. They stay in the app, not in the database.</p>
      {TIPS.map((tip) => (
        <article key={tip.title} className="rounded-3xl bg-card p-4 ring-1 ring-border">
          <h2 className="text-sm font-semibold">{tip.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tip.body}</p>
        </article>
      ))}
    </div>
  );
}
