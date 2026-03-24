import { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Bot, User, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { mockChatMessages } from '@/mock/data'
import type { ChatMessage } from '@/types'

const suggestedCommands = [
  'Thêm phòng A101 giá 2 triệu',
  'Phòng nào đang trống?',
  'Doanh thu tháng này là bao nhiêu?',
  'Hóa đơn nào chưa thanh toán?',
  'Tạo hóa đơn cho phòng B101',
  'Hợp đồng nào sắp hết hạn?',
]

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages)
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = (text?: string) => {
    const msg = text || input.trim()
    if (!msg) return
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: msg,
      timestamp: new Date().toISOString(),
    }
    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `Tôi đã nhận được yêu cầu: "${msg}". Đây là bản demo UI, tính năng AI sẽ được tích hợp trong phiên bản tiếp theo.`,
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMsg, aiMsg])
    setInput('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Trợ lý AI</h1>
        <p className="text-muted-foreground">Quản lý phòng trọ bằng ngôn ngữ tự nhiên</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Chat Area */}
        <Card className="lg:col-span-3 flex flex-col h-[600px]">
          <ScrollArea ref={scrollRef} className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                  {msg.role === 'assistant' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-3 text-sm',
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-muted rounded-bl-md'
                  )}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  {msg.role === 'user' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập lệnh hoặc câu hỏi..."
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1"
              />
              <Button onClick={() => handleSend()} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Suggestions */}
        <Card className="h-fit">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Gợi ý lệnh</span>
            </div>
            <div className="space-y-2">
              {suggestedCommands.map((cmd, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(cmd)}
                  className="w-full text-left text-sm px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
