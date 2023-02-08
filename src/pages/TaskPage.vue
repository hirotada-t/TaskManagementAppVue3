<script setup lang='ts'>
  import { onMounted, onBeforeUnmount, ref, nextTick } from 'vue';
  import TaskColumn from '../components/TaskColumn.vue';
  // import ArchiveItem from '../components/ArchiveItem.vue';
  import ScrollBooster from 'scrollbooster';

  const ic = {
    zoom: {
      in: 'zoom_in',
      out: 'zoom_out'
    },
    filter: {
      on: 'filter_alt',
      off: 'filter_alt_off'
    }
  }
  let data = [];
  if (localStorage.getItem('task')) data = JSON.parse(localStorage.getItem('task'));

  const taskList = ref(data);
  const rightDrawerOpen = ref(false);
  const newSectionInput = ref(false);
  const sb = ref(null);
  const newSection = ref('');
  const filtered = ref(false);
  const scaled = ref(false);
  const taskListTitle = ''
  const archiveList = [];

  const addSectionInput = () => {
    newSectionInput.value = !newSectionInput.value;
    nextTick(() => {
      const newSect = document.querySelector('.new-section input');
      newSect.focus();
      newSect.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.addSection();
        }
      })
    });
    if (window.matchMedia('(min-width: 1024px)').matches) {
      updateScrollBooster();
    }
  }
  const addSection = () => {
    const date = new Date();
    newSectionInput.value = !newSectionInput.value;
    taskList.value.push({
      'sectionId': 's-' + date.toLocaleString(),
      'sectionName': newSection.value ? newSection.value : 'Section title',
      'archives': false,
      'cardList': []
    });
    newSection.value = '';
  }
  const updateScrollBooster = () => {
    nextTick(() => {
      sb.value.updateMetrics();
    });
  }
  const saveData = async () => {
    const date = new Date();
    const options = {
      suggestedName: taskListTitle ? taskListTitle : date.toLocaleString(),
      types: [{
        description: 'JSON file',
        accept: { 'application/json': ['.json'] },
      }],
    };
    try {
      const handle = await window.showSaveFilePicker(options);
      const writable = await handle.createWritable();
      await writable.write(JSON.stringify(taskList.value));
      await writable.close();
    } catch (e) {
      alert('保存をキャンセルしました。');
    }
  }
  const confirmSave = (e) => {
    e.returnValue = '';
  }
  const scaleCardArea = () => {
    const content = document.querySelector('.content');
    if (content.classList.contains('zoom-out')) {
      content.classList.remove('zoom-out');
    } else {
      content.classList.add('zoom-out');
      content.style.width = window.screen.width + 'px';
    }
  }
  const addArchiveList = (e) => {
    this.archiveList.unshift(e);
  }
  const deletedUpdate = (e) => {
    for (let i = 0; i < taskList.value.length; i++) {
      for (let j = 0; j < taskList.value[i].cardList.length; j++) {
        if (taskList.value[i].cardList[j].cardId === e) {
          taskList.value[i].cardList[j].deleted = true;
          console.log(taskList.value)
        }
      }
    }
  }

  onMounted(() => {
    const viewport = document.querySelector('.viewport');
    const content = document.querySelector('.content');
    if (window.matchMedia('(min-width: 1024px)').matches) {
      sb.value = new ScrollBooster({
        viewport,
        content,
        direction: 'horizontal',
        scrollMode: 'native',
      });
    }

    // const taskListTitle = document.querySelector('.task-list-title');
    // taskListTitle.addEventListener('keydown', (e) => {
    //   if (e.key === 'Enter') {
    //     this.saveData();
    //   }
    // });

    if (typeof taskList.value === 'undefined') return;
    if (taskList.value.length > 0) {
      for (let i = 0; i < taskList.value.length; i++) {
        console.log(taskList.value[i])

        if (taskList.value[i].cardList.length > 0) {
          for (let j = 0; j < taskList.value[i].cardList.length; j++) {
            if (taskList.value[i].cardList[j].archives) {
              archiveList.push({
                'cardId': taskList.value[i].cardList[j].cardId,
                'cardName': taskList.value[i].cardList[j].cardName,
                'priority': taskList.value[i].cardList[j].priority,
                'checked': taskList.value[i].cardList[j].checked,
                'deleted': taskList.value[i].cardList[j].deleted,
              });
            }
          }
        }
      }
    }
  });
  onBeforeUnmount(() => {
    // alert('aa')
  })

</script>

