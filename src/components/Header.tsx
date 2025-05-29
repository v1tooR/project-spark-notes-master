
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          NotesApp
        </Link>
        
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" className="text-gray-600 hover:text-blue-600">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link to="/signup">Cadastrar</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
