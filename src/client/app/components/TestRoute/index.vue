<template>
    <div class="vuediv">Hello {{ msg }}</div>
</template>

<script>
    export default {
        data() {
            return {
                msg: "VUE"
            }
        }
    }
</script>

<style>
    .vuediv {
        color: red
    }
</style>