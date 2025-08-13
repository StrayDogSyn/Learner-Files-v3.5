import { Toaster } from 'sonner';
import useGameStore from '../../stores/gameStore';

export function NotificationManager() {
  const { notifications, removeNotification } = useGameStore();

  return (
    <>
      <Toaster
        position="top-right"
        expand={false}
        richColors
        closeButton
        duration={4000}
      />
      
      {/* Custom notification overlay for game-specific notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`
              p-4 rounded-lg backdrop-blur-md border
              transform transition-all duration-300 ease-out
              animate-in slide-in-from-right-5
              ${
                notification.type === 'success'
                  ? 'bg-green-500/20 border-green-400/30 text-green-100'
                  : notification.type === 'error'
                  ? 'bg-red-500/20 border-red-400/30 text-red-100'
                  : notification.type === 'warning'
                  ? 'bg-yellow-500/20 border-yellow-400/30 text-yellow-100'
                  : 'bg-blue-500/20 border-blue-400/30 text-blue-100'
              }
            `}
            onClick={() => removeNotification(notification.id)}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{notification.title}</h4>
                <p className="text-xs opacity-90 mt-1">{notification.message}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeNotification(notification.id);
                }}
                className="text-white/60 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default NotificationManager;