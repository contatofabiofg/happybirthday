import { PushNotifications } from '@capacitor/push-notifications'

export const addListeners = async () => {
  await PushNotifications.addListener('registration', (token) => {
    console.log('Registration token: ', token)
  })

  await PushNotifications.addListener('registrationError', (err) => {
    console.log('Registration error: ', err.error)
  })

  await PushNotifications.addListener(
    'pushNotificationReceived',
    (notification) => {
      console.log('Push notification received: ', notification)
    }
  )

  await PushNotifications.addListener(
    'pushNotificationActionPerformed',
    (notification) => {
      console.log(
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
  console.log('delivered notifications', notificationList)
}
