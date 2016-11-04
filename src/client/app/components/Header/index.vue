<template>
    <div>
        <router-link to="/">Go to Home</router-link>
        <router-link to="/projects">Go to Projects</router-link>
        <router-link to="/projects/123123">Go to individual project</router-link>
        <router-link to="/members">Go to Members</router-link>
        <router-link to="/members/131212">Go to individual member</router-link>
        <router-link to="/communities">Go to Communities</router-link>
        <router-link to="/communities/123123">Go to individual community</router-link>
        <ul>
            <li v-for="item in items">{{ item.text }}
                <button @click="removeTodo(item['.key'])">X</button>
            </li>
        </ul>
        <form @submit.prevent="addTodo">
            <input v-model="newTodo" />
            <button>Add #{{ items.length }}</button>
        </form>
    </div>
</template>

<script>
    import { membersDB } from '../../database/firebaseinit.js';
    export default {
        data: function() {
            return {
                newTodo: ""
            }
        },
        methods: {
            addTodo: function() {
                if(this.newTodo.trim()) {
                    this.$firebaseRefs.items.push({
                        text: this.newTodo
                    });
                }
                this.newTodo = "";
            },
            removeTodo: function(key) {
                this.$firebaseRefs.items.child(key).remove();
            }
        },
        firebase: {
            items: membersDB
        }
    }
</script>
