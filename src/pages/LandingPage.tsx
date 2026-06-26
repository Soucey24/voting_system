import { Link } from 'react-router-dom';
import {
  Shield,
  ScanFace,
  BarChart3,
  Clock,
  Users,
  Lock,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Building2,
  GraduationCap,
  Vote,
  Smartphone
} from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-blue-100 text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                <span>Secure & Transparent Elections</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6">
                University Electronic
                <span className="block mt-2 bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
                  Voting System
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-blue-100 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                Experience secure, transparent, and biometric-powered elections. Your vote matters, and we ensure every vote counts with state-of-the-art facial verification technology.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 rounded-xl font-semibold text-base transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <span>Register to Vote</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl font-semibold text-base transition-all"
                >
                  <span>Learn More</span>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-12">
                {[
                  { icon: Shield, label: 'Secure', value: '100%' },
                  { icon: Users, label: 'Students', value: '5000+' },
                  { icon: Vote, label: 'Elections', value: '50+' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <stat.icon className="w-6 h-6 mx-auto mb-2 text-blue-200" />
                    <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-blue-200">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="relative w-full max-w-lg mx-auto">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-3xl blur-2xl opacity-30"></div>
                <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                      <ScanFace className="w-16 h-16 text-white" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 bg-white/20 rounded-full w-full"></div>
                    <div className="h-4 bg-white/20 rounded-full w-3/4"></div>
                    <div className="h-4 bg-white/20 rounded-full w-1/2"></div>
                  </div>
                  <div className="mt-8 flex justify-center">
                    <div className="flex items-center gap-2 text-white">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <span className="font-medium">Facial Verification Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full"></div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Our System?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built with modern technology and security at its core, our voting system ensures every vote is counted accurately and transparently.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: ScanFace,
                title: 'Facial Verification',
                description: 'Advanced biometric authentication ensures only verified students can cast their votes, eliminating fraud.',
                color: 'bg-blue-500',
              },
              {
                icon: Shield,
                title: 'Bank-Grade Security',
                description: 'End-to-end encryption and secure data handling protect your vote at every step of the process.',
                color: 'bg-green-500',
              },
              {
                icon: BarChart3,
                title: 'Real-Time Results',
                description: 'Watch election results unfold in real-time with transparent and auditable vote counting.',
                color: 'bg-purple-500',
              },
              {
                icon: Clock,
                title: '24/7 Accessibility',
                description: 'Vote anytime during the election period from any device with internet access.',
                color: 'bg-orange-500',
              },
              {
                icon: Smartphone,
                title: 'Mobile Responsive',
                description: 'Access the system seamlessly from your smartphone, tablet, or computer.',
                color: 'bg-pink-500',
              },
              {
                icon: Lock,
                title: 'Privacy Protected',
                description: 'Your vote remains anonymous while the system verifies your identity for security.',
                color: 'bg-indigo-500',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
              Process
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A simple and secure voting process designed for university students.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                step: '01',
                icon: GraduationCap,
                title: 'Register',
                description: 'Create your account using your student ID and university email.',
              },
              {
                step: '02',
                icon: ScanFace,
                title: 'Enroll Face',
                description: 'Complete facial enrollment for secure identity verification.',
              },
              {
                step: '03',
                icon: Vote,
                title: 'Cast Your Vote',
                description: 'Select your preferred candidates and submit your vote.',
              },
              {
                step: '04',
                icon: CheckCircle2,
                title: 'Confirmation',
                description: 'Receive instant confirmation that your vote was recorded.',
              },
            ].map((item, index) => (
              <div key={item.step} className="relative">
                {index < 3 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-blue-400 -translate-y-1/2 z-0" style={{ width: 'calc(100% - 4rem)' }}></div>
                )}
                <div className="relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-4xl font-bold text-gray-200 group-hover:text-blue-200 transition-colors">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
                About Us
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Empowering Democracy in Higher Education
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                The University Electronic Voting System was developed to modernize student elections, ensuring fairness, transparency, and accessibility for all students.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our platform supports SRC Elections, Faculty Elections, and Department Elections, giving every student a voice in their governance.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Building2, label: 'Faculties', value: '10+' },
                  { icon: Users, label: 'Departments', value: '40+' },
                  { icon: GraduationCap, label: 'Students', value: '5000+' },
                  { icon: Vote, label: 'Elections Held', value: '50+' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-200">
                    <stat.icon className="w-6 h-6 text-blue-500 mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-blue-200 rounded-3xl blur-2xl opacity-40"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-2xl p-6 text-center">
                    <Vote className="w-10 h-10 mx-auto mb-3 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">SRC Elections</h4>
                    <p className="text-sm text-gray-500 mt-1">Student Representative Council</p>
                  </div>
                  <div className="bg-green-50 rounded-2xl p-6 text-center">
                    <Building2 className="w-10 h-10 mx-auto mb-3 text-green-600" />
                    <h4 className="font-semibold text-gray-900">Faculty Elections</h4>
                    <p className="text-sm text-gray-500 mt-1">Academic Leadership</p>
                  </div>
                  <div className="bg-purple-50 rounded-2xl p-6 text-center">
                    <Users className="w-10 h-10 mx-auto mb-3 text-purple-600" />
                    <h4 className="font-semibold text-gray-900">Department Elections</h4>
                    <p className="text-sm text-gray-500 mt-1">Departmental Leaders</p>
                  </div>
                  <div className="bg-orange-50 rounded-2xl p-6 text-center">
                    <Shield className="w-10 h-10 mx-auto mb-3 text-orange-600" />
                    <h4 className="font-semibold text-gray-900">Secure Platform</h4>
                    <p className="text-sm text-gray-500 mt-1">Bank-grade Security</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 lg:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Get answers to common questions about our electronic voting system.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: 'How does facial verification work?',
                answer: 'During registration, you\'ll capture a photo of your face. Our system uses advanced AI to create a unique facial template. When voting, you\'ll verify your identity with a quick face scan, ensuring only you can cast your vote.',
              },
              {
                question: 'Is my vote anonymous?',
                answer: 'Yes, absolutely. While we verify your identity to prevent fraud, your actual vote is encrypted and separated from your identity. No one can link your vote back to you personally.',
              },
              {
                question: 'What devices can I use to vote?',
                answer: 'You can vote from any device with a camera and internet connection - smartphone, tablet, laptop, or desktop computer. The system is fully responsive and works on all modern browsers.',
              },
              {
                question: 'How do I register to vote?',
                answer: 'Click the "Register" button, enter your student ID and university email, complete facial enrollment, and you\'re ready to participate in upcoming elections.',
              },
              {
                question: 'What if I have problems during voting?',
                answer: 'Our support team is available throughout the election period. You can contact us via email, phone, or visit the help desk at the main administration building.',
              },
              {
                question: 'Can I change my vote after casting it?',
                answer: 'No, once your vote is submitted and confirmed, it cannot be changed. This ensures the integrity of the election process. Please review your selections carefully before submitting.',
              },
            ].map((faq, index) => (
              <details key={index} className="group bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <HelpCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed pl-9">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Make Your Voice Heard?
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Register now and participate in upcoming elections. Your vote matters in shaping the future of our university community.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            <span>Register Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
