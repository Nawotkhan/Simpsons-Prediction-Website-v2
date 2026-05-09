import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const BookmarksContext = createContext(null);

const STORAGE_KEY = 'simpredictions_bookmarks';

export function BookmarksProvider({ children }) {
  // FIX: seed from localStorage so bookmarks survive page refresh
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist every change to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  // b = { num, title, tag }  —  num is used as the unique key
  const addBookmark = useCallback((b) => {
    setBookmarks(prev => {
      if (prev.some(x => x.num === b.num)) return prev;   // no duplicates
      return [...prev, b];
    });
  }, []);

  const removeBookmark = useCallback((num) => {
    setBookmarks(prev => prev.filter(x => x.num !== num));
  }, []);

  const isBookmarked = useCallback((num) => {
    return bookmarks.some(x => x.num === num);
  }, [bookmarks]);

  const toggleBookmark = useCallback((b) => {
    if (bookmarks.some(x => x.num === b.num)) {
      removeBookmark(b.num);
    } else {
      addBookmark(b);
    }
  }, [bookmarks, addBookmark, removeBookmark]);

  return (
    <BookmarksContext.Provider value={{ bookmarks, addBookmark, removeBookmark, isBookmarked, toggleBookmark }}>
      {children}
    </BookmarksContext.Provider>
  );
}

// FIX: throw a clear error if used outside provider so it's easy to debug
export function useBookmarks() {
  const ctx = useContext(BookmarksContext);
  if (!ctx) throw new Error('useBookmarks must be used inside <BookmarksProvider>');
  return ctx;
}