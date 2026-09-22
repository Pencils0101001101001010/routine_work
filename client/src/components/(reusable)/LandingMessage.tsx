import InfoTiles from "./InfoTiles";

export default function LandingMessage() {
  return (
    <section className="w-full text-center py-12 ">
      <h1 className="text-2xl md:text-4xl font-bold mb-4">
        We focus on getting you the latest job listings.
      </h1>
      <p>Getting Started</p>

      <div className="flex flex-col md:flex-row items-center justify-center">
        <InfoTiles
          title="Step 1"
          description="Create an account. Follow the link below to register. Once done login."
          linkUrl="/register"
          linkLabel="Go to register"
        />
        <InfoTiles
          title="Step 2"
          description="Create preferences. Follow link below. Once you there add new preferences."
          linkUrl="/register"
          linkLabel="Go to Preference"
        />

        <InfoTiles
          title="Step 3"
          description="That's it! Now we'll share all new Job listing matching your preferences via email. Remember consistency is key."
        />
      </div>
    </section>
  );
}
