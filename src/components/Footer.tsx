import { Brain, Github, Linkedin, Mail } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative border-t border-border/40 bg-card/50 backdrop-blur overflow-hidden">
      {/* Decorative top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Brand Section */}
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-gradient-primary p-1.5 shadow-lg shadow-primary/20">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              IntelliCampus
            </span>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-8">
            {/* <NavLink to="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hover:scale-105 transform duration-200">
              Home
            </NavLink> */}
            {/* Add more links here if needed */}
          </div>

          {/* Right Section: Social & Copyright */}
          <div className="flex items-center gap-6">
            <div className="flex gap-4 border-r border-border/40 pr-6 mr-2">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="group text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5 transform group-hover:scale-110 transition-transform" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="group text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5 transform group-hover:scale-110 transition-transform" />
              </a>
              <a href="mailto:contact@intellicampus.com"
                className="group text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5 transform group-hover:scale-110 transition-transform" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground whitespace-nowrap">
              &copy; {new Date().getFullYear()} IntelliCampus
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
