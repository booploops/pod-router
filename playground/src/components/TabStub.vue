<script setup lang="ts">

const props = defineProps<{
    route: string,
    active?: boolean,
}>()

const emits = defineEmits<{
    'tab-close': [],
    'tab-select': [route: string],
}>()

</script>

<template>
    <div
        class="tab-stub"
        :class="{ active: active }"
        @click="emits('tab-select', route)"
    >
        <div class="tab-text">
            {{ route }}
        </div>
        <button @click.stop="emits('tab-close')">
            x
        </button>
    </div>
</template>

<style scoped>
.tab-stub {
    display: flex;
    align-items: center;
    gap: .5em;
    min-width: 200px;

    background: #ccc;
    padding: 0 .5em;
    border-radius: 4px;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;

    &.active {
        background: #aaa;
    }
}

.tab-text {
    flex: 1;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}
</style>