<template>
  <div>
    <router-view>
      <list-states></list-states>
      <state-page></state-page>
    </router-view>

  </div>
</template>

<script>
import Header from './components/Header.vue';
import ListStates from './components/ListStates.vue';
import StatePage from './components/StatePage'


export default {
  Components:{
    'app-header': Header,
    'list-states': ListStates,
    'state-page': StatePage
  },
  data(){
    return{

    }
  },
  created(){
    this.$root.log = function log(){
      for(let i =0; i < arguments.length; i +=1){
        if(typeof (arguments[i])==='object'){
          try {
            arguments[i] = JSON.parse(JSON.stringify(arguments[i]));
          }catch(e){
            console.error(e);
          }
        }
      }
      console.log(...arguments);
    };
  }


}
</script>

<style>


</style>
