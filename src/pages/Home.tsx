import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { Brain, TrendingUp, MessageSquare, BarChart3, ArrowRight } from "lucide-react";
import FeatureCard from "@/components/FeatureCard";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJoc2woMjM5IDg0JSA2NyUgLyAwLjEpIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
            <div className="inline-block">
              <div className="flex items-center gap-2 bg-card/50 backdrop-blur border border-border/40 rounded-full px-4 py-2">
                <Brain className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">AI-Powered Campus Analytics</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Transform Your Campus with{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                IntelliCampus
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Smart attendance tracking, marks analytics, and AI-powered insights to help students succeed
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <NavLink to="/features">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow">
                  Explore Features
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </NavLink>
              <NavLink to="/demo">
                <Button size="lg" variant="outline" className="border-border/40 hover:bg-card/50">
                  View Demo
                </Button>
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Features */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={BarChart3}
            title="Attendance Tracking"
            description="Real-time attendance monitoring with automatic calculations and predictions"
          />
          <FeatureCard
            icon={TrendingUp}
            title="Marks Analytics"
            description="Comprehensive marks tracking with trend analysis and performance insights"
          />
          <FeatureCard
            icon={MessageSquare}
            title="AI Chatbot"
            description="Natural language queries for instant access to your academic data"
          />
          <FeatureCard
            icon={Brain}
            title="ML Predictions"
            description="Predict future attendance and marks using advanced machine learning models"
          />
        </div>
      </section>

      {/* AI Highlights Section */}
      <section className="py-20 bg-card/30 border-y border-border/40">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Powered by Advanced{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                AI Technology
              </span>
            </h2>
            <p className="text-lg text-muted-foreground">
              IntelliCampus leverages cutting-edge machine learning models, RAG (Retrieval-Augmented Generation), 
              and LLM function calling to provide intelligent, context-aware responses to your academic queries.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">75%</div>
                <p className="text-sm text-muted-foreground">
                  Auto-calculate classes needed to reach attendance threshold
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">RAG</div>
                <p className="text-sm text-muted-foreground">
                  Retrieval-Augmented Generation for accurate, context-aware responses
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">ML</div>
                <p className="text-sm text-muted-foreground">
                  Machine Learning models for attendance and marks prediction
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6 p-8 rounded-2xl bg-gradient-primary/10 border border-primary/20">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Experience IntelliCampus?
          </h2>
          <p className="text-lg text-muted-foreground">
            Explore our comprehensive documentation, try the demo, or get in touch with us
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NavLink to="/architecture">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                View Architecture
              </Button>
            </NavLink>
            <NavLink to="/contact">
              <Button size="lg" variant="outline" className="border-border/40">
                Contact Us
              </Button>
            </NavLink>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
