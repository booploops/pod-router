<script setup lang="ts">
import { PodRouter, useRoute } from '@booploops/pod-router'
import { h, defineComponent } from 'vue'

// Define some dummy views for the demo
const HomeView = defineComponent({
    setup() {
        const route = useRoute()
        return () => h('div', { class: 'demo-view' }, [
            h('h3', 'Home View'),
            h('p', 'Welcome to the inline demo router!'),
            h('button', { class: 'demo-btn', onClick: () => route.navigate('/about') }, 'Go to About')
        ])
    }
})

const AboutView = defineComponent({
    setup() {
        const route = useRoute()
        return () => h('div', { class: 'demo-view' }, [
            h('h3', 'About View'),
            h('p', 'This is another route running inside the memory history.'),
            h('div', { class: 'btn-group' }, [
                h('button', { class: 'demo-btn secondary', onClick: () => route.back() }, 'Go Back'),
                h('button', { class: 'demo-btn', onClick: () => route.navigate('/user/42') }, 'User 42 Profile')
            ])
        ])
    }
})

const UserProfile = defineComponent({
    setup() {
        const route = useRoute()
        return () => h('div', { class: 'demo-view' }, [
            h('h3', `User Profile`),
            h('p', `Viewing profile for ID: ${route.params.id}`),
            h('button', { class: 'demo-btn secondary', onClick: () => route.navigate('/') }, 'Back Home')
        ])
    }
})

const routes = [
    { path: '/', name: 'home', component: HomeView },
    { path: '/about', name: 'about', component: AboutView },
    { path: '/user/:id', name: 'user', component: UserProfile }
]
</script>

<template>
    <div class="demo-container">
        <div class="demo-header">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
            <span class="demo-title">PodRouter Demo (Memory Mode)</span>
        </div>
        <div class="demo-body">
            <PodRouter
                :routes="routes"
                history="memory"
                startPath="/"
            />
        </div>
    </div>
</template>

<style scoped>
.demo-container {
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
    overflow: hidden;
    margin: 1.5rem 0;
    background-color: var(--vp-c-bg-soft);
}

.demo-header {
    background-color: var(--vp-c-bg-mute);
    padding: 8px 12px;
    border-bottom: 1px solid var(--vp-c-divider);
    display: flex;
    align-items: center;
    gap: 6px;
}

.dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
}

.dot.red {
    background-color: #ff5f56;
}

.dot.yellow {
    background-color: #ffbd2e;
}

.dot.green {
    background-color: #27c93f;
}

.demo-title {
    margin-left: 8px;
    font-size: 0.8rem;
    color: var(--vp-c-text-2);
    font-family: monospace;
}

.demo-body {
    padding: 20px;
    min-height: 200px;
}

.demo-view h3 {
    margin-top: 0;
    margin-bottom: 1rem;
}

.btn-group {
    display: flex;
    gap: 10px;
}

.demo-btn {
    background-color: var(--vp-c-brand-1);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;
}

.demo-btn:hover {
    background-color: var(--vp-c-brand-2);
}

.demo-btn.secondary {
    background-color: var(--vp-c-bg-mute);
    color: var(--vp-c-text-1);
    border: 1px solid var(--vp-c-divider);
}

.demo-btn.secondary:hover {
    background-color: var(--vp-c-default-soft);
}
</style>
