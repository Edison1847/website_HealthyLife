import LenisScroll from "@/components/LenisScroll";
import Hero from "@/components/Hero";
import DeepSleep from "@/components/DeepSleep";
import PowerFoods from "@/components/PowerFoods";

export default function Home() {
  return (
    <LenisScroll>
      <main className="bg-deep-onyx relative">
        {/* Section 1: Hero (Black) */}
        <Hero />

        {/* Section 2: Content (White) */}
        <DeepSleep />

        {/* Section 3: Next (Black) */}
        <PowerFoods />
      </main>
    </LenisScroll>
  );
}

