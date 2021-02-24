<template>
  <div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";


export default defineComponent({
  name: "Home",
  components: {},
  props: {
    totalVuePackages: String,
  },
  data() {
    return {};
  },
  created() {
    const headers = { "Content-Type": "application/json" };
    fetch("http://localhost:8080/auth", {
      method: 'POST', // or 'PUT'
      headers: headers,
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  },
});
</script>
