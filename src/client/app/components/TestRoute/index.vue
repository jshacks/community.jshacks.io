<template>
    <div>
        <div class="vuediv">Hello {{ msg }}</div>
    </div>
</template>

<style scoped>
    .vuediv {
        color: red
    }
</style>

<script>
    export default {
        data() {
            return {
                msg: "VUE"
            }
        }
    }
</script>

