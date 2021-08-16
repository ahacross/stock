<template>
  <q-layout>
    <q-page-container>
      <StockList />
    </q-page-container>
  </q-layout>
</template>

<script>
import StockList from './components/StockList.vue'

export default {
  name: 'LayoutDefault',
  components: { StockList },
  setup () {
  }
}
</script>
