// AutoNotificationHandler.js - Create this as a separate file
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType, AndroidImportance, TriggerType } from '@notifee/react-native';
import { Platform } from 'react-native';

// Background message handler - MUST be at the top level
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background message received:', remoteMessage);
  
  const { notification, data } = remoteMessage;
  
  if (notification) {
    await notifee.displayNotification({
      title: notification.title || 'New Notification',
      body: notification.body || 'You have a new message',
      data: data,
      android: {
        channelId: 'default',
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
        },
        smallIcon: 'ic_launcher',
        sound: 'default',
        vibrationPattern: [300, 500],
        autoCancel: true,
      },
      ios: {
        sound: 'default',
        badge: 1,
      },
    });
  }
});

// Background event handler
notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.PRESS) {
    console.log('Background notification pressed:', detail.notification);
  }
});

export class AutoNotificationManager {
  constructor(navigation) {
    this.navigation = navigation;
    this.notificationInterval = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Request permissions
      await notifee.requestPermission();
      
      // Create notification channels
      if (Platform.OS === 'android') {
        await notifee.createChannel({
          id: 'default',
          name: 'Default Notifications',
          importance: AndroidImportance.HIGH,
          sound: 'default',
          vibration: true,
          badge: true,
        });

        await notifee.createChannel({
          id: 'auto-notifications',
          name: 'Auto Notifications',
          importance: AndroidImportance.HIGH,
          sound: 'default',
          vibration: true,
          badge: true,
        });
      }

      // Request FCM permission
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const token = await messaging().getToken();
        // console.log('FCM Token:', token);
      }

