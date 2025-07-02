import { ArrowLeft, Target, Eye, Heart, Users, Award, Globe } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Excellence",
      description: "We strive for the highest standards in everything we do, from teaching to research to community engagement."
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "We believe in the power of working together to achieve more than any individual could alone."
    },
    {
      icon: Globe,
      title: "Innovation",
      description: "We embrace new ideas, technologies, and methods to advance knowledge and solve complex problems."
    },
    {
      icon: Heart,
      title: "Integrity",
      description: "We maintain the highest ethical standards and act with honesty and transparency in all our endeavors."
    }
  ];

  const achievements = [
    { number: "15,000+", label: "Students Enrolled" },
    { number: "500+", label: "Faculty Members" },
    { number: "95%", label: "Graduation Rate" },
    { number: "50+", label: "Research Centers" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">About Excellence Institute</h1>
          <p className="text-xl text-gray-600 mt-2">Empowering minds, advancing knowledge, shaping the future</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Founded in 1985, Excellence Institute has been at the forefront of higher education and research for nearly four decades. What began as a small college with a vision to provide world-class education has evolved into a prestigious institution recognized globally for academic excellence and groundbreaking research.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Our commitment to fostering intellectual curiosity, promoting innovation, and developing tomorrow's leaders has made us a destination of choice for students, faculty, and researchers from around the world.
              </p>
              <Link href="/signup">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Join Our Community
                </Button>
              </Link>
            </div>
            <div className="bg-institute-gradient rounded-lg p-8 text-white">
              <div className="grid grid-cols-2 gap-6">
                {achievements.map((achievement, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-orange-300 mb-2">{achievement.number}</div>
                    <div className="text-blue-100">{achievement.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-600">
                  To provide exceptional education, conduct cutting-edge research, and serve our community while preparing students to become leaders and innovators in their chosen fields.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Eye className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-600">
                  To be recognized as a global leader in education and research, known for academic excellence, innovation, and positive impact on society.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Award className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">Our Impact</h3>
                <p className="text-gray-600">
                  Through education, research, and community engagement, we create knowledge, solve problems, and contribute to the betterment of society locally and globally.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Core Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="p-6">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 rounded-lg p-3">
                      <value.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                      <p className="text-gray-600">{value.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Leadership */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Dr. Sarah Mitchell</h3>
                <p className="text-blue-600 font-medium mb-2">President</p>
                <p className="text-gray-600 text-sm">Leading Excellence Institute with a vision for innovation and academic excellence.</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Dr. Michael Chen</h3>
                <p className="text-blue-600 font-medium mb-2">Provost</p>
                <p className="text-gray-600 text-sm">Overseeing academic affairs and ensuring the highest standards of education.</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Dr. Emily Rodriguez</h3>
                <p className="text-blue-600 font-medium mb-2">VP of Research</p>
                <p className="text-gray-600 text-sm">Driving groundbreaking research initiatives and fostering innovation.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-blue-600 rounded-lg p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Excellence Institute?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Discover how you can be part of our community of learners, researchers, and innovators.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
                Apply Now
              </Button>
            </Link>
            <Link href="/#contact">
              <Button variant="outline" className="border-white text-white hover:bg-blue-700">
                Contact Us
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}