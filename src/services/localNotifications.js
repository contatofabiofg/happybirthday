import { getAllDocs } from './firebase'
import { LocalNotifications } from '@capacitor/local-notifications'

let docs = null
let today = null
//let month = null
let year = null
let months = null

export async function getUsersAndDates() {
  cancelPendings()

  docs = await getAllDocs()
  today = new Date()
  // month = today.getMonth()
  year = today.getFullYear()
  months = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
  }

  docs.forEach((element) => {
    let date = new Date(year, element.data().month - 1, element.data().day)
    date.setDate(date.getDate() - 7)
    generateWeekNotification(element.data().name, date)
    months[element.data().month - 1]++
  })

  generateMonthNotifications()
}

async function generateWeekNotification(name, date) {
  await LocalNotifications.requestPermissions()
  await LocalNotifications.schedule({
    notifications: [
      {
        title: 'Oba! Tem festa vindo aí!',
        body: `Daqui à uma semana ${name} faz aniversário! Já comprou o presente?`,
        schedule: { at: date },
      },
    ],
  })
}

async function generateMonthNotifications() {
  for (const [key, value] of Object.entries(months)) {
    if (value != 0) {
      await LocalNotifications.requestPermissions()
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'Esse mês tem festa? Teeeem!',
            body: `Esse mês ${value} pessoa(s) fazem aniversário! Entre no App e veja quem é!`,
            schedule: { at: new Date(year, key, 1) },
          },
        ],
      })
    }
  }

  //console.log(await LocalNotifications.getPending())
}

export async function cancelPendings() {
  let pendentes = await LocalNotifications.getPending()
  await LocalNotifications.cancel(pendentes)
}

export async function getPendings() {
  let pendentes = await LocalNotifications.getPending()
  return pendentes
}
