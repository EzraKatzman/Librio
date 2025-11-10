import { useState } from "react";
import { useToast } from "../../context/ToastContext";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";

interface AddBookModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (isbn: string) => Promise<void>;
}

export default function AddBookModal({ isOpen, onClose, onAdd }: AddBookModalProps) {
    const { showToast } = useToast();
    const [isbn, setIsbn] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isbn.trim()) return;

        setIsLoading(true);
        try {
            await onAdd(isbn.trim());
            setIsbn("");
            onClose();
            showToast("Book added!", "success");
        } catch (err) {
            console.error("Failed to add book:", err);
            showToast("Failed to add book. Double check your ISBN and try again", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setIsbn("");
            onClose();
        }
    };

    useKeyboardShortcuts([
        { key: 'Escape', callback: onClose },
    ], isOpen);

    if (!isOpen) return null;

    return (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <div 
            className="bg-background text-foreground rounded-lg shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">Add Book</h2>
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="text-foreground/80 p-1
                hover:bg-destructive/10 hover:text-destructive rounded-full 
                transition-colors focus-ring-primary cursor-pointer"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="isbn" className="block text-sm font-medium text-foreground mb-2">
                  ISBN
                </label>
                <input
                  id="isbn"
                  type="text"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  placeholder="Enter ISBN (e.g., 9780316769174)"
                  className="w-full px-4 py-2 border border-border rounded-lg text-foreground bg-border-light focus:outline-none focus-ring-primary"
                  disabled={isLoading}
                  autoFocus
                />
                <p className="mt-2 text-sm text-gray-600">
                  Enter the 10 or 13 digit ISBN of the book you want to add
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2  text-foreground/80 bg-border/70 hover:bg-border/50 dark:bg-border-light/30 dark:hover:bg-border-light/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isbn.trim() || isLoading}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    "Add Book"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      );
}
