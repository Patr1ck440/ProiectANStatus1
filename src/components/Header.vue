<template>
  <header class="flex justify-between items-center bg-blue-600 text-white p-4 shadow" id="titlu">
    <!-- titlul vine ca prop -->
    <h1 class="text-xl font-bold">{{ title }}</h1>

    <!-- Al doilea buton, plasat înainte de butonul Bootstrap -->
    <button 
      @click="$emit('exercitii')" 
      class="bg-white text-blue-600 font-semibold px-3 py-1 rounded hover:bg-gray-200 mr-2"
    >
      Exerciții
    </button>

    <button 
      @click="$emit('rezultate')" 
      class="bg-white text-blue-600 font-semibold px-3 py-1 rounded hover:bg-gray-200 mr-2"
    >
      Rezultate
    </button>

     <button 
      @click="$emit('about')" 
      class="bg-white text-blue-600 font-semibold px-3 py-1 rounded hover:bg-gray-200 mr-2"
    >
      Despre
    </button>

    <!-- Primul buton cu SVG Bootstrap -->
     
    <button id="toggle-themee"
      @click="$emit('toggle-theme')" 
      class="bg-white text-blue-600 font-semibold px-3 py-1 rounded hover:bg-gray-200"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-brilliance" viewBox="0 0 16 16">
        <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16M1 8a7 7 0 0 0 7 7 3.5 3.5 0 1 0 0-7 3.5 3.5 0 1 1 0-7 7 7 0 0 0-7 7"/>
      </svg>
    </button>
  </header>
</template>

<script>
export default {
  props: ['title'], // primește titlul din App.vue
}
</script>
