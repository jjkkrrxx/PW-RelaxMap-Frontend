"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Dropdown from "@/components/Dropdown/Dropdown";
import styles from "./FilterPanel.module.css";

interface FilterOption {
  name: string;
  slug: string;
}

interface CategoriesResponse {
  data: {
    locationTypes: FilterOption[];
    regions: FilterOption[];
  };
}

const FilterPanel = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [regions, setRegions] = useState<FilterOption[]>([]);
  const [locationTypes, setLocationTypes] = useState<FilterOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const region = searchParams.get("region") || "";
  const type = searchParams.get("type") || "";
  const sort = searchParams.get("sort") || "";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");

        if (!response.ok) {
          throw new Error("Не вдалося отримати категорії");
        }

        const result: CategoriesResponse = await response.json();

        setRegions(result.data.regions);
        setLocationTypes(result.data.locationTypes);
      } catch (error) {
        console.error("Помилка завантаження категорій:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    updateParams("search", value);
  };

  return (
    <section className={styles.filterPanel}>
      <input
        type="search"
        value={search}
        onChange={(event) => handleSearch(event.target.value)}
        placeholder="Пошук"
        className={styles.search}
      />

      <Dropdown
        options={regions.map((regionOption) => ({
          label: regionOption.name,
          value: regionOption.slug,
        }))}
        value={region}
        onChange={(value) => updateParams("region", value)}
        placeholder={isLoading ? "Завантаження..." : "Регіон"}
      />

      <Dropdown
        options={locationTypes.map((locationType) => ({
          label: locationType.name,
          value: locationType.slug,
        }))}
        value={type}
        onChange={(value) => updateParams("type", value)}
        placeholder={isLoading ? "Завантаження..." : "Тип локації"}
      />

      <Dropdown
        options={[
          { label: "Популярні", value: "popular" },
          { label: "За рейтингом", value: "rating" },
          { label: "Новіші", value: "new" },
        ]}
        value={sort}
        onChange={(value) => updateParams("sort", value)}
        placeholder="Сортування"
      />
    </section>
  );
};

export default FilterPanel;
