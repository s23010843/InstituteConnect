import { useQuery } from '@tanstack/react-query'
import { Link } from 'wouter'
import { BookOpen, Users, Newspaper, Award, CheckCircle, ArrowRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const Home = () => {
  const { isAuthenticated, user } = useAuth()

  // Fetch recent news and courses for display
  const { data: news = [] } = useQuery({
    queryKey: ['/api/news'],
    select: (data: any[]) => data.slice(0, 3) // Show only latest 3 news items
  })

  const { data: courses = [] } = useQuery({
    queryKey: ['/api/courses'],
    select: (data: any[]) => data.slice(0, 4) // Show only 4 featured courses
  })

  const features = [
    {
      icon: BookOpen,
      title: "Expert-Led Courses",
      description: "Learn from industry professionals with years of real-world experience."
    },
    {
      icon: Users,
      title: "Dedicated Faculty",
      description: "Our experienced educators are committed to your academic success."
    },
    {
      icon: Award,
      title: "Recognized Certification",
      description: "Earn certificates that are valued by employers worldwide."
    },
    {
      icon: CheckCircle,
      title: "Proven Results",
      description: "Join thousands of successful graduates who transformed their careers."
    }
  ]

  const stats = [
    { label: "Students Enrolled", value: "5,000+" },
    { label: "Courses Available", value: "50+" },
    { label: "Expert Faculty", value: "100+" },
    { label: "Success Rate", value: "95%" }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Transform Your Future with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                Quality Education
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Join our premier educational institute and unlock your potential with expert-led courses, 
              practical learning, and career-focused programs.
            </p>
            
            {isAuthenticated ? (
              <div className="space-y-4">
                <p className="text-lg text-blue-200">
                  Welcome back, {user?.firstName || user?.email?.split('@')[0]}!
                </p>
                <Link href="/courses">
                  <a className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                    Browse Courses
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <a className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                    Get Started Today
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Link>
                <Link href="/courses">
                  <a className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                    Explore Courses
                  </a>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Institute?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide more than just education – we offer a complete learning experience 
              designed to help you achieve your goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-4 group-hover:bg-blue-600 transition-colors">
                  <feature.icon className="h-8 w-8 text-blue-600 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      {courses.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Popular Courses
              </h2>
              <p className="text-xl text-gray-600">
                Discover our most sought-after programs
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {courses.map((course: any) => (
                <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {course.imageUrl && (
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {course.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-600 font-semibold">
                        {course.duration}
                      </span>
                      <span className="text-green-600 font-bold">
                        {course.fee}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link href="/courses">
                <a className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  View All Courses
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Latest News */}
      {news.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Latest Updates
              </h2>
              <p className="text-xl text-gray-600">
                Stay informed with our latest news and announcements
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {news.map((article: any) => (
                <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {article.imageUrl && (
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="text-xs text-gray-500">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link href="/news">
                <a className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors">
                  Read More News
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of students who have transformed their careers with our expert-led programs.
          </p>
          
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <a className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                  Enroll Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Link>
              <Link href="/contact">
                <a className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                  Contact Us
                </a>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home