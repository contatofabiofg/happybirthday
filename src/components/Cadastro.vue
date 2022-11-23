<script setup>
import {
  IonPage,
  IonButton,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from '@ionic/vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createName } from '../firebase'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from '../firebase'

initializeApp(firebaseConfig)
const auth = getAuth()

const router = useRouter()
const nameInput = ref('')
const sexInput = ref('')
const connectionInput = ref('')
const monthInput = ref('')
const dayInput = ref('')
const collection = ref('')

onAuthStateChanged(auth, () => {
  if (auth.currentUser) {
    console.log(auth.currentUser)
    collection.value = auth.currentUser.email
  }
})

const months31 = [
  'Janeiro',
  'Março',
  'Maio',
  'Julho',
  'Agosto',
  'Outubro',
  'Dezembro',
]
const months30 = ['Abril', 'Junho', 'Setembro', 'Novembro']
const days = computed(() => {
  if (months31.find((element) => element == monthInput.value)) {
    return 31
  } else if (months30.find((element) => element == monthInput.value)) {
    return 30
  } else {
    return 29
  }
})

const months = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

async function gravar(fechar) {
  let obj = {
    name: nameInput.value,
    sex: sexInput.value,
    connection: connectionInput.value,
    month: monthInput.value,
    day: dayInput.value,
  }

  createName(obj, collection.value)
  limpar()

  if (fechar) {
    router.push('/dashboard')
  }
}

function limpar() {
  nameInput.value = ''
  sexInput.value = ''
  connectionInput.value = ''
  monthInput.value = ''
  dayInput.value = ''
}
</script>
<template>
  <ion-page>
    <div
      class="mt-16 m-auto p-2 w-[95%] flex flex-col rounded-xl bg-white drop-shadow-md"
    >
      <ion-label class="font-bold">Nome</ion-label>
      <input
        id="name"
        v-model="nameInput"
        type="text"
        class="border border-slate-300 rounded w-full p-2 my-2 outline-none duration-100 focus:drop-shadow-md"
      />
      <ion-label class="font-bold">Sexo</ion-label>
      <ion-select
        v-model="sexInput"
        id="sex"
        interface="popover"
        placeholder="Selecione"
        class="border border-slate-300 rounded w-full p-2 my-2"
      >
        <ion-select-option value="masculino">Masculino</ion-select-option>
        <ion-select-option value="feminino">Feminino</ion-select-option>
      </ion-select>
      <ion-label class="font-bold">Tipo de Conexão</ion-label>
      <ion-select
        v-model="connectionInput"
        id="connection"
        interface="popover"
        placeholder="Selecione"
        class="border border-slate-300 rounded w-full p-2 my-2"
      >
        <ion-select-option value="paimae">Pai/Mãe</ion-select-option>
        <ion-select-option value="irmaoirma">Irmão/Irmã</ion-select-option>
        <ion-select-option value="amigoamiga">Amigo(a)</ion-select-option>
        <ion-select-option value="amigoamiga">Namorado(a)</ion-select-option>
        <ion-select-option value="amigoamiga">Esposo(a)</ion-select-option>
        <ion-select-option value="amigoamiga">Noivo(a)</ion-select-option>
        <ion-select-option value="colegdetrabalho"
          >Colega de Trabalho</ion-select-option
        >
        <ion-select-option value="outros">Outro</ion-select-option>
      </ion-select>

      <ion-label class="font-bold">Aniversário</ion-label>
      <div class="flex w-full">
        <div class="w-full">
          <span class="font-bold">Mês:</span>
          <ion-select
            v-model="monthInput"
            id="month"
            interface="popover"
            @ionChange="dayInput = ''"
            placeholder="Selecione"
            class="border border-slate-300 rounded w-full p-2 my-2"
          >
            <ion-select-option
              v-for="(item, index) in months"
              :key="index"
              :value="index + 1"
              >{{ item }}</ion-select-option
            >
          </ion-select>
        </div>
        <div class="w-full mx-1">
          <span class="font-bold">Dia:</span>
          <ion-select
            :disabled="!monthInput"
            v-model="dayInput"
            id="day"
            interface="popover"
            placeholder="Selecione"
            class="border border-slate-300 rounded w-full p-2 my-2"
          >
            <ion-select-option
              v-for="(item, index) in days"
              :key="index"
              :value="item"
              >{{ item }}</ion-select-option
            >
          </ion-select>
        </div>
      </div>

      <ion-button class="w-full my-1" shape="round" @click="gravar()"
        >Adicionar</ion-button
      >
      <ion-button class="w-full my-1" shape="round" @click="gravar('fechar')"
        >Adicionar e Voltar</ion-button
      >
      <ion-button
        class="w-full my-1"
        shape="round"
        @click="router.push('/dashboard')"
        >Voltar</ion-button
      >
    </div>
  </ion-page>
</template>
