import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { Brain, TrendingUp, MessageSquare, BarChart3, ArrowRight } from "lucide-react";
import FeatureCard from "@/components/FeatureCard";
import Login from "./Login";
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
              <NavLink to="/Login">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow">
                  Login
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Features */}
      

      {/* AI Highlights Section */}
      

      {/* CTA Section */}
      
    </div>
  );
};

export default Home;
