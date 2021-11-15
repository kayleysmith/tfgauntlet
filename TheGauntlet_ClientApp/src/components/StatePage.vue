<template>
  <div>
    <div>
    <app-header></app-header>
    </div>
    <iframe :src=state.data.state.wikipediaUrl height="1000px" width="100%" ></iframe>
  </div>
</template>

<script>



export default {
  data(){

    return {
      id: this.$route.params.id,
      state: {},
  }

  },
  created(){
    this.$http.get('http://localhost:4895/api/v1/state/' + this.id).then(function(data){
      console.log(data);
      this.state = data.body;
    });
  }
}
</script>

<style scoped>
header{
  background:lightgreen;
  padding: 10px;
}
h1{
  color: #222;
  text-align:center;
}

</style>