<template>
  <q-page>
    <q-header elevated class="bg-grey-7 desktop-only text-black">
      <q-toolbar class="q-py-sm q-gutter-md">
        <div class="col-1">
          <q-btn icon="keyboard_return" class="full-width bg-grey-4" label="back" size="15px" to="/" />
        </div>
        <!-- <div class="col-3 task-list-title">
          <q-input dense outlined bg-color="grey-2" v-model="taskListTitle" placeholder="taskListTitle"
            class="full-width" style="font-size: 25px;">
            <template v-slot:append>
              <q-icon v-if="taskListTitle === ''" name="edit" />
              <q-icon v-else name="clear" class="cursor-pointer" @click="taskListTitle = ''" />
            </template>
          </q-input>
        </div> -->
        <div class="col-2">
          <q-btn label="save" class="full-width bg-deep-orange-3" @click="saveData" size="15px" icon="save_alt" />
        </div>
        <div class="col-2">
          <q-btn :label="filtered ? 'filtered' : 'unfiltered'" class="full-width bg-light-blue-3"
            @click="filtered = !filtered" size="15px" :icon="filtered? ic.filter.on: ic.filter.off">
            <q-tooltip>
              Remove uncleared
            </q-tooltip>
          </q-btn>
        </div>
        <q-btn dense flat class="text-white q-ml-auto" round icon="menu" @click="rightDrawerOpen = !rightDrawerOpen" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="rightDrawerOpen" side="right" overlay behavior="mobile" bordered>
      <div class="column column-responsive-reverse menu-justify bg-blue-grey-1" style="height:100%;">
        <div class="bottom-menu column column-responsive-reverse">
          <div class="close-btn">
            <div class="text-right q-px-md">
              <q-btn flat round icon="close" label="close" @click="rightDrawerOpen = !rightDrawerOpen" />
            </div>
          </div>
          <div class="others">
            <q-list bordered class="rounded-borders">
              <q-expansion-item class="text-h5" expand-separator label="Others">
                <q-list class="text-h6">
                  <q-item clickable v-ripple to="/">
                    <q-item-section class="items-end" avatar>
                      <q-icon name="keyboard_return" />
                    </q-item-section>
                    <q-item-section>back to Top</q-item-section>
                  </q-item>
                  <q-item disable>
                    <q-item-section class="items-end" avatar>
                      <q-icon name="hourglass_top" />
                    </q-item-section>
                    <q-item-section>comming later...</q-item-section>
                  </q-item>
                </q-list>
              </q-expansion-item>
            </q-list>
          </div>
        </div>
        <div class="archive-list">
          <p class="text-h5 q-pt-md q-pl-md">Archive List</p>
          <div v-if="archiveList.length != 0">
            <div class="archive-area bg-blue-grey">
              <div v-for="item of archiveList" :key="item.cardId">
                <ArchiveItem :archiveItem="item" @deleted-item="deletedUpdate"></ArchiveItem>
              </div>
            </div>
          </div>
          <div v-else class="text-center">
            <p class="text-h6 text-indigo-7"><span class="material-icons">search_off</span>No Archives…</p>
          </div>
        </div>
      </div>
    </q-drawer>

    <div class="task-container">
      <div class="q-py-md q-py-md viewport">
        <div class="row no-wrap q-gutter-none content">
          <div v-for="section of taskList" :key="section.sectionId">
            <TaskColumn :section="section" :filter="filtered" @add-archive-list="addArchiveList"></TaskColumn>
          </div>
          <div>
            <div class="q-pa-sm w-300px" v-if="newSectionInput">
              <q-card class="my-card bg-blue-grey-1 q-pa-md">
                <q-input borderless class="new-section" v-model="newSection" placeholder="sectionName" />
                <q-btn flat label="cancel" color="primary" @click="newSectionInput = false" class="q-mt-sm" />
                <q-btn push label="add" color="primary" @click="addSection" class="q-mt-sm" />
              </q-card>
            </div>
          </div>
          <div>
            <div class="q-pa-sm w-300px">
              <q-card class="my-card bg-blue-grey-1">
                <q-btn flat class="full-width" label="＋ add sectiion" @click="addSectionInput" />
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="absolute-bottom bg-blue-grey-9 text-white mobile-only">
      <q-tabs align="justify">
        <q-route-tab label="" dense icon="keyboard_return" to="/#" exact />
        <q-tab label="save" dense icon="save_alt" @click="saveData" />
        <q-tab label="zoom" dense :icon="scaled? ic.zoom.in: ic.zoom.out" @click="
        scaled = !scaled;scaleCardArea()" />
        <q-tab label="filter" dense :icon="filtered? ic.filter.on: ic.filter.off" @click="filtered = !filtered" />
        <q-tab label="menu" dense icon="menu" @click="rightDrawerOpen = !rightDrawerOpen" />
      </q-tabs>
    </footer>

  </q-page>
</template>

<style lang="scss" scoped>
  @media screen and (max-width:1023px) {
    .menu-justify {
      justify-content: space-between;
    }

    .column-responsive-reverse {
      flex-direction: column-reverse;
    }
  }

  .task-container {
    height: calc(100vh - 72px);
    @media screen and (min-width:1024px) {
      height: calc(100vh - 65px);
    }
  }

  .w-300px {
    width: 300px;
  }

  .viewport {
    overflow-x: auto;
    overflow-y: hidden;
    height: 100%;
    margin: auto;

    @media screen and (max-width:599px) {
      display: flex;
      align-items: flex-end;
    }
  }

  .viewport::-webkit-scrollbar {
    height: 10px;
  }

  .viewport::-webkit-scrollbar-track {
    background-color: #55555570;
    border-radius: 100px;
    margin: 10px;
  }

  .viewport::-webkit-scrollbar-thumb {
    border-radius: 100px;
    background-color: #eee;
  }

  .content {
    transition: .3s;

    @media screen and (max-width:599px) {
      align-items: flex-end;
    }
  }

  .zoom-out {
    transform-origin: left top;
    transform: scale(0.5);
    margin-top: auto;
    height: 200%;
  }

  .archive-area {
    max-height: calc(100vh - 280px);
    overflow: auto;

    @media screen and (max-width:599px) {
      max-height: calc(100vh - 160px);
    }
  }

  .archive-area::-webkit-scrollbar {
    width: 5px;
  }

  .archive-area::-webkit-scrollbar-track {
    background-color: #55555570;
    border-radius: 100px;
    margin: 8px;
  }

  .archive-area::-webkit-scrollbar-thumb {
    border-radius: 100px;
    background-color: #eee;
  }
</style>
