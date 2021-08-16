<template>
  <div ref="grid" style="width: 100%;"></div>
</template>

<script>
import Grid from 'tui-grid'

export default {
  name: 'Grid',
  data() {
    return {
      clickKey: ''
    }
  },
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
    summary: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    this.initGrid()
    Grid.applyTheme('striped')
  },
  watch: {
    data() {
      this.instance.resetData(this.data)
    }
  },
  methods: {
    initGrid() {
      const options = {
        el: this.$refs.grid,
        // rowHeaders: ['rowNum', 'checkbox'],
        rowHeaders: ['rowNum'],
        // bodyHeight: window.innerHeight - 120,
        bodyHeight: 450,
        columns: this.columns,
        data: [],
        columnOptions: {
          resizable: true,
          frozenCount: 1,
          frozenBorderWidth: 2
        }
      }

      // if (Object.keys(this.summary).length > 0) {
      //   options.summary = this.summary
      // }
      this.instance = new Grid(options)

      this.instance.on('click', ({ rowKey, columnName, nativeEvent }) => {
        if (columnName === 'name') {
          this.$emit('getRow', { evt: nativeEvent, data: this.instance.getRow(rowKey) })
        } else {
          this.$emit('closeMenu')
        }
      })

      this.instance.resetData(this.data)
    }
  }
}
</script>

<style scoped>
@import '~tui-grid/dist/tui-grid.css';
</style>
