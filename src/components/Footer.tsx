import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <div className="mx-auto flex max-w-7xl justify-center px-4 py-8 sm:px-6 cursor-default">
        <p className="text-center font-medium text-balance">
          {`©${new Date().getFullYear()}`}{" "}
          <Link
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            to={"/"}>
            RoughFrames
          </Link>
          , Made with{" "}
          <div className="relative inline-flex group cursor-pointer">
            <span>❤️</span>
            <span className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-0 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:scale-[8] pointer-events-none">
              🙂 → 😐 → 😵‍💫 → 🫩
            </span>
          </div>{" "}
          by{" "}
          <a
            className="underline"
            target="_blank"
            href="https://github.com/mudgalz">
            Akash
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
