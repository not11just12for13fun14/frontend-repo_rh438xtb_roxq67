import Spline from '@splinetool/react-spline';

function Hero() {
  return (
    <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/6tUXqVcUA0xgJugv/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      {/* Gradient overlay for legibility, allow pointer passthrough to Spline */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />

      <div className="relative z-10 flex h-full items-center justify-center text-center px-6">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow">
            Discover Christian Events Near You
          </h1>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-200/90">
            Explore conferences, worship nights, retreats, and more. Filter by date, type, and location.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Hero;
