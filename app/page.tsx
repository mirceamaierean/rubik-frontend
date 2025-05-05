import Hero from "@/components/Hero";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <ThemeToggle />
      <Hero />
    </main>
  );
}
