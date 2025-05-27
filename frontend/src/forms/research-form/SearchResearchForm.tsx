import { LucideSearch } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';

type SearchFormData = {
  detail: string;
};

type Props = {
  query: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const SearchResearchForm = ({ query, onChange }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const form = useForm<SearchFormData>({
    defaultValues: {
      detail: '',
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          const searchKey = data.detail.trim();
          if (searchKey === '') {
            if (location.pathname === '/research/search') {
              setSearchParams({});
            } else {
              navigate('/research');
            }
          } else {
            const encoded = encodeURIComponent(searchKey);
            if (location.pathname === '/research/search') {
              setSearchParams({ detail: searchKey });
            } else {
              navigate(`/research/search?detail=${encoded}`);
            }
          }
        })}
      >
        <FormField
          control={form.control}
          name="detail"
          render={({ field }) => (
            <FormItem className="flex items-center space-y-0 text-sm">
              <div className="relative bg-gray-100 rounded-md">
                <LucideSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Nhập nội dung tìm kiếm"
                    className="h-11 w-[216px] border-border pl-10"
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default SearchResearchForm;
