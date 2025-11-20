import { Brain, Github, Linkedin, Mail } from "lucide-react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-card/50 backdrop-blur">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-gradient-primary p-2">
                <Brain className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold bg-gradient-primary bg-clip-text text-transparent">
                IntelliCampus
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Smart Campus Analytics powered by AI & Machine Learning
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <NavLink to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Features
                </NavLink>
              </li>
              <li>
                <NavLink to="/demo" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Demo
                </NavLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Documentation</h3>
            <ul className="space-y-2">
              <li>
                <NavLink to="/architecture" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Architecture
                </NavLink>
              </li>
              <li>
                <NavLink to="/api" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  API Docs
                </NavLink>
              </li>
              <li>
                <NavLink to="/ml-design" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  ML Design
                </NavLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" 
                 className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                 className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="mailto:contact@intellicampus.com"
                 className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} IntelliCampus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
