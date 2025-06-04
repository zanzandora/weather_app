import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useLocalStorage from './useLocalStorage';
import { HistorySearchItem } from '@/types/apiType';

const HISTORY_KEY = 'search-history';

export function useHistorySearch() {
  const [history, setHistory] = useLocalStorage<HistorySearchItem[]>(
    HISTORY_KEY,
    []
  );
  const queryClient = useQueryClient();

  const getHistory = useQuery({
    queryKey: [HISTORY_KEY],
    queryFn: () => history,
    initialData: history,
  });

  const addHistory = useMutation({
    mutationFn: async (
      search: Omit<HistorySearchItem, 'id' | 'searchedTime'>
    ) => {
      const newItem: HistorySearchItem = {
        ...search,
        id: `${search.lat}-${search.lon}-${Date.now()}`,
        searchedTime: Date.now(),
      };

      const filteredHistory = history.filter(
        (item) => !(item.lat === search.lat && item.lon === search.lon)
      );

      const newHistory = [newItem, ...filteredHistory].slice(0, 10);
      setHistory(newHistory);
      return newHistory;
    },
    onSuccess: (newHistory) => {
      queryClient.setQueryData([HISTORY_KEY], newHistory);
    },
  });

  const clearHistory = useMutation({
    mutationFn: async () => {
      setHistory([]);
      return [];
    },
    onSuccess: () => {
      queryClient.setQueryData([HISTORY_KEY], []);
    },
  });

  return {
    history: getHistory.data || [],
    addHistory,
    clearHistory,
  };
}
