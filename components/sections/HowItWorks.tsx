import { Search, ShoppingCart, FileText, CheckCircle } from 'lucide-react';
import Card from '../ui/Card';

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Browse Study Guides',
    description:
      'Explore our comprehensive collection of nursing study guides organized by category and exam type.',
  },
  {
    number: '02',
    icon: ShoppingCart,
    title: 'Choose & Purchase',
    description: 'Select the study guides you need and complete a quick, secure checkout process.',
  },
  {
    number: '03',
    icon: FileText,
    title: 'Download & Study',
    description: 'Get instant access to your purchased guides and start studying immediately.',
  },
  {
    number: '04',
    icon: CheckCircle,
    title: 'Ace Your Exam',
    description:
      'Study with confidence using our proven materials and pass your exams with flying colors.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Getting started is simple. Follow these four easy steps to begin your journey to exam
            success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-20 left-full w-full h-0.5 bg-gradient-to-r from-primary-200 to-transparent -z-10" />
                )}

                <Card className="text-center h-full">
                  <div className="text-6xl font-black text-primary-100 mb-4">{step.number}</div>

                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
