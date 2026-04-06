import { Cross, Fish, Mountain, Book } from "lucide-react";
import { AnimateIn } from "@/components/animate-in";

const interests = [
  {
    icon: <Cross className="text-red-bright" size={20} />,
    title: "Faith",
    description: "My walk with Jesus is the foundation of everything I do, guiding my purpose and perspective",
  },
  {
    icon: <Fish className="text-blue-bright" size={20} />,
    title: "Fishing",
    description: "Finding peace and adventure on the water, always looking for the next great fishing spot",
  },
  {
    icon: <Mountain className="text-green-bright" size={20} />,
    title: "Hiking",
    description: "Exploring trails with friends and seeking out scenic viewpoints in nature",
  },
  {
    icon: <Book className="text-purple-bright" size={20} />,
    title: "Reading",
    description: "Deep diving into novels & technical books that expand my horizons & captivate my mind",
  },
];

export default function OutsideCoding() {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="w-full max-w-4xl px-4 py-8">
        <AnimateIn>
          <h2 className="text-2xl md:text-4xl font-bold text-center text-yellow-bright mb-8">
            Outside of Programming
          </h2>
        </AnimateIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {interests.map((interest, i) => (
            <AnimateIn key={interest.title} delay={100 + i * 100}>
              <div
                className="flex flex-col items-center text-center p-4 rounded-lg border border-foreground/10
                           hover:border-yellow-bright/50 transition-colors duration-300 bg-background/50 h-full"
              >
                <div className="mb-3">{interest.icon}</div>
                <h3 className="font-bold text-foreground/90 mb-2">{interest.title}</h3>
                <p className="text-sm text-foreground/70">{interest.description}</p>
              </div>
            </AnimateIn>
          ))}
        </div>

        <AnimateIn delay={500}>
          <p className="text-center text-foreground/80 mt-8 max-w-2xl mx-auto text-sm md:text-base italic">
            When I'm not writing code, you'll find me
            <span className="text-red-bright"> walking with Christ,</span>
            <span className="text-blue-bright"> out on the water,</span>
            <span className="text-green-bright"> hiking trails,</span>
            <span className="text-purple-bright"> or reading books.</span>
          </p>
        </AnimateIn>
      </div>
    </div>
  );
}
