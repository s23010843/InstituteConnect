import { Flag, Eye, Heart } from "lucide-react";

export default function AboutSection() {
  const values = [
    {
      icon: Flag,
      title: "Our Mission",
      description: "To provide transformative education that empowers students to become leaders, innovators, and responsible global citizens who make meaningful contributions to society.",
    },
    {
      icon: Eye,
      title: "Our Vision",
      description: "To be recognized globally as a premier institution that advances knowledge, fosters innovation, and shapes the future through excellence in education and research.",
    },
    {
      icon: Heart,
      title: "Our Values",
      description: "Excellence, integrity, innovation, diversity, collaboration, and social responsibility guide everything we do as we pursue our educational and research mission.",
    },
  ];

  const achievements = [
    { value: "#15", label: "Global University Ranking" },
    { value: "98%", label: "Graduate Employment Rate" },
    { value: "$500M", label: "Research Funding" },
    { value: "150+", label: "Industry Partners" },
  ];

  return (
    <section id="about" className="py-20 bg-institute-blue text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-roboto-slab text-4xl font-bold mb-4">About Excellence Institute</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Founded in 1985, Excellence Institute has been at the forefront of higher education, research, and innovation for nearly four decades.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {values.map((value) => (
            <div key={value.title} className="text-center">
              <div className="w-16 h-16 bg-institute-orange rounded-full flex items-center justify-center mx-auto mb-6">
                <value.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-roboto-slab text-2xl font-bold mb-4">{value.title}</h3>
              <p className="text-blue-100 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
        
        {/* Achievements */}
        <div className="mt-20">
          <h3 className="font-roboto-slab text-2xl font-bold text-center mb-12">Recent Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {achievements.map((achievement) => (
              <div key={achievement.label}>
                <div className="text-3xl font-bold text-institute-orange mb-2">{achievement.value}</div>
                <div className="text-blue-200">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
