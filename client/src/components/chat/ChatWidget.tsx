// src/components/chat/ChatWidget.tsx
import React, { useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

type CommandCallback = (type: string) => void;

interface ChatWidgetProps {
  onCommand: CommandCallback;
}

export default function ChatWidget({ onCommand }: ChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { text: string; sender: "user" | "bot" }[]
  >([
    { text: "Hi! Ask me to add furniture, e.g. 'add bed' or 'add lamp'.", sender: "bot" },
  ]);

  const parserRules: { keywords: string[]; reply: string; cmd?: string }[] = [
    { keywords: ["bed"], reply: "Adding a bed to the current room.", cmd: "bed" },
    { keywords: ["sofa"], reply: "Adding a sofa to the current room.", cmd: "sofa" },
    { keywords: ["chair"], reply: "Adding a chair to the room.", cmd: "chair" },
    { keywords: ["table"], reply: "Adding a table to the room.", cmd: "table" },
    { keywords: ["lamp"], reply: "Adding a lamp for better lighting.", cmd: "lamp" },
    { keywords: ["plant"], reply: "Adding a plant for decor.", cmd: "plant" },
    { keywords: ["bookshelf", "bookcase"], reply: "Adding a bookshelf.", cmd: "bookshelf" },
    { keywords: ["wardrobe", "closet"], reply: "Adding a wardrobe.", cmd: "wardrobe" },
     {
    keywords: ["help", "commands", "what can you do"],
    reply: "You can ask me to add furniture like a bed, sofa, lamp, or chair. Soon, I’ll help with decor tips too!",
  },
  {
    keywords: ["list", "show", "available", "furniture"],
    reply: "Available furniture includes: bed, sofa, chair, table, lamp, plant, bookshelf, and wardrobe.",
  },
  {
    keywords: ["reset", "clear", "remove all"],
    reply: "Okay! I’ll clear all furniture from the room.",
    cmd: "reset",
  },
  {
    keywords: ["save"],
    reply: "Got it! Saving your room design.",
    cmd: "save",
  },
  {
    keywords: ["load"],
    reply: "Loading your last saved design.",
    cmd: "load",
  },
  {
    keywords: ["color", "wall", "paint"],
    reply: "Currently I can’t paint walls, but that feature is coming soon!",
  },
  ];

  function postBot(text: string) {
    setMessages((m) => [...m, { text, sender: "bot" }]);
  }
  function postUser(text: string) {
    setMessages((m) => [...m, { text, sender: "user" }]);
  }

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    postUser(trimmed);

    const lower = trimmed.toLowerCase();
    const found = parserRules.find((rule) =>
      rule.keywords.some((k) => lower.includes(k))
    );

    if (found) {
      postBot(found.reply);
      if (found.cmd) onCommand(found.cmd);
    } else {
const fallbackReplies = [
  "I'll tell you later!",
  "I'll find that out for you soon.",
  "Hmm... I'm still learning about that.",
  "I’m not sure yet, but I’ll update you later!",
  "That’s a good question — I’ll get back to you soon.",
];

const randomReply = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
postBot(randomReply);
    }

    setInput("");
  };

  return (
    <>
      {/* ✅ Chat panel (now RIGHT side) */}
      <div
        className={`fixed top-0 right-0 h-full z-[60] transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width: 360 }}
      >
        <div className="h-full flex flex-col bg-white border-l border-gray-200 shadow-lg">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-gray-700" />
              <div className="text-gray-800 font-semibold">Room Assistant</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded hover:bg-gray-100"
              aria-label="Close chat"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-4 space-y-3 bg-gray-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] ${
                  m.sender === "user" ? "ml-auto text-right" : "mr-auto"
                }`}
              >
                <div
                  className={`inline-block px-3 py-2 rounded-md text-sm ${
                    m.sender === "user"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-white text-gray-800 shadow-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t bg-white">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                placeholder="Type a command (e.g. add bed)"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Floating chat icon (now bottom-right) */}
      <div className="fixed bottom-24 right-6 z-[70]">
        <button
          onClick={() => setOpen((s) => !s)}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 shadow-lg hover:scale-[1.03] transition transform"
          aria-label="Open chat"
        >
          <MessageCircle className="h-7 w-7 text-white" />
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
      </div>
    </>
  );
}
