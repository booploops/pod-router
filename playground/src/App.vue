<script setup lang="ts">
import { ref } from 'vue';
import TabStub from './components/TabStub.vue';
import TabContent from './components/TabContent.vue';

const contextType = ref<'hash' | 'memory'>('memory')

const openTabs = ref<string[]>(['/', '/about?foo=bar']);

const activeTab = ref<number>(0)

</script>

<template>
  <div class="playground-shell">
    <div class="tabs-bar">
      <template
        v-for="(tab, index) in openTabs"
        :key="index"
      >
        <TabStub
          :route="tab"
          @tab-close="openTabs.splice(index, 1)"
          :active="activeTab === index"
          @tab-select="activeTab = index"
        />
      </template>
      <button @click="openTabs.push('/')">New Tab</button>
    </div>
    <div class="content-area">
      <template
        v-for="(tab, index) in openTabs"
        :key="index"
      >
        <TabContent v-model="openTabs[index]" v-show="activeTab === index"/>
      </template>
    </div>
  </div>
</template>

<style scoped>
.playground-shell {
  display: flex;
  flex-direction: column;
  background: red;
  height: 100%;
  width: 100%;
}

.context-toolbar {
  background: green;
  height: 50px;
  width: 100%;
}

.tabs-bar {
  background: rgb(5,5,5);
  height: 50px;
  width: 100%;
  display: flex;
  gap: .5em;
  padding: .5em;
}

.content-area {
  background: yellow;
  flex: 1;
  width: 100%;
  display: flex;
}
</style>