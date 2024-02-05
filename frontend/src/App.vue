<template>
  <div>
    <NavbarTop />
    <router-view />
  </div>
</template>

<script lang="ts" setup>
import NavbarTop from "@/components/navigation/NavbarTop.vue";
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.border-base {
  border: 1px solid #00000078;
  border-radius: 5px;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.btn {
  & *:hover,
  &:hover {
    text-decoration: none !important;
    cursor: pointer !important;
  }
}

.btn-base {
  &.modif-outline:not(.router-link-active) {
    border: 2px solid hsl(205deg 83% 20%) !important;
    &:not(:hover) {
      color: hsl(205deg 83% 20%) !important;
    }
  }

  &:not(.modif-outline),
  &.router-link-active {
    background-color: hsl(205deg 83% 20% / 60%) !important;
    color: white !important;
  }

  * {
    color: inherit !important;
  }

  &:hover {
    color: white !important;
    background-color: hsla(205, 87%, 19%, 0.71);
    cursor: pointer !important;
  }

  & *:hover,
  &:hover {
    text-decoration: none !important;
  }
}
</style>
