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
        <div class="signin">
            <button @click.prevent="authWithGithub">auth</button>
        </div>
    </div>
</template>

<script>
    import { membersDB, Firebase } from '../../database/firebaseinit.js';

    let provider = new Firebase.auth.GithubAuthProvider();

    provider.addScope('repo');

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
            },
            authWithGithub: function() {
                Firebase.auth().signInWithPopup(provider).then(function(result) {
                    let token = result.credential.accessToken;
                    let user = result.user;
                    console.log(token, user, result);

                    console.log(Firebase.User);
                }).catch(function(error) {
                    console.log(error);
                    console.log(Firebase.User);
                });
            }
        },
        firebase: {
            items: membersDB
        }
    }
</script>
