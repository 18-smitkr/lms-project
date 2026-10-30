import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import FeaturedCourses from "../components/FeaturedCourses";
import Footer from "../components/Footer";
import CoursesSection from "../components/coursesection";

function Home() {
  return (
    <div className="bg-black min-h-screen overflow-hidden"><div className="absolute top-20 left-20 w-96 h-96 bg-purple-700/30 blur-[150px]" />
    {/* <div className="absolute bottom-20 right-20 w-96 h-96 bg-fuchsia-700/30 blur-[150px]" /> */}
    <Navbar />
    <Hero />
    <Stats />
    <CoursesSection />
    <Footer />
    </div>
  );
}

export default Home;