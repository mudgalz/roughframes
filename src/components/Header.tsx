import { Github } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <header className="sticky top-0 z-40 transition-all backdrop-blur-md">
      <div className="py-2 flex justify-between items-center px-4 max-w-7xl mx-auto">
        <Link to="/">
          <h1 className="text-2xl font-semibold">RoughFrames</h1>
        </Link>

        <a href="https://github.com/mudgalz/rough-frames">
          <Button variant="ghost">
            <span>
              <Github />
            </span>
            Github
          </Button>
        </a>
      </div>
    </header>
  );
};

export default Header;
