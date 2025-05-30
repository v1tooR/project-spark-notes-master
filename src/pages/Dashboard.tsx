import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, CheckCircle, Circle, Calendar, User, LogOut, Edit } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Note {
  id: string;
  title: string;
  content: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface Profile {
  id: string;
  name: string;
  email: string;
}

const Dashboard = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchNotes();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as notas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.title.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, adicione um título à nota.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          title: newNote.title,
          content: newNote.content,
          user_id: user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      setNotes([data, ...notes]);
      setNewNote({ title: "", content: "" });
      setIsDialogOpen(false);

      toast({
        title: "Nota criada!",
        description: "Sua nova nota foi adicionada com sucesso.",
      });
    } catch (error) {
      console.error('Error creating note:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a nota.",
        variant: "destructive",
      });
    }
  };

  const handleEditNote = async () => {
    if (!editingNote || !editingNote.title.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, adicione um título à nota.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('notes')
        .update({
          title: editingNote.title,
          content: editingNote.content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingNote.id)
        .select()
        .single();

      if (error) throw error;

      setNotes(notes.map(note => note.id === editingNote.id ? data : note));
      setEditingNote(null);
      setIsEditDialogOpen(false);

      toast({
        title: "Nota atualizada!",
        description: "Sua nota foi editada com sucesso.",
      });
    } catch (error) {
      console.error('Error updating note:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a nota.",
        variant: "destructive",
      });
    }
  };

  const toggleNoteCompletion = async (noteId: string, completed: boolean) => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .update({ 
          completed: !completed,
          updated_at: new Date().toISOString(),
        })
        .eq('id', noteId)
        .select()
        .single();

      if (error) throw error;

      setNotes(notes.map(note => note.id === noteId ? data : note));

      // Se a tarefa foi marcada como concluída, enviar para N8N
      if (!completed) {
        try {
          const webhookUrl = "https://v1toor.app.n8n.cloud/webhook-test/testevictor";
          
          const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              taskId: noteId,
              title: data.title,
              content: data.content,
              completedAt: new Date().toISOString(),
              userId: user?.id,
              userEmail: user?.email,
              userName: profile?.name,
            }),
          });

          console.log("Webhook N8N enviado:", response.status);

          toast({
            title: "Nota finalizada! ✅",
            description: "Tarefa concluída e notificação enviada para N8N.",
          });
        } catch (webhookError) {
          console.error("Erro ao enviar webhook para N8N:", webhookError);
          
          toast({
            title: "Nota finalizada! ⚠️",
            description: "Tarefa concluída, mas houve erro ao enviar notificação.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Nota reaberta",
          description: "A tarefa foi marcada como pendente novamente.",
        });
      }
    } catch (error) {
      console.error('Error updating note:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a nota.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const openEditDialog = (note: Note) => {
    setEditingNote({ ...note });
    setIsEditDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando suas notas...</p>
        </div>
      </div>
    );
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
              <span className="hidden sm:inline">{profile?.name || 'Usuário'}</span>
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
            Bem-vindo de volta, {profile?.name || 'Usuário'}! 👋
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

        {/* Edit Note Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Nota</DialogTitle>
              <DialogDescription>
                Faça as alterações necessárias na sua nota.
              </DialogDescription>
            </DialogHeader>
            
            {editingNote && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Título</Label>
                  <Input
                    id="edit-title"
                    placeholder="Digite o título da nota..."
                    value={editingNote.title}
                    onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-content">Conteúdo</Label>
                  <Textarea
                    id="edit-content"
                    placeholder="Descreva os detalhes do seu projeto..."
                    value={editingNote.content || ''}
                    onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                    rows={4}
                  />
                </div>
                
                <Button onClick={handleEditNote} className="w-full bg-blue-600 hover:bg-blue-700">
                  Salvar Alterações
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

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
                className={`transition-all hover:shadow-lg ${
                  note.completed ? "bg-green-50 border-green-200" : "bg-white"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className={`text-lg ${note.completed ? "line-through text-green-700" : "text-gray-800"}`}>
                      {note.title}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(note)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <button
                        onClick={() => toggleNoteCompletion(note.id, note.completed)}
                        className="flex-shrink-0"
                      >
                        {note.completed ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  <CardDescription className="text-sm text-gray-500">
                    Criada em {formatDate(note.created_at)}
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
