<script setup lang="ts">
import { ref } from 'vue';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import { paths } from '../router/routes';
import { useQuasar } from 'quasar';
import { TaskList } from 'src/models';

const startConfig = ref<boolean>(false);
const router = useRouter();
const $q = useQuasar();
const input = ref<HTMLInputElement>();
const errText = ' Please select another.';
const err = {
  notJson: 'Not json file.' + errText,
  notAllow: 'This file is not allowed.' + errText,
  notArray: 'Only array data is allowed.' + errText,
  wrongFormat: 'File format varies.' + errText,
};

const btnclick = () => {
  if (typeof input.value != 'undefined') input.value.click();
};
const fileHandle = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = (target.files as FileList)[0];
  const name = file.name;
  if (name.slice(-4).toLowerCase() !== 'json') {
    alertWindow(err.notJson);
    return;
  }

  let reader = new FileReader();
  reader.readAsText(file);
  reader.onload = () => {
    const task = reader.result as string;

    if (!validateInputData(task)) return;

    localStorage.setItem('task', task);
    router.push(paths.task);
  };
};
const validateInputData = (task: string): boolean => {
  try {
    JSON.parse(task);
  } catch (e) {
    alertWindow(err.notAllow + errText);
    return false;
  }
  const fileToJson = JSON.parse(task);
  type ErrorType = {
    term: boolean;
    message: string;
  };
  const errMap: Map<string, ErrorType> = new Map([
    [
      'notArray',
      {
        term: !Array.isArray(fileToJson),
        message: err.notArray,
      },
    ],
    [
      'wrongFormat',
      {
        term: checkFormat(fileToJson),
        message: err.wrongFormat,
      },
    ],
  ]);

  for (const val of errMap) {
    if (val[1].term) {
      alertWindow(val[1].message);
      return false;
    }
  }
  return true;
};
const checkFormat = (jsonArr: []): boolean => {
  if (jsonArr.length === 0) return false;

  const collectList: TaskList = {
    sectionId: '',
    sectionName: '',
    archives: false,
    cardList: [],
  };
  const collectKey = Object.keys(collectList);
  for (let i = 0; i < jsonArr.length; i++) {
    const keys = Object.keys(jsonArr[i]);
    if (keys.length !== 4) return true;
    for (let i = 0; i < collectKey.length; i++) {
      if (!keys.includes(collectKey[i])) return true;
    }
  }

  return false;
};
const alertWindow = (message: string) => {
  $q.notify({
    color: 'negative',
    multiLine: true,
    message: message,
    position: 'bottom',
    icon: 'warning',
    timeout: 3000,
  });
};

onBeforeRouteLeave((to, from, next) => {
  if (!localStorage.getItem('task')) localStorage.setItem('task', '[]');
  next();
});
</script>

<template>
  <q-page>
    <div class="column" style="height: calc(100vh - 100px)">
      <p class="text-center text-h3 q-mt-auto">Tap the image to get started.</p>
      <div class="q-mt-md q-mb-auto text-center">
        <img
          src="img/lets-start.png"
          alt=""
          width="300"
          @click="startConfig = true"
        />
      </div>
    </div>
    <q-dialog v-model="startConfig">
      <q-card>
        <q-card-section class="row justify-between q-pb-none">
          <div class="text-h5">How do you start?</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-btn
            label="start anew"
            icon="open_in_new"
            size="20px"
            color="primary"
            class="q-mt-md full-width"
            :to="paths.task"
          />
          <q-btn
            label="open json data"
            icon="file_upload"
            size="20px"
            color="primary"
            class="q-mt-md full-width"
            @click="btnclick"
          />
          <input
            type="file"
            class="hidden"
            ref="input"
            accept="application/json"
            @change="fileHandle"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>
