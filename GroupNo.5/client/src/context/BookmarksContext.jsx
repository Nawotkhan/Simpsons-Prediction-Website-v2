import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const BookmarksContext = createContext(null);

export function BookmarksProvider({ children }) {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);

  // Load user specific bookmarks
  useEffect(() => {
    const key = user ? `sp_bookmarks_${user.id}` : 'sp_bookmarks_guest';
    try {
      const stored = localStorage.getItem(key);
      setBookmarks(stored ? JSON.parse(stored) : []);
    } catch {
      setBookmarks([]);
    }
  }, [user]);

  // Persist every change
  useEffect(() => {
    const key = user ? `sp_bookmarks_${user.id}` : 'sp_bookmarks_guest';
    localStorage.setItem(key, JSON.stringify(bookmarks));
  }, [bookmarks, user]);

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