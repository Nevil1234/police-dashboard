"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Image, FileText, Film, Maximize2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useIsMobile } from "@/hooks/use-mobile"

interface EvidenceGalleryProps {
  caseId: string
}

export function EvidenceGallery({ caseId }: EvidenceGalleryProps) {
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null)
  const isMobile = useIsMobile()

  // This would normally fetch data based on the caseId
  const evidenceItems: Evidence[] = [
    {
      id: 1,
      type: "image",
      title: "Crime Scene Photo 1",
      thumbnail: "/placeholder.svg?height=80&width=80",
      fullSize: "/placeholder.svg?height=600&width=800",
      date: "2023-06-15 10:15 AM",
      metadata: {
        location: "Downtown, 5th & Main",
        device: "Police Camera #4872",
        fileSize: "2.4 MB",
      },
    },
    {
      id: 2,
      type: "image",
      title: "Crime Scene Photo 2",
      thumbnail: "/placeholder.svg?height=80&width=80",
      fullSize: "/placeholder.svg?height=600&width=800",
      date: "2023-06-15 10:18 AM",
      metadata: {
        location: "Downtown, 5th & Main",
        device: "Police Camera #4872",
        fileSize: "1.8 MB",
      },
    },
    {
      id: 3,
      type: "document",
      title: "Witness Statement",
      thumbnail: "/placeholder.svg?height=80&width=80",
      fullSize: "/placeholder.svg?height=600&width=800",
      date: "2023-06-15 11:45 AM",
      metadata: {
        author: "Jane Doe",
        pages: "2",
        fileSize: "156 KB",
      },
    },
    {
      id: 4,
      type: "video",
      title: "Security Camera Footage",
      thumbnail: "/placeholder.svg?height=80&width=80",
      fullSize: "/placeholder.svg?height=600&width=800",
      date: "2023-06-15 09:30 AM",
      metadata: {
        duration: "2:45",
        source: "Building Security",
        fileSize: "24.6 MB",
      },
    },
  ]

  return (
    <Card className={`p-4 ${isMobile ? "h-[200px]" : "h-[300px]"} overflow-y-auto bg-white dark:bg-gray-800 shadow-sm`}>
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-medium">Evidence ({evidenceItems.length})</h4>
        <Button size="sm" variant="outline" className="shadow-sm">
          <Upload className="mr-2 h-4 w-4" />
          Add Evidence
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {evidenceItems.map((item) => (
          <Dialog key={item.id}>
            <DialogTrigger asChild>
              <div
                className="relative group cursor-pointer border rounded-md overflow-hidden shadow-sm"
                onClick={() => setSelectedEvidence(item)}
              >
                <img src={item.thumbnail || "/placeholder.svg"} alt={item.title} className="w-full h-24 object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Maximize2 className="h-5 w-5 text-white" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1">
                  <div className="flex items-center">
                    {item.type === "image" && <Image className="h-3 w-3 text-white mr-1" />}
                    {item.type === "document" && <FileText className="h-3 w-3 text-white mr-1" />}
                    {item.type === "video" && <Film className="h-3 w-3 text-white mr-1" />}
                    <p className="text-xs text-white truncate">{item.title}</p>
                  </div>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{item.title}</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <img src={item.fullSize || "/placeholder.svg"} alt={item.title} className="w-full h-auto rounded-md" />
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Date:</span>
                    <span>{item.date}</span>
                  </div>
                  {Object.entries(item.metadata).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-muted-foreground capitalize">{key}:</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </Card>
  )
}

interface Evidence {
  id: number
  type: "image" | "document" | "video"
  title: string
  thumbnail: string
  fullSize: string
  date: string
  metadata: Record<string, string>
}

