import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Trash2, Heart } from 'lucide-react'

interface WishlistItem {
  id: number
  title: string
  author: string
  coverImage: string
  description: string
}

interface WishlistGridProps {
  items: WishlistItem[]
}

export function WishlistGrid({ items }: WishlistGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Card key={item.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="p-0">
            <div className="relative h-64 w-full">
              <Image
                src={item.coverImage}
                alt={`Cover of ${item.title}`}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 hover:scale-105"
              />
              <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                Wishlist
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-grow p-4">
            <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
            <p className="text-sm text-muted-foreground mb-2">{item.author}</p>
            <p className="text-sm line-clamp-3">{item.description}</p>
          </CardContent>
          <CardFooter className="p-4 bg-secondary/10">
            <div className="flex justify-between items-center w-full">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Read Now
              </Button>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove from wishlist</span>
                </Button>
                <Button variant="ghost" size="sm" className="text-primary">
                  <Heart className="h-4 w-4" />
                  <span className="sr-only">Move to favorites</span>
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}