      // Handle foreground messages
      this.unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
        console.log('Foreground message received:', remoteMessage);
        await this.displayNotification(remoteMessage);
      });

      // Handle notification press events
      this.unsubscribePress = notifee.onForegroundEvent(({ type, detail }) => {
        if (type === EventType.PRESS) {
          this.handleNotificationPress(detail.notification);
        }
      });

      // Handle app opened from background
      messaging().onNotificationOpenedApp((remoteMessage) => {
        console.log('App opened from background:', remoteMessage);
        setTimeout(() => {
          this.handleNotificationData(remoteMessage.data);
        }, 1000);
      });

      // Handle app opened from killed state
      messaging()
        .getInitialNotification()
        .then((remoteMessage) => {
          if (remoteMessage) {
            console.log('App opened from killed state:', remoteMessage);
            setTimeout(() => {
              this.handleNotificationData(remoteMessage.data);
            }, 2000);
          }
        });

      this.isInitialized = true;
      console.log('Auto notification system initialized');

    } catch (error) {
      console.error('Error initializing auto notifications:', error);
    }
  }

  // Display notification
  async displayNotification(remoteMessage = null, customData = {}) {
    try {
      const notification = remoteMessage?.notification;
      const data = remoteMessage?.data || customData;

      await notifee.displayNotification({
        title: notification?.title || customData.title || 'New Notification',
        body: notification?.body || customData.body || 'You have a new message',
        data: data,
        android: {
          channelId: 'auto-notifications',
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
          smallIcon: 'ic_launcher',
          sound: 'default',
          vibrationPattern: [300, 500],
          autoCancel: true,
          showTimestamp: true,
        },
        ios: {
          sound: 'default',
          badge: 1,
        },
      });
    } catch (error) {
      console.error('Error displaying notification:', error);
    }
  }

  // Start automatic notifications (demo purposes)
  startAutoNotifications() {
    if (this.notificationInterval) return;

    const notifications = [
      {
        title: '🔥 Hot Deal Alert!',
        body: 'Check out our latest trending offers',
        screen: 'Category',
        data: { id: 1, name: 'Hot Deals' }
      },
      {
        title: '🆕 New Arrivals',
        body: 'Fresh products just added to our collection',
        screen: 'ProductDetailPage',
        data: { id: 'new-product' }
      },
      {
        title: '⏰ Limited Time Offer',
        body: 'Don\'t miss out on today\'s special deals',
        screen: 'Category',
        data: { id: 2, name: 'Special Offers' }
      },
      {
        title: '🎉 Welcome Back!',
        body: 'We have exciting updates for you',
        screen: 'Home'
      }
    ];

    let notificationIndex = 0;

    this.notificationInterval = setInterval(() => {
      const notification = notifications[notificationIndex];
      this.displayNotification(null, notification);
      
      notificationIndex = (notificationIndex + 1) % notifications.length;
    }, 10000); // Show notification every 10 seconds

    console.log('Auto notifications started');
  }

  // Stop automatic notifications
  stopAutoNotifications() {
    if (this.notificationInterval) {
      clearInterval(this.notificationInterval);
      this.notificationInterval = null;
      console.log('Auto notifications stopped');
    }
  }

  // Schedule a notification for later
  async scheduleNotification(title, body, delayInSeconds = 30, data = {}) {
    try {
      const date = new Date(Date.now() + delayInSeconds * 1000);
      
      await notifee.createTriggerNotification(
        {
          title: title,
          body: body,
          data: data,
          android: {
            channelId: 'auto-notifications',
            importance: AndroidImportance.HIGH,
            smallIcon: 'ic_launcher',
            sound: 'default',
          },
          ios: {
            sound: 'default',
          },
        },
        {
          type: TriggerType.TIMESTAMP,
          timestamp: date.getTime(),
        }
      );

      console.log(`Notification scheduled for ${delayInSeconds} seconds`);
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  // Send immediate notification
  async sendImmediateNotification(title, body, data = {}) {
    await this.displayNotification(null, { title, body, ...data });
  }

  // Handle notification press
  handleNotificationPress(notification) {
    console.log('Notification pressed:', notification);
    const data = notification?.data;
    this.handleNotificationData(data);
  }

  // Handle navigation from notification data
  handleNotificationData(data) {
    if (!data || !this.navigation) return;

    if (data.screen) {
      try {
        if (data.screen === 'Home') {
          this.navigation.navigate('Home');
        } else if (data.screen === 'Category') {
          this.navigation.navigate('Category', data.data || data);
        } else if (data.screen === 'ProductDetailPage') {
          this.navigation.navigate('ProductDetailPage', { data: data.data || data });
        } else {
          this.navigation.navigate(data.screen, data.data || data);
        }
      } catch (error) {
        console.error('Navigation error:', error);
      }
    }
  }

  // Cleanup
  cleanup() {
    this.stopAutoNotifications();
    
    if (this.unsubscribeForeground) {
      this.unsubscribeForeground();
    }
    
    if (this.unsubscribePress) {
      this.unsubscribePress();
    }
    
    this.isInitialized = false;
  }

  // Show welcome notification when user lands on home page
  async showWelcomeNotification() {
    setTimeout(() => {
      this.sendImmediateNotification(
        '👋 Welcome to Our Store!',
        'Discover amazing deals and new products',
        { screen: 'Category', data: { id: 1, name: 'Featured' } }
      );
    }, 3000); // Show after 3 seconds
  }

  // Show random promotional notifications
  async showPromotionalNotifications() {
    const promoNotifications = [
      {
        title: '🛍️ Flash Sale Active!',
        body: 'Up to 70% off on selected items',
        data: { screen: 'Category', data: { id: 'flash-sale' } }
      },
      {
        title: '📦 Free Shipping Available',
        body: 'On orders above $50. Shop now!',
        data: { screen: 'Home' }
      },
      {
        title: '⭐ Customer Favorites',
        body: 'Check out our top-rated products',
        data: { screen: 'Category', data: { id: 'top-rated' } }
      }
    ];

    // Show random promo notification every 2 minutes
    setInterval(() => {
      const randomPromo = promoNotifications[Math.floor(Math.random() * promoNotifications.length)];
      this.sendImmediateNotification(randomPromo.title, randomPromo.body, randomPromo.data);
    }, 120000); // 2 minutes
  }
}

export default AutoNotificationManager;