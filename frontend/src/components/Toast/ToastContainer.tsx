import { useToast } from '../../context/ToastContext';
import Toast from './Toast';

export default function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-4 right-0 left-0 z-100 pointer-events-none">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 items-end pointer-events-auto">
          {toasts.map(toast => (
            <Toast key={toast.id} toast={toast} />
          ))}
        </div>
      </div>
    </div>
  );
}
