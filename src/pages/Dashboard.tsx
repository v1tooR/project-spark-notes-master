
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Plus, CheckCircle, Circle, Calendar, User, LogOut } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  completed: boolean;
  createdAt: string;
}

const Dashboard = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(userData));

    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, [navigate]);

  const handleAddNote = () => {
    if (!newNote.title.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, adicione um título à nota.",
        variant: "destructive",
      });
      return;
    }

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const updatedNotes = [...notes, note];
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));

    setNewNote({ title: "", content: "" });
    setIsDialogOpen(false);

    toast({
      title: "Nota criada!",
      description: "Sua nova nota foi adicionada com sucesso.",
    });
  };

  const toggleNoteCompletion = (id: string) => {
    const updatedNotes = notes.map(note => {
      if (note.id === id) {
        const completed = !note.completed;
        if (completed) {
          // Simular envio de email
          toast({
            title: "Nota finalizada! 📧",
            description: "Um email de confirmação foi enviado para você.",
          });
        }
        return { ...note, completed };
      }
      return note;
    });

    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-blue-600">NotesApp</h1>
            <Badge variant="secondary" className="bg-blue-100 text-blue-600">
              Dashboard
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{user.name}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Bem-vindo de volta, {user.name}! 👋
          </h2>
          <p className="text-gray-600">
            Organize seus projetos e acompanhe o progresso das suas tarefas.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de notas</p>
                  <p className="text-3xl font-bold text-gray-800">{notes.length}</p>
                </div>
                <Circle className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Concluídas</p>
                  <p className="text-3xl font-bold text-green-600">
                    {notes.filter(note => note.completed).length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {notes.filter(note => !note.completed).length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Note Button */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Suas Notas</h3>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nova Nota
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Nota</DialogTitle>
                <DialogDescription>
                  Adicione uma nova nota para organizar seus projetos.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    placeholder="Digite o título da nota..."
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Conteúdo</Label>
                  <Textarea
                    id="content"
                    placeholder="Descreva os detalhes do seu projeto..."
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    rows={4}
                  />
                </div>
                
                <Button onClick={handleAddNote} className="w-full bg-blue-600 hover:bg-blue-700">
                  Criar Nota
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Notes Grid */}
        {notes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="max-w-md mx-auto">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Nenhuma nota ainda
                </h3>
                <p className="text-gray-500 mb-6">
                  Comece criando sua primeira nota para organizar seus projetos.
                </p>
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar primeira nota
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <Card
                key={note.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  note.completed ? "bg-green-50 border-green-200" : "bg-white"
                }`}
                onClick={() => toggleNoteCompletion(note.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className={`text-lg ${note.completed ? "line-through text-green-700" : "text-gray-800"}`}>
                      {note.title}
                    </CardTitle>
                    {note.completed ? (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400 flex-shrink-0" />
                    )}
                  </div>
                  <CardDescription className="text-sm text-gray-500">
                    Criada em {formatDate(note.createdAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className={`text-gray-600 ${note.completed ? "line-through" : ""}`}>
                    {note.content || "Sem descrição"}
                  </p>
                  <div className="mt-4">
                    <Badge variant={note.completed ? "default" : "secondary"} className={note.completed ? "bg-green-600" : ""}>
                      {note.completed ? "Concluída" : "Pendente"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
