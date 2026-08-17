import AmbientBackground from '@/components/AmbientBackground';
import SpotlightGlow from '@/components/SpotlightGlow';
import SplashCursor from '@/components/SplashCursor';
import { ScrollProgressBar } from '@/components/ScrollReveal';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Capabilities from '@/components/Capabilities';
import Stack from '@/components/Stack';
import CaseStudies from '@/components/CaseStudies';
import AgenticResume from '@/components/AgenticResume';
import TerminalDemo from '@/components/TerminalDemo';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import MascotChatbot from '@/components/MascotChatbot';

export default function Home() {
  return (
    <>
      <ScrollProgressBar />
      <Navbar />
      <main id="top" className="min-h-screen relative overflow-x-clip bg-obsidian">
        <AmbientBackground />
        <SpotlightGlow />
        <SplashCursor />
        <Hero />
        <Marquee />
        <Capabilities />
        <Stack />
        <CaseStudies />
        <AgenticResume />
        <TerminalDemo />
        <About />
        <Contact />
        <Footer />
      </main>
      <MascotChatbot />
    </>
  );
}
