<template>
  <div>
    <app-header></app-header>
    <div>
      <div v-for="state in states" v-bind:key = "state._id" class = "state-list" >
          <router-link v-bind:to ="'/' + state._id">
            <h2> {{state.name}}</h2>
          </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    states(){
      return this.$store.state.states;
    }
  },

  data() {
    return {
      myStates: []
    }
  },
      async beforeCreate() {
      await this.$store.dispatch("getStates");

    },

}
</script>

<style>
.state-list{
  max-width:800px;
  margin:0 auto;
  box-sizing:border-box;
  background: #eee;
  font-family: Verdana;
}


</style>
