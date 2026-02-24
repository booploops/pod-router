<script setup lang="ts">
import { useRoute } from '../../src/useRoute';

const route = useRoute();
const currentTime = new Date().toLocaleString();
console.log(route)
</script>

<template>
    <div>
        <h1>Component page</h1>
        <p>
            This is a component page. The current time is: {{ currentTime }}.
        </p>
        <div style="margin-top: 20px; padding: 10px; background: #f0f0f0; border-radius: 4px;">
            <h3>Route Information (via useRoute)</h3>
            <p><strong>Path:</strong> {{ route.path }}</p>
            <p><strong>Params:</strong> {{ JSON.stringify(route.params) }}</p>
            <p><strong>Query:</strong> {{ JSON.stringify(route.query) }}</p>
            <p><strong>Hash:</strong> {{ route.hash || 'none' }}</p>
            <p><strong>Current Route Name:</strong> {{ route.currentRoute?.name || 'none' }}</p>
        </div>
        <div style="margin-top: 10px;">
            <button @click="route.navigate('/dashboard')">Go to Dashboard</button>
            <button @click="route.back()">Back</button>
            <button @click="route.forward()">Forward</button>
            <button @click="route.reload()">Reload</button>
        </div>
    </div>
</template>

<style scoped lang="scss">

</style>