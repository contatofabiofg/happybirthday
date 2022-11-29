import { PushNotifications } from '@capacitor/push-notifications'

export const addListeners = async () => {
  await PushNotifications.addListener('registration', (token) => {
    alert('Registration token: ', token)
  })

  await PushNotifications.addListener('registrationError', (err) => {
    alert('Registration error: ', err.error)
  })

  await PushNotifications.addListener(
    'pushNotificationReceived',
    (notification) => {
      alert('Push notification received: ', notification)
    }
  )

  await PushNotifications.addListener(
    'pushNotificationActionPerformed',
    (notification) => {
      alert(
        'Push notification action performed',
        notification.actionId,
        notification.inputValue
      )
    }
  )
  registerNotifications()
}

export const registerNotifications = async () => {
  let permStatus = await PushNotifications.checkPermissions()

  if (permStatus.receive === 'prompt') {
    permStatus = await PushNotifications.requestPermissions()
  }

  if (permStatus.receive !== 'granted') {
    throw new Error('User denied permissions!')
  }

  await PushNotifications.register()
}

export const getDeliveredNotifications = async () => {
  const notificationList = await PushNotifications.getDeliveredNotifications()
  alert('delivered notifications', notificationList)
}
