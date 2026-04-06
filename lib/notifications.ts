export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export async function showNotification(title: string, options?: NotificationOptions) {
  const hasPermission = await requestNotificationPermission();
  
  if (hasPermission) {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          ...options,
        });
      });
    } else {
      new Notification(title, {
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        ...options,
      });
    }
  }
}

export async function notifyNewMessage(senderName: string, message: string) {
  await showNotification('New Message', {
    body: `${senderName}: ${message}`,
    tag: 'chat-message',
  });
}

export async function notifySOSAlert(name: string, flatNumber: string, location: string = "Not specified") {
  await showNotification("🚨 SOS ALERT", {
    body: `${name} (${flatNumber}) needs help! Location: ${location}`,
    tag: "sos-alert",
    requireInteraction: true,
  });
}

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration);
        })
        .catch((error) => {
          console.log('SW registration failed:', error);
        });
    });
  }
}
