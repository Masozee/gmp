'use client'; // Add use client for state and effects

import React, { useState, useEffect } from 'react'; // Import hooks
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Define interface for a single past event object
interface PastEvent {
  title: string;
  slug: string; // Changed from url to slug
  image: string;
  date: string;
  description: string; // Seems to be context/location
}

const ClassOfClimateLeadersPage = () => {
  const programTitle = "Class of Climate Leaders";
  const programHeroDescription = "An exclusive climate leadership bootcamp for the best participants of Academia Politica, preparing them to become agents of change in their communities. 🌱🌍";

  // Add state for events, loading, and errors
  const [pastEvents, setPastEvents] = useState<PastEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        const response = await fetch('/data/class-of-climate-leaders.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPastEvents(data as PastEvent[]); // Assume data matches the interface
      } catch (e) {
        console.error("Failed to load climate leaders events:", e);
        setError("Failed to load event data.");
      } finally {
        setIsLoading(false);
      }
    }
    loadEvents();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-32 text-center text-black" style={{ backgroundColor: '#59caf5' }}>
        <div className="relative container mx-auto px-4 z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 !text-white" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>
            Class of Climate Leaders
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 !text-white">
            An exclusive climate leadership bootcamp for the best participants of Academia Politica, preparing them to become agents of change in their communities. 🌱🌍
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-semibold">
              🎓 Exclusive Bootcamp
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm font-semibold">
              🌍 Climate Leadership
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm font-semibold">
              🚀 Change Agents
            </Badge>
          </div>
        </div>
      </section>

      {/* Section 1: Program Overview (Image Left, Text Right) */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-1/2">
            <Image 
              src="/images/program/DSC08852-a.jpg"
              alt="Class of Climate Leaders Workshop"
              width={500}
              height={400}
              className="rounded-lg shadow-md object-cover w-full"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>About the Program</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Class of Climate Leaders is an exclusive climate leadership bootcamp specifically designed for the best participants from the Academia Politica program. This program prepares young people to become leaders who not only understand the challenges of climate change, but are also capable of taking concrete action in their communities.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Through a comprehensive learning approach, participants will be equipped with in-depth knowledge of public policy, climate change science, and effective communication skills to lead positive change.
            </p>
            <div className="flex items-center gap-2 text-primary font-semibold">
              <span>🎯</span>
              <span>Learning outcomes are directly practiced in the Council of Gen Z</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Curriculum (Text Left, Image Right) */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-full md:w-1/2 md:order-last">
              <Image 
                src="/images/program/DSC08852-a.jpg"
                alt="Climate Leaders Learning Materials"
                width={500}
                height={400}
                className="rounded-lg shadow-md object-cover w-full"
              />
            </div>
            <div className="w-full md:w-1/2 md:order-first">
              <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-6" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Curriculum</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary rounded-full p-2 flex-shrink-0">
                    <span className="text-black font-bold text-lg">📋</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Public Policy 101</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Understanding the fundamentals of public policy, policy-making processes, and how to advocate for policy changes that favor the environment and young people.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-secondary rounded-full p-2 flex-shrink-0">
                    <span className="text-white font-bold text-lg">🌍</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Climate Change 101</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      In-depth understanding of climate change science, its impact on Indonesia, and innovative solutions that can be applied at local and national levels.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-accent rounded-full p-2 flex-shrink-0">
                    <span className="text-white font-bold text-lg">🎤</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Public Speaking 101</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Developing effective public communication skills, storytelling for environmental issues, and presentation techniques that influence audiences.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Program Features (Image Left, Text Right) */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-1/2">
            <Image 
              src="/images/program/DSC08852-a.jpg"
              alt="Class of Climate Leaders Methodology"
              width={500}
              height={400}
              className="rounded-lg shadow-md object-cover w-full"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-6" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Learning Methodology</h2>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-primary">
                <h3 className="font-bold text-gray-900 mb-2">🎯 Interactive Learning</h3>
                <p className="text-gray-600 text-sm">
                  Combination of workshops, group discussions, and real case studies to understand the complexity of climate change issues.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-secondary">
                <h3 className="font-bold text-gray-900 mb-2">🤝 Personal Mentoring</h3>
                <p className="text-gray-600 text-sm">
                  Each participant gets an experienced mentor to guide project development and career in the environmental field.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-accent">
                <h3 className="font-bold text-gray-900 mb-2">🚀 Project-Based Learning</h3>
                <p className="text-gray-600 text-sm">
                  Participants develop real projects that can be implemented in their respective communities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Impact & Statistics (Text Left, Image Right) */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-full md:w-1/2 md:order-last">
              <Image 
                src="/images/program/DSC08852-a.jpg"
                alt="Class of Climate Leaders Impact"
                width={500}
                height={400}
                className="rounded-lg shadow-md object-cover w-full"
              />
            </div>
            <div className="w-full md:w-1/2 md:order-first">
              <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-6" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Measurable Impact</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                The Class of Climate Leaders program has proven its effectiveness in preparing young leaders ready to face climate change challenges. Here are the program achievements:
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Card className="text-center">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-primary mb-1">95%</div>
                    <div className="text-sm text-gray-600">Participant Satisfaction Rate</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-secondary mb-1">87%</div>
                    <div className="text-sm text-gray-600">Continue to Council Gen Z</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-accent mb-1">73%</div>
                    <div className="text-sm text-gray-600">Start Community Projects</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-success mb-1">68%</div>
                    <div className="text-sm text-gray-600">Confidence Improvement</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Alumni Success Stories (Image Left, Text Right) */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-1/2">
            <Image 
              src="/images/program/DSC08852-a.jpg"
              alt="Class of Climate Leaders Alumni"
              width={500}
              height={400}
              className="rounded-lg shadow-md object-cover w-full"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-6" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>Alumni Success Stories</h2>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-black font-bold">A</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Andi Pratama</h3>
                    <p className="text-sm text-gray-600">Jakarta, Batch 2023</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm italic">
                  "After joining CCL, I successfully started a plastic waste reduction campaign on campus involving more than 500 students."
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">S</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Sari Indrawati</h3>
                    <p className="text-sm text-gray-600">Bandung, Batch 2023</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm italic">
                  "This program opened my eyes to the importance of policy advocacy. Now I am active in environmental NGOs and involved in drafting regional regulations on waste management."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: How to Join (Text Left, Image Right) */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-full md:w-1/2 md:order-last">
              <Image 
                src="/images/program/DSC08852-a.jpg"
                alt="How to Join Class of Climate Leaders"
                width={500}
                height={400}
                className="rounded-lg shadow-md object-cover w-full"
              />
            </div>
            <div className="w-full md:w-1/2 md:order-first">
              <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-6" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>How to Join</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Class of Climate Leaders is an exclusive program that is only open to the best participants from Academia Politica. Here is the pathway to join:
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Join Academia Politica</h3>
                    <p className="text-gray-600 text-sm">Register and participate in the Academia Politica program first</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-secondary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Show Best Performance</h3>
                    <p className="text-gray-600 text-sm">Participate actively and demonstrate commitment to environmental issues</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-accent text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Selection and Invitation</h3>
                    <p className="text-gray-600 text-sm">Selected participants will receive a special invitation to join</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Link 
                  href="/en/programs/academia-politica" 
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                >
                  <span>Learn About Academia Politica</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>
            Ready to Become a Climate Leader?
          </h2>
          <p className="text-lg text-gray-800 mb-8 max-w-2xl mx-auto">
            Join a community of young leaders committed to creating positive change for the environment and Indonesia's future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/en/programs/academia-politica" 
              className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Start with Academia Politica
            </Link>
            <Link 
              href="/en/programs/council-gen-z" 
              className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors border-2 border-black"
            >
              View Council Gen Z
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default ClassOfClimateLeadersPage; 