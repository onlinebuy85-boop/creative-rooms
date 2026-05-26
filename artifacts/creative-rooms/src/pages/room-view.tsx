import { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "wouter";
import { 
  useGetRoom, 
  useGetRoomMembers, 
  useGetRoomMessages, 
  useGetRoomDemos,
  useSendMessage,
  useUploadDemo,
  useGetMyProfile,
  useJoinRoom,
  useLeaveRoom,
  getGetRoomMessagesQueryKey
} from "@workspace/api-client-react";
import { useWebSocket } from "@/hooks/use-websocket";
import { useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Send, Music2, Users, Loader2, ArrowLeft, Headphones, UploadCloud, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function RoomPage() {
  const params = useParams<{ id: string }>();
  const roomId = Number(params.id);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const { data: profile } = useGetMyProfile();
  const { data: room, isLoading: roomLoading } = useGetRoom(roomId, { query: { enabled: !!roomId, queryKey: ['getRoom', roomId] } });
  const { data: members, isLoading: membersLoading } = useGetRoomMembers(roomId, { query: { enabled: !!roomId, queryKey: ['getRoomMembers', roomId] } });
  const { data: messages, isLoading: messagesLoading } = useGetRoomMessages(roomId, { query: { enabled: !!roomId, queryKey: ['getRoomMessages', roomId] } });
  const { data: demos, isLoading: demosLoading } = useGetRoomDemos(roomId, { query: { enabled: !!roomId, queryKey: ['getRoomDemos', roomId] } });

  const joinRoom = useJoinRoom();
  const leaveRoom = useLeaveRoom();
  const sendMessage = useSendMessage();

  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  const { isConnected } = useWebSocket(`${basePath}/ws`, (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'message' && data.roomId === roomId) {
        queryClient.invalidateQueries({ queryKey: getGetRoomMessagesQueryKey(roomId) });
      }
    } catch (e) {
      console.error('Failed to parse WS message', e);
    }
  });

  const isMember = members?.some(m => m.profileId === profile?.id);
  const isOwner = room?.ownerId === profile?.id;
  const isFull = (room?.memberCount || 0) >= (room?.maxMembers || 0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !isMember) return;

    sendMessage.mutate(
      { id: roomId, data: { content: messageInput.trim() } },
      {
        onSuccess: () => {
          setMessageInput("");
          queryClient.invalidateQueries({ queryKey: getGetRoomMessagesQueryKey(roomId) });
        }
      }
    );
  };

  const handleJoin = () => {
    joinRoom.mutate(
      { id: roomId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['getRoomMembers', roomId] });
          queryClient.invalidateQueries({ queryKey: ['getRoom', roomId] });
        }
      }
    );
  };

  const handleLeave = () => {
    leaveRoom.mutate(
      { id: roomId },
      {
        onSuccess: () => {
          setLocation("/dashboard");
        }
      }
    );
  };

  const getCoverArt = (id: number) => {
    return id % 2 === 0 
      ? "/assets/images/room-cover-1.png"
      : "/assets/images/room-cover-2.png";
  };

  if (roomLoading || !room) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-background relative overflow-hidden">
      <div className="bg-noise" />
      
      {/* Top Navigation Bar */}
      <header className="h-14 border-b border-border/40 bg-background/80 backdrop-blur-md flex items-center justify-between px-4 z-20 shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setLocation("/dashboard")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} title={isConnected ? 'Connected' : 'Disconnected'} />
            <h1 className="font-serif text-lg tracking-tight font-medium line-clamp-1">{room.name}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-background/50 border-border/50 hidden sm:inline-flex text-xs font-normal">
            <Users className="w-3 h-3 mr-1" /> {room.memberCount} / {room.maxMembers}
          </Badge>
          
          {isMember ? (
            <Button variant="ghost" size="sm" onClick={handleLeave} className="h-8 text-muted-foreground hover:text-destructive text-xs">
              <LogOut className="w-3.5 h-3.5 mr-1.5 hidden sm:inline" /> Leave
            </Button>
          ) : (
            <Button 
              size="sm" 
              onClick={handleJoin} 
              disabled={joinRoom.isPending || isFull}
              className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
            >
              {joinRoom.isPending ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : null}
              {isFull ? "Room Full" : "Join Session"}
            </Button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        
        {/* Left Sidebar - Details & Members */}
        <aside className="w-64 border-r border-border/40 bg-card/20 backdrop-blur hidden md:flex flex-col overflow-y-auto">
          <div className="relative h-40 shrink-0">
            <img 
              src={room.coverImageUrl || getCoverArt(room.id)} 
              alt={room.name} 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          </div>
          
          <div className="p-4 -mt-12 relative z-10 flex-1 flex flex-col">
            <h2 className="font-serif text-xl mb-1 text-foreground drop-shadow-md">{room.name}</h2>
            {room.vibe && <p className="text-primary text-sm font-medium mb-3">{room.vibe}</p>}
            
            {room.description && (
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed line-clamp-4">
                {room.description}
              </p>
            )}

            <div className="flex flex-wrap gap-1.5 mb-6">
              {room.genres?.map(genre => (
                <Badge key={genre} variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-muted/50 text-muted-foreground border-transparent">
                  {genre}
                </Badge>
              ))}
            </div>

            <div className="mt-auto">
              <h3 className="text-xs font-medium text-foreground/80 uppercase tracking-wider mb-3 flex items-center">
                <Users className="w-3 h-3 mr-1.5" /> Members ({members?.length || 0})
              </h3>
              
              <div className="space-y-3">
                {membersLoading ? (
                  [1,2,3].map(i => <Skeleton key={i} className="h-8 w-full bg-muted/30" />)
                ) : (
                  members?.map(member => (
                    <div key={member.id} className="flex items-center gap-2">
                      <Avatar className="w-6 h-6 border border-border/50">
                        <AvatarImage src={member.avatarUrl || undefined} />
                        <AvatarFallback className="text-[10px]">{member.displayName?.charAt(0) || '?'}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-medium truncate">{member.displayName}</span>
                        <span className="text-[10px] text-muted-foreground">{member.role}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Center Area - Chat & Tabs */}
        <div className="flex-1 flex flex-col min-w-0 bg-background/50">
          
          {!isMember && (
            <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 text-center">
              <div className="max-w-md p-8 rounded-xl border border-border/50 bg-card/50 shadow-2xl">
                <Headphones className="w-12 h-12 text-primary/80 mx-auto mb-4" />
                <h3 className="font-serif text-2xl mb-2">Outside looking in</h3>
                <p className="text-muted-foreground mb-6 font-light">
                  You need to join this session to see the chat, listen to demos, and participate.
                </p>
                <Button 
                  size="lg" 
                  onClick={handleJoin} 
                  disabled={joinRoom.isPending || isFull}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {joinRoom.isPending ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
                  {isFull ? "Room is at capacity" : "Join Session"}
                </Button>
              </div>
            </div>
          )}

          <Tabs defaultValue="chat" className="flex-1 flex flex-col h-full">
            <div className="px-4 pt-2 border-b border-border/40 shrink-0">
              <TabsList className="bg-transparent border-none p-0 space-x-6 h-auto">
                <TabsTrigger 
                  value="chat" 
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2 pt-1 text-muted-foreground data-[state=active]:text-foreground"
                >
                  Conversation
                </TabsTrigger>
                <TabsTrigger 
                  value="demos" 
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2 pt-1 text-muted-foreground data-[state=active]:text-foreground"
                >
                  Demos & Ideas <Badge variant="secondary" className="ml-1.5 bg-primary/10 text-primary h-4 px-1">{demos?.length || 0}</Badge>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="chat" className="flex-1 flex flex-col m-0 overflow-hidden outline-none data-[state=inactive]:hidden">
              <ScrollArea className="flex-1 p-4 md:p-6 h-full">
                <div className="space-y-6 max-w-3xl mx-auto pb-4">
                  {messagesLoading ? (
                    <div className="space-y-4">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="flex gap-3">
                          <Skeleton className="w-8 h-8 rounded-full bg-muted/30" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-24 bg-muted/30" />
                            <Skeleton className="h-16 w-full max-w-md bg-muted/30 rounded-2xl rounded-tl-sm" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : messages?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                      <Music2 className="w-8 h-8 mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">The room is silent. Start the conversation.</p>
                    </div>
                  ) : (
                    messages?.map((msg, i) => {
                      const isMe = msg.profileId === profile?.id;
                      const showHeader = i === 0 || messages[i-1].profileId !== msg.profileId || new Date(msg.createdAt).getTime() - new Date(messages[i-1].createdAt).getTime() > 300000;
                      
                      return (
                        <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                          {showHeader ? (
                            <Avatar className="w-8 h-8 shrink-0 mt-1 border border-border/50">
                              <AvatarImage src={msg.senderAvatarUrl || undefined} />
                              <AvatarFallback className="text-xs bg-muted/50">{msg.senderName?.charAt(0) || '?'}</AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="w-8 shrink-0" />
                          )}
                          
                          <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                            {showHeader && (
                              <div className="flex items-baseline gap-2 mb-1 px-1">
                                <span className="text-xs font-medium text-foreground/80">{msg.senderName}</span>
                                <span className="text-[10px] text-muted-foreground">{format(new Date(msg.createdAt), 'h:mm a')}</span>
                              </div>
                            )}
                            <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                              isMe 
                                ? 'bg-primary text-primary-foreground rounded-tr-sm shadow-[0_2px_10px_-4px_rgba(217,119,54,0.3)]' 
                                : 'bg-card/50 backdrop-blur text-foreground border border-border/40 rounded-tl-sm'
                            }`}>
                              {msg.content}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <div className="p-4 bg-background/80 backdrop-blur-md border-t border-border/40 shrink-0">
                <form onSubmit={handleSendMessage} className="flex gap-2 max-w-3xl mx-auto">
                  <Input 
                    placeholder="Type a message..." 
                    className="flex-1 bg-card/30 border-border/50 focus-visible:ring-primary h-12 rounded-full px-5 shadow-inner"
                    value={messageInput}
                    onChange={e => setMessageInput(e.target.value)}
                    disabled={sendMessage.isPending || !isMember}
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    className="h-12 w-12 rounded-full shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md disabled:opacity-50"
                    disabled={!messageInput.trim() || sendMessage.isPending || !isMember}
                  >
                    <Send className="w-5 h-5 ml-1" />
                  </Button>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="demos" className="flex-1 flex flex-col m-0 outline-none p-4 md:p-6 data-[state=inactive]:hidden overflow-y-auto">
              <div className="max-w-4xl mx-auto w-full space-y-6">
                <div className="flex justify-between items-center bg-card/30 p-4 rounded-xl border border-border/40 backdrop-blur">
                  <div>
                    <h3 className="text-sm font-medium text-foreground">Share an idea</h3>
                    <p className="text-xs text-muted-foreground">Upload a demo, riff, or stem for the room.</p>
                  </div>
                  <Button size="sm" variant="outline" className="h-8 border-border/50 text-xs">
                    <UploadCloud className="w-3.5 h-3.5 mr-1.5" /> Upload Demo
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {demosLoading ? (
                    [1,2].map(i => <Skeleton key={i} className="h-24 rounded-xl bg-muted/30" />)
                  ) : demos?.length === 0 ? (
                    <div className="col-span-full py-12 text-center border border-dashed border-border/40 rounded-xl bg-card/10">
                      <Music2 className="w-8 h-8 mx-auto text-muted-foreground mb-3 opacity-50" />
                      <p className="text-sm text-muted-foreground">No demos shared yet.</p>
                    </div>
                  ) : (
                    demos?.map(demo => (
                      <div key={demo.id} className="p-4 rounded-xl border border-border/40 bg-card/40 hover:bg-card/60 transition-colors flex gap-4 items-center group">
                        <Button size="icon" variant="secondary" className="h-12 w-12 rounded-full shrink-0 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <Music2 className="w-5 h-5" />
                        </Button>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-medium text-foreground truncate">{demo.title}</h4>
                          <p className="text-xs text-muted-foreground truncate mb-1">{demo.description || 'No description'}</p>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span>{demo.uploaderName}</span>
                            <span>•</span>
                            <span>{format(new Date(demo.createdAt), 'MMM d, yyyy')}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
