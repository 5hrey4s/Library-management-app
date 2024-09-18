'use client'

import { FC, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PaginationControlsProps {
  hasNextPage: boolean
  hasPrevPage: boolean
  totalPages: number
}

const PaginationControls: FC<PaginationControlsProps> = ({
  hasNextPage,
  hasPrevPage,
  totalPages
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const page = parseInt(searchParams.get('page') ?? '1')
  const perPage = parseInt(searchParams.get('per_page') ?? '8')
  const [inputPage, setInputPage] = useState(page.toString())

  useEffect(() => {
    setInputPage(page.toString())
  }, [page])

  const navigateToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      router.push(`?page=${newPage}&per_page=${perPage}`)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPage(e.target.value)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newPage = parseInt(inputPage)
      navigateToPage(newPage)
    }
  }

  const handlePerPageChange = (value: string) => {
    router.push(`/home/books/?page=1&per_page=${value}`)
  }

  return (
    <TooltipProvider>
      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-center p-4 bg-white text-black">
        <div className="flex items-center space-x-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                disabled={page === 1}
                onClick={() => navigateToPage(1)}
                className="bg-white text-[#308D46] hover:bg-[#e6e6e6] hover:text-[#308D46]"
              >
                <ChevronsLeft className="h-4 w-4" />
                <span className="sr-only">First page</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span className="text-xs md:text-sm">First page</span>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                disabled={!hasPrevPage}
                onClick={() => navigateToPage(page - 1)}
                className="bg-white text-[#308D46] hover:bg-[#e6e6e6] hover:text-[#308D46]"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span className="text-xs md:text-sm">Previous page</span>
            </TooltipContent>
          </Tooltip>

          <div className="flex items-center space-x-2">
            <span className="text-xs md:text-sm">Page</span>
            <Input
              type="number"
              min={1}
              max={totalPages}
              value={inputPage}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              className="w-16 text-center bg-white text-[#308D46] text-xs md:text-sm"
            />
            <span className="text-xs md:text-sm">of {totalPages}</span>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                disabled={!hasNextPage}
                onClick={() => navigateToPage(page + 1)}
                className="bg-white text-[#308D46] hover:bg-[#e6e6e6] hover:text-[#308D46]"
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span className="text-xs md:text-sm">Next page</span>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                disabled={page === totalPages}
                onClick={() => navigateToPage(totalPages)}
                className="bg-white text-[#308D46] hover:bg-[#e6e6e6] hover:text-[#308D46]"
              >
                <ChevronsRight className="h-4 w-4" />
                <span className="sr-only">Last page</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span className="text-xs md:text-sm">Last page</span>
            </TooltipContent>
          </Tooltip>

          <div className="flex items-center space-x-2">
            <span className="text-xs md:text-sm">Show</span>
            <Select
              value={perPage.toString()}
              onValueChange={handlePerPageChange}
            >
              <SelectTrigger className="w-[70px] bg-white text-[#308D46] text-xs md:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="8">8</SelectItem>
                <SelectItem value="16">16</SelectItem>
                <SelectItem value="24">24</SelectItem>
                <SelectItem value="32">32</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-xs md:text-sm">per page</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

export default PaginationControls
