import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-[160px] font-extrabold text-primary leading-none drop-shadow-lg">
        404
      </h1>

      <p className="text-2xl text-muted-foreground mt-4 mb-8">
        Oops! The page you're looking for doesn't exist.
      </p>

      <Link to="/">
        <Button size={"lg"}>Go Back Home</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
