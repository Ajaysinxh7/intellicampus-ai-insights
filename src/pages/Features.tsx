import SectionHeader from "@/components/SectionHeader";
import { 
  Calendar, TrendingUp, MessageSquare, Brain, 
  BarChart3, Target, Sparkles, Database 
} from "lucide-react";
import FeatureCard from "@/components/FeatureCard";
import { Card } from "@/components/ui/card";

const Features = () => {
  const mainFeatures = [
    {
      icon: Calendar,
      title: "Smart Attendance Tracking",
      description: "Monitor attendance across all subjects with real-time updates. Automatically calculate attendance percentages and predict how many classes you need to attend to reach 75%."
    },
    {
      icon: TrendingUp,
      title: "Comprehensive Marks Analytics",
      description: "Track your academic performance across all subjects. View trends, analyze patterns, and get insights into your strengths and areas for improvement."
    },
    {
      icon: MessageSquare,
      title: "AI-Powered Chatbot",
      description: "Ask questions in natural language and get instant, accurate responses about your attendance, marks, predictions, and personalized study recommendations."
    },
    {
      icon: Brain,
      title: "ML-Based Predictions",
      description: "Advanced machine learning models predict your future attendance and marks based on historical data, helping you plan ahead and stay on track."
    },
    {
      icon: Sparkles,
      title: "RAG + LLM Integration",
      description: "Retrieval-Augmented Generation (RAG) ensures responses are accurate and contextual by fetching relevant data from your academic records before generating answers."
    },
    {
      icon: Database,
      title: "Secure Data Storage",
      description: "All your academic data is securely stored in PostgreSQL with proper encryption. Access your information anytime, anywhere through our responsive dashboards."
    }
  ];

  const capabilities = [
    {
      title: "Natural Language Queries",
      description: "Ask questions like 'What's my attendance in Mathematics?' or 'How many classes do I need to attend to reach 75%?' and get instant answers.",
      icon: MessageSquare
    },
    {
      title: "Predictive Analytics",
      description: "Our ML models analyze your patterns to predict future attendance and marks, giving you actionable insights to improve your performance.",
      icon: BarChart3
    },
    {
      title: "Personalized Recommendations",
      description: "Get customized study plans, attendance goals, and performance improvement suggestions based on your unique academic profile.",
      icon: Target
    }
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Powerful Features"
          subtitle="Everything you need to track, analyze, and improve your academic performance"
          centered
        />

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {mainFeatures.map((feature, index) => (
            <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>

        {/* Capabilities Section */}
        <div className="mb-20">
          <SectionHeader
            title="Key Capabilities"
            subtitle="How IntelliCampus helps you succeed"
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {capabilities.map((capability, index) => {
              const Icon = capability.icon;
              return (
                <Card key={index} className="p-8 bg-card/50 border-border/40 backdrop-blur text-center hover:shadow-card-glow transition-all duration-300">
                  <div className="rounded-full bg-gradient-primary p-4 w-fit mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{capability.title}</h3>
                  <p className="text-muted-foreground">{capability.description}</p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Technical Highlights */}
        <Card className="p-8 bg-gradient-primary/10 border-primary/20">
          <h3 className="text-2xl font-bold mb-6 text-center">Technical Highlights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Attendance Formula</h4>
              <code className="block bg-card/50 p-3 rounded-lg text-sm">
                classes_needed = ceil((target% × total - present) / (target% - 1))
              </code>
              <p className="text-sm text-muted-foreground">
                Automatically calculate how many classes you need to attend to reach your target attendance percentage
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Function Calling</h4>
              <code className="block bg-card/50 p-3 rounded-lg text-sm">
                get_attendance(student_id, subject?)
              </code>
              <p className="text-sm text-muted-foreground">
                LLM intelligently calls specific functions based on your natural language queries
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">RAG Pipeline</h4>
              <p className="text-sm text-muted-foreground">
                Vector embeddings + similarity search → Retrieve relevant context → Generate accurate, personalized responses
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">ML Models</h4>
              <p className="text-sm text-muted-foreground">
                Linear Regression & Decision Trees for attendance prediction | Random Forest for marks prediction with 85%+ accuracy
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Features;
