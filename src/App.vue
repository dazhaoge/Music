<template>
  <div id="app" class="c-flexColumn">
    <Header/>
    <router-view/>
    <GlobalLoading v-if="$store.state.globalLoading > 0"/>
  </div>
</template>

<script>

import GlobalLoading from "@/components/GlobalLoading.vue";
import Header from "@/components/Header.vue";


export default {
  components: {
    GlobalLoading,
    Header
  },
}
</script>


<style lang="scss">
#app {
  height:100%;
  background: #fbffff;
}

</style>
