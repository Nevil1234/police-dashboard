"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  MessageSquare,
  Phone,
  Video,
  Mic,
  Image,
  Paperclip,
  Send,
  MoreVertical,
  Clock,
  Check,
  CheckCheck,
} from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

export function CommunicationHub() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [messageInput, setMessageInput] = useState("")
  const isMobile = useIsMobile()

  const contacts: Contact[] = [
    {
      id: 1,
      name: "Jane Doe",
      role: "Complainant",
      caseId: "2023-0456",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      lastMessage: "Thank you for the update, officer.",
      time: "10:45 AM",
      unread: 0,
    },
    {
      id: 2,
      name: "John Smith",
      role: "Witness",
      caseId: "2023-0455",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "offline",
      lastMessage: "I'll be available for follow-up questions tomorrow.",
      time: "Yesterday",
      unread: 2,
    },
    {
      id: 3,
      name: "Officer Rodriguez",
      role: "Police",
      caseId: "2023-0452",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      lastMessage: "Can you assist with the investigation at Westside Park?",
      time: "Yesterday",
      unread: 1,
    },
    {
      id: 4,
      name: "Dispatch",
      role: "Department",
      caseId: "",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      lastMessage: "New case assigned: #2023-0456",
      time: "2 days ago",
      unread: 0,
    },
  ]

  const messages: Message[] = selectedContact
    ? [
        {
          id: 1,
          senderId: 0, // System
          content: `This conversation is related to Case #${selectedContact.caseId}. All communications are encrypted and logged.`,
          timestamp: "10:00 AM",
          status: "delivered",
        },
        {
          id: 2,
          senderId: selectedContact.id,
          content: "Hello Officer, I wanted to follow up on my report from yesterday.",
          timestamp: "10:15 AM",
          status: "delivered",
        },
        {
          id: 3,
          senderId: 999, // Current officer
          content: "Good morning. I've reviewed your case and have some updates for you.",
          timestamp: "10:20 AM",
          status: "read",
        },
        {
          id: 4,
          senderId: selectedContact.id,
          content: "That's great to hear. What's the current status?",
          timestamp: "10:25 AM",
          status: "delivered",
        },
        {
          id: 5,
          senderId: 999, // Current officer
          content:
            "We've identified a potential suspect and are following up on leads. I'll keep you updated as the investigation progresses.",
          timestamp: "10:30 AM",
          status: "read",
        },
        {
          id: 6,
          senderId: selectedContact.id,
          content: "Thank you for the update, officer.",
          timestamp: "10:45 AM",
          status: "delivered",
        },
      ]
    : []

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedContact) return

    // In a real app, this would send the message to the backend
    console.log(`Sending message to ${selectedContact.name}: ${messageInput}`)

    // Clear input
    setMessageInput("")
  }

  return (
    <div
      className={`grid grid-cols-1 ${isMobile ? "grid-cols-1" : "md:grid-cols-3"} gap-4 h-[calc(100vh-12rem)] pb-16 md:pb-0`}
    >
      {(!isMobile || (isMobile && !selectedContact)) && (
        <Card className="md:col-span-1 bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader className="p-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Communications</CardTitle>
              <Button variant="ghost" size="icon">
                <MessageSquare className="h-5 w-5" />
              </Button>
            </div>
            <div className="relative mt-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search contacts..." className="pl-8 bg-gray-50 dark:bg-gray-700" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="all">
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                <TabsTrigger
                  value="all"
                  className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="civilians"
                  className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Civilians
                </TabsTrigger>
                <TabsTrigger
                  value="officers"
                  className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Officers
                </TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="m-0">
                <ScrollArea className={`${isMobile ? "h-[calc(100vh-20rem)]" : "h-[calc(100vh-16rem)]"}`}>
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-muted ${selectedContact?.id === contact.id ? "bg-muted" : ""}`}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={contact.avatar} alt={contact.name} />
                          <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-900 ${contact.status === "online" ? "bg-green-500" : "bg-gray-400"}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{contact.name}</p>
                          <p className="text-xs text-muted-foreground">{contact.time}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground truncate">
                            {contact.role}
                            {contact.caseId ? ` • Case #${contact.caseId}` : ""}
                          </p>
                          {contact.unread > 0 && (
                            <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                              <span className="text-[10px] font-medium text-white">{contact.unread}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-xs truncate">{contact.lastMessage}</p>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {(!isMobile || (isMobile && selectedContact)) && (
        <Card className={`${isMobile ? "col-span-1" : "md:col-span-2"} bg-white dark:bg-gray-800 shadow-sm`}>
          {selectedContact ? (
            <>
              <CardHeader className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isMobile && (
                      <Button variant="ghost" size="icon" className="mr-1" onClick={() => setSelectedContact(null)}>
                        <ArrowLeft className="h-5 w-5" />
                      </Button>
                    )}
                    <Avatar>
                      <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                      <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{selectedContact.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {selectedContact.role}
                        {selectedContact.caseId ? ` • Case #${selectedContact.caseId}` : ""}
                        {" • "}
                        <span className={`${selectedContact.status === "online" ? "text-green-500" : "text-gray-400"}`}>
                          {selectedContact.status === "online" ? "Online" : "Offline"}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex flex-col h-[calc(100vh-16rem)]">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === 999 ? "justify-end" : "justify-start"}`}
                      >
                        {message.senderId !== 0 && message.senderId !== 999 && (
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                            <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.senderId === 0
                              ? "bg-muted text-center w-full text-xs text-muted-foreground"
                              : message.senderId === 999
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div
                            className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                              message.senderId === 999 ? "text-primary-foreground/70" : "text-muted-foreground"
                            }`}
                          >
                            <span>{message.timestamp}</span>
                            {message.senderId === 999 && (
                              <>
                                {message.status === "sent" && <Clock className="h-3 w-3" />}
                                {message.status === "delivered" && <Check className="h-3 w-3" />}
                                {message.status === "read" && <CheckCheck className="h-3 w-3" />}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Image className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Mic className="h-5 w-5" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      className="flex-1 bg-gray-50 dark:bg-gray-700"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button
                      variant="primary"
                      size="icon"
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                  {!isMobile && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          Thank you for your report
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          I'll update you soon
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          Evidence received
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">Select a conversation</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Choose a contact from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}

interface Contact {
  id: number
  name: string
  role: string
  caseId: string
  avatar: string
  status: "online" | "offline"
  lastMessage: string
  time: string
  unread: number
}

interface Message {
  id: number
  senderId: number // 0 for system, 999 for current officer, other IDs for contacts
  content: string
  timestamp: string
  status: "sent" | "delivered" | "read"
}

function ArrowLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  )
}

