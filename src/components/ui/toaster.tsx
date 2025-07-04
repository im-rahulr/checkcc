import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider data-oid="f479790">
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} data-oid="u08yil:">
            <div className="grid gap-1" data-oid="o.go2o1">
              {title && <ToastTitle data-oid="5a7-w5x">{title}</ToastTitle>}
              {description && (
                <ToastDescription data-oid="-vaz-se">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose data-oid="zzns1v:" />
          </Toast>
        );
      })}
      <ToastViewport data-oid="wufqipg" />
    </ToastProvider>
  );
}
