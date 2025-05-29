
import { Button } from "@/components/ui/button";
import { CheckCircle, Target, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Organize seus projetos com inteligência
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            A ferramenta definitiva para empreendedores que querem transformar ideias em resultados. 
            Gerencie notas, projetos e tarefas em um só lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
              <Link to="/signup">Começar gratuitamente</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg border-blue-600 text-blue-600 hover:bg-blue-50">
              <Link to="/login">Fazer login</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">
            Tudo que você precisa para ser mais produtivo
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Foco no que importa</h3>
              <p className="text-gray-600">
                Organize suas ideias e projetos de forma clara e objetiva. Mantenha o foco nos resultados.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Acompanhe o progresso</h3>
              <p className="text-gray-600">
                Marque tarefas como concluídas e receba notificações automáticas por email.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Máxima produtividade</h3>
              <p className="text-gray-600">
                Interface intuitiva e rápida que se adapta ao seu fluxo de trabalho empreendedor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Pronto para revolucionar sua produtividade?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de empreendedores que já transformaram suas ideias em negócios de sucesso.
          </p>
          <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg">
            <Link to="/signup">Começar agora</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">NotesApp</h3>
          <p className="text-gray-400">
            © 2024 NotesApp. Transformando ideias em resultados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
