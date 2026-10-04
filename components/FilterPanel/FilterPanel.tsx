'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Dropdown from '@/components/Dropdown/Dropdown';
import { useCategoriesStore } from '@/lib/store/categoriesStore';
import styles from './FilterPanel.module.css';

// пауза після останньої літери, перш ніж оновити URL і запит
const SEARCH_DELAY = 400;

// значення — як у бекенді (locationQuerySchema: sort)
const SORT_OPTIONS = [
  { label: 'Без сортування', value: '' },
  { label: 'За популярністю', value: 'popular' },
  { label: 'За рейтингом', value: 'rating' },
  { label: 'Новіші спочатку', value: 'new' },
];

const FilterPanel = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // категорії — зі спільного store (той самий, що у формі локації)
  const categories = useCategoriesStore((state) => state.categories);
  const hasHydrated = useCategoriesStore((state) => state.hasHydrated);
  const fetchIfEmpty = useCategoriesStore((state) => state.fetchIfEmpty);

  useEffect(() => {
    void useCategoriesStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (hasHydrated) void fetchIfEmpty();
  }, [hasHydrated, fetchIfEmpty]);

  const isLoading = !categories;
  const region = searchParams.get('region') ?? '';
  const type = searchParams.get('type') ?? '';
  const sort = searchParams.get('sort') ?? '';
  const urlSearch = searchParams.get('search') ?? '';

  const [search, setSearch] = useState(urlSearch);
  // останній запит, який ми самі записали в URL
  const [sentSearch, setSentSearch] = useState(urlSearch);
  const [syncedSearch, setSyncedSearch] = useState(urlSearch);

  // URL змінився ззовні («Назад», пошук з головної) — оновлюємо поле
  if (urlSearch !== syncedSearch) {
    setSyncedSearch(urlSearch);
    if (urlSearch !== sentSearch) setSearch(urlSearch);
  }

  const updateParams = useCallback(
    (key: string, value: string, mode: 'push' | 'replace' = 'push') => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.set('page', '1');

      const url = `${pathname}?${params.toString()}`;
      if (mode === 'replace') {
        router.replace(url, { scroll: false });
      } else {
        router.push(url, { scroll: false });
      }
    },
    [pathname, router, searchParams],
  );

  // пошук: оновлюємо URL лише після паузи і без нових записів в історії
  useEffect(() => {
    const query = search.trim();
    if (query === urlSearch) return;

    const timer = setTimeout(() => {
      setSentSearch(query);
      updateParams('search', query, 'replace');
    }, SEARCH_DELAY);

    return () => clearTimeout(timer);
  }, [search, urlSearch, updateParams]);

  const regionOptions = [
    { label: 'Усі регіони', value: '' },
    ...(categories?.regions ?? []).map((item) => ({
      label: item.name,
      value: item.slug,
    })),
  ];

  const typeOptions = [
    { label: 'Усі типи', value: '' },
    ...(categories?.locationTypes ?? []).map((item) => ({
      label: item.name,
      value: item.slug,
    })),
  ];

  return (
    <section className={styles.filterPanel} aria-label="Фільтри локацій">
      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Пошук"
        aria-label="Пошук локацій"
        maxLength={96}
        className={styles.search}
      />

      <div className={styles.region}>
        <Dropdown
          ariaLabel="Регіон"
          options={regionOptions}
          value={region}
          onChange={(value) => updateParams('region', value)}
          placeholder={isLoading ? 'Завантаження...' : 'Регіон'}
        />
      </div>

      <div className={styles.type}>
        <Dropdown
          ariaLabel="Тип локації"
          options={typeOptions}
          value={type}
          onChange={(value) => updateParams('type', value)}
          placeholder={isLoading ? 'Завантаження...' : 'Тип локації'}
        />
      </div>

      <div className={styles.sort}>
        <Dropdown
          ariaLabel="Сортування"
          options={SORT_OPTIONS}
          value={sort}
          onChange={(value) => updateParams('sort', value)}
          placeholder="Сортування"
        />
      </div>
    </section>
  );
};

export default FilterPanel;
