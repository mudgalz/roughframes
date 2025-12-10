import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <div className="mx-auto flex max-w-7xl justify-center px-4 py-8 sm:px-6">
        <p className="text-center font-medium text-balance">
          {`©${new Date().getFullYear()}`}{" "}
          <Link
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            to={"/"}>
            Dotmarky
          </Link>
          , Made with ❤️ by{" "}
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
