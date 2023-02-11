<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { paths } from '../router/routes';
import { useQuasar } from 'quasar';

const startConfig = ref<boolean>(false);
const router = useRouter();
const $q = useQuasar();
const input = ref<HTMLInputElement>();

const btnclick = () => {
  if (typeof input.value != 'undefined') input.value.click();
};
const fileHandle = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = (target.files as FileList)[0];
  if (!file) return;

  let reader = new FileReader();
  reader.onload = () => {
    const task = reader.result as string;
    try {
      JSON.parse(task);
    } catch (e) {
      $q.notify({
        color: 'negative',
        multiLine: true,
        message: 'Illegal file. Please select another file.',
        position: 'bottom',
        icon: 'warning',
        timeout: 3000,
      });
      return;
    }
    localStorage.setItem('task', task);
    router.push(paths.task);
  };
};
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
