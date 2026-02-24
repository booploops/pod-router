<script setup lang="ts">
import { useTemplateRef } from 'vue';
import PodRouter from '../../../src/PodRouter.vue';
import routes from '../routes';
import NavigateToMenu from './NavigateToMenu.vue';

const currentRoute = defineModel<string>({ required: true, })
const router = useTemplateRef('podRouter');

const forward = () => {
    router.value?.forward()
}

const back = () => {
    router.value?.back()
}

const reload = () => {
    router.value?.reload()
}

const routeHasChanged = (to: any, from: any) => {
    console.log('Route changed from', from.path, 'to', to.path)
}

const beforeRouteChange = (to: any, from: any) => {
    console.log('Before route change:', { to: to.path, from: from?.path })
}

const onRouteNotFound = (path: string) => {
    console.warn('Route not found:', path)
}

const onNavigate = (path: string) => {
    console.log('Navigate to:', path)
}

const onBack = () => {
    console.log('Back navigation')
}

const onForward = () => {
    console.log('Forward navigation')
}

const onReload = () => {
    console.log('Reload triggered')
}

const navigateTo = (path: string) => {
    currentRoute.value = path
}

</script>

<template>
    <div class="tab-shell">
        <div class="tab-controls">
            <button @click="back">
                Back
            </button>
            <button @click="forward">
                Forward
            </button>
            <button @click="reload">
                Refresh
            </button>
            <NavigateToMenu @navigate="navigateTo" />
        </div>
        <div class="tab-content">
            <PodRouter
                ref="podRouter"
                :routes="routes"
                v-model="currentRoute"
                history="memory"
                @route-change="routeHasChanged"
                @before-route-change="beforeRouteChange"
                @route-not-found="onRouteNotFound"
                @navigate="onNavigate"
                @back="onBack"
                @forward="onForward"
                @reload="onReload"
            >
                <template #default="{ Component, route }">
                    <transition
                        name="fade"
                        mode="out-in"
                    >
                        <component
                            :is="Component"
                            v-bind="route.params"
                            :key="route.key"
                        />
                    </transition>
                </template>
            </PodRouter>
        </div>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.tab-shell {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
}

.tab-controls {
    background: #eee;
    height: 40px;
    width: 100%;
    display: flex;
    align-items: center;
    gap: .5em;
    padding: 0 .5em;
}

.tab-content {
    background: #ddd;
    flex: 1;
    width: 100%;
    overflow: hidden;
    overflow-y: scroll;
}
</style>