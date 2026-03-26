"use client";

import { useState, useCallback, useMemo } from "react";

interface UseSelectionResult<T extends string> {
  selectedIds: Set<T>;
  isSelected: (id: T) => boolean;
  isAllSelected: boolean;
  isSomeSelected: boolean;
  select: (id: T) => void;
  deselect: (id: T) => void;
  toggle: (id: T) => void;
  selectAll: (ids: T[]) => void;
  deselectAll: () => void;
  toggleAll: (ids: T[]) => void;
  selectedCount: number;
  getSelectedArray: () => T[];
}

export function useSelection<T extends string>(
  initialSelected: T[] = []
): UseSelectionResult<T> {
  const [selectedIds, setSelectedIds] = useState<Set<T>>(
    new Set(initialSelected)
  );

  const isSelected = useCallback(
    (id: T) => selectedIds.has(id),
    [selectedIds]
  );

  const select = useCallback((id: T) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const deselect = useCallback((id: T) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const toggle = useCallback((id: T) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback((ids: T[]) => {
    setSelectedIds(new Set(ids));
  }, []);

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const toggleAll = useCallback(
    (ids: T[]) => {
      const allSelected = ids.every((id) => selectedIds.has(id));
      if (allSelected) {
        setSelectedIds(new Set());
      } else {
        setSelectedIds(new Set(ids));
      }
    },
    [selectedIds]
  );

  const selectedCount = selectedIds.size;

  const getSelectedArray = useCallback(() => {
    return Array.from(selectedIds);
  }, [selectedIds]);

  const isAllSelectedMemo = useMemo(
    () => (ids: T[]) => ids.length > 0 && ids.every((id) => selectedIds.has(id)),
    [selectedIds]
  );

  const isSomeSelectedMemo = useMemo(
    () => selectedIds.size > 0,
    [selectedIds]
  );

  return {
    selectedIds,
    isSelected,
    isAllSelected: false, // This needs to be computed with the full list
    isSomeSelected: isSomeSelectedMemo,
    select,
    deselect,
    toggle,
    selectAll,
    deselectAll,
    toggleAll,
    selectedCount,
    getSelectedArray,
  };
}

// Extended hook that takes the full list for isAllSelected computation
interface UseSelectionWithListResult<T extends { id: string }> extends Omit<UseSelectionResult<string>, 'isAllSelected'> {
  isAllSelected: boolean;
}

export function useSelectionWithList<T extends { id: string }>(
  items: T[],
  initialSelected: string[] = []
): UseSelectionWithListResult<T> {
  const selection = useSelection<string>(initialSelected);
  const itemIds = useMemo(() => items.map((item) => item.id), [items]);

  const isAllSelected = useMemo(
    () => itemIds.length > 0 && itemIds.every((id) => selection.selectedIds.has(id)),
    [itemIds, selection.selectedIds]
  );

  return {
    ...selection,
    isAllSelected,
    toggleAll: () => selection.toggleAll(itemIds),
    selectAll: () => selection.selectAll(itemIds),
  };
}
