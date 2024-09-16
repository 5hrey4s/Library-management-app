'use client';
import { useDebouncedCallback } from 'use-debounce';
import { usePathname, useSearchParams ,useRouter} from 'next/navigation';
import { Button } from './ui/button';
 
export default function Search({ placeholder }: { placeholder: string }) {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const handleSearch = useDebouncedCallback((term: string)=> {
    console.log(`Searching... ${term}`);
    const params = new URLSearchParams(searchParams);
    params.set('search', '1');
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    replace(`${pathname}?${params.toString()}`);
  },300)
  
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <input
        className="h-12 w-full md:w-80 rounded-l-xl p-3 border-none focus:outline-white"
        placeholder="Type Here to Search"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("search")?.toString()}
      />
      <Button className=" bg-[#357960] h-12 text-white rounded-r-xl rounded-l-none">
        Search
      </Button>
    </div>
  );
}