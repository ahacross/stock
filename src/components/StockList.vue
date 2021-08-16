<template>
  <q-page>
    <CompGrid id="compGrid" ref="grid" :columns="columns" :data="data" :summary="summary" @getRow="showMenu" @closeMenu="closeMenu" />
    <CompScaleTradingDialog ref="scaleTrading" />
    <div class="q-pa-md q-gutter-sm pt10 center">
      <q-btn push color="primary" label="추가" class="btn-fixed-width w60p" @click="show" />
      <q-btn push class="btn-fixed-width w50px" icon="autorenew" @click="setStocks" />
    </div>
    <div class="justify-center" style="display: flex;">
      <table style="width: 50%;">
        <tr>
          <td>수익금</td>
          <td style="text-align: right;">{{ commaOn(sumProfitLoss) }}원</td>
        </tr>
        <tr>
          <td>매수금</td>
          <td style="text-align: right;">{{ commaOn(sumBuyPrice) }}원</td>
        </tr>
      </table>
    </div>
    <CompAddDialog ref="dialog" @ok="addEmit"/>
    <div ref="menu" class="q-menu" style="position: absolute; display: none;">
      <q-list style="min-width: 100px">
        <q-item>
          <q-item-section>{{ row.name }}</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable @click="onClickMenu(show)">
          <q-item-section>수정</q-item-section>
        </q-item>
        <q-item clickable @click="onClickMenu(deleteStock)">
          <q-item-section>삭제</q-item-section>
        </q-item>
        <q-item clickable @click="onClickMenu(scaleTrading)">
          <q-item-section>물타기</q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script>
import CompGrid from './grid'
import CompAddDialog from './addDialog'
import CompScaleTradingDialog from './scaleTradingDialog'
import { addStock, getStocks, delStock } from '@/js/storage'
import { commaOn } from '@/js/index'
import { getSise } from '@/api/API'
export default {
  name: 'StockList',
  components: { CompGrid, CompAddDialog, CompScaleTradingDialog },
  setup() {
    const columns = [{
      header: '이름',
      name: 'name',
      width: 100,
      resizable: false
    }, {
      header: '현재가',
      name: 'close',
      width: 100,
      align: 'right',
      formatter({ row, column, value }) {
        return commaOn(value)
      }
    }, {
      header: '손익',
      name: 'profitLoss',
      width: 100,
      align: 'right',
      sortable: true,
      formatter({ row, column, value }) {
        return commaOn(value)
      }
    }, {
      header: '매수액',
      name: 'buyPrice',
      width: 100,
      align: 'right',
      sortable: true,
      formatter({ row, column, value }) {
        return commaOn(value)
      }
    }, {
      header: '거래량',
      name: 'volume',
      width: 100,
      align: 'right',
      formatter({ row, column, value }) {
        return commaOn(value)
      }
    }, {
      header: '평단가',
      name: 'flat',
      width: 100,
      align: 'right',
      formatter({ row, column, value }) {
        return commaOn(value)
      }
    }, {
      header: '주식 수',
      name: 'count',
      width: 100,
      align: 'center'
    }]

    const summary = {
      height: 40,
      position: 'bottom',
      columnContent: {
        profitLoss: {
          template: function (valueMap) {
            return `수익금: ${valueMap.sum}`
          }
        },
        buyPrice: {
          template: function (valueMap) {
            return `매수금: ${valueMap.sum}`
          }
        }
      }
    }

    return {
      columns,
      summary
    }
  },
  data() {
    return {
      data: [],
      isShow: false,
      row: {},
      firstEvent: true
    }
  },
  computed: {
    sumProfitLoss() {
      return this.data.reduce((sum, { profitLoss }) => { sum += profitLoss; return sum }, 0)
    },
    sumBuyPrice() {
      return this.data.reduce((sum, { buyPrice }) => { sum += buyPrice; return sum }, 0)
    }
  },
  created() {
    this.setStocks()
  },
  methods: {
    commaOn,
    show(param = {}) {
      this.$refs.dialog.show(param)
    },
    async setStocks() {
      const stocks = getStocks()
      if (stocks.length > 0) {
        const symbols = stocks.map(({ symbol }) => symbol).join(',')
        if (symbols) {
          const res = await getSise(symbols)
          this.data = stocks.map(stock => {
            const { close, volume, prev_close: prevClose } = res[stock.symbol]
            const closeFlat = close - stock.flat
            const profitLoss = closeFlat * stock.count
            const closePrev = close - prevClose
            const buyPrice = stock.flat * stock.count
            return { ...stock, profitLoss, close, volume, buyPrice, ...this.addColumnClass(closePrev, closeFlat) }
          })
        }
      }
    },
    addColumnClass(closePrev, closeFlat) {
      return {
        _attributes: {
          className: {
            // Add class name on each columns
            column: {
              name: [closePrev > 0 ? 'up' : 'down'],
              profitLoss: [closeFlat > 0 ? 'up' : 'down']
            }
          }
        }
      }
    },
    addEmit(data) {
      addStock(data)
      this.$nextTick(() => {
        this.setStocks()
      })
    },
    deleteStock({ rowKey, symbol }) {
      const grid = this.$refs.grid.instance
      grid.removeRow(rowKey)
      delStock(symbol)
    },
    showMenu({ evt: { clientX: x, clientY: y }, data }) {
      const style = this.$refs.menu.style
      if (this.row.name !== data.name) {
        style.display = 'block'
        style.top = `${y}px`
        style.left = `${x}px`
        this.row = data
      } else {
        this.closeMenu()
      }
    },
    closeMenu() {
      this.$refs.menu.style.display = 'none'
      this.row = {}
    },
    // 물타기
    scaleTrading() {
      this.$refs.scaleTrading.show(this.row)
    },
    onClickMenu(fn) {
      fn(this.row)
      this.closeMenu()
    }
  }
}
</script>

<style lang="scss" scoped>
.right {
  text-align: right;
}
.pt10 {
  padding-top: 10px;
}
.w50px {
  width: 50px;
}
.w60p {
  width: 60%;
}
.center {
  text-align: center;
}
#compGrid::v-deep {
  .tui-grid-cell.up {
    background-color: #ff7886;
  }
  .tui-grid-cell.down {
    background-color: #8fdbff;
  }
}
</style>
