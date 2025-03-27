<template>
  <Header />
  <router-view />
  <Footer />
</template>

<script>
import Header from './components/ComHeader.vue';
import Footer from './components/ComFooter.vue';

export default {
  name: 'App',
  components: {
    Header,
    Footer
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body {
  transition: background-color 0.3s, color 0.3s;
}

</style>
