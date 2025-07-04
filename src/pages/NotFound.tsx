import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100"
      data-oid="3uazj8a"
    >
      <div className="text-center" data-oid="_fsvfnw">
        <h1 className="text-4xl font-bold mb-4" data-oid="bwzsfdx">
          404
        </h1>
        <p className="text-xl text-gray-600 mb-4" data-oid="0ilzp0t">
          Oops! Page not found
        </p>
        <a
          href="/"
          className="text-blue-500 hover:text-blue-700 underline"
          data-oid="m5jwfvy"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
