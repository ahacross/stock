<template>
  <q-dialog ref="dialog" @hide="onDialogHide" persistent>
    <q-card class="q-dialog-plugin" >
      <q-card-section>
        <div class="text-h6">종목 추가</div>
      </q-card-section>
      <q-separator />
      <table style="width: 100%;padding: 10px;">
        <tbody>
          <tr>
            <td><q-input v-model="name" label="종목명" @blur="onBlur" /></td>
          </tr>
          <tr v-if="false">
            <td><q-input v-model="symbol" label="symbol" /></td>
          </tr>
          <tr>
            <td><q-input v-model="flat" label="평단가" type="tel" /></td>
          </tr>
          <tr>
            <td><q-input v-model="count" label="주식수" type="tel" @keydown.enter="onOKClick" /></td>
          </tr>
        </tbody>
      </table>

      <q-separator style="margin-top: 5px;"/>
      <!-- buttons example -->
      <q-card-actions align="right">
        <q-btn color="primary" label="save" @click="onOKClick" />
        <q-btn label="Cancel" @click="onCancelClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { ref } from 'vue'
import { getSymbol } from '@/api/API'
export default {
  setup() {
    return {
      name: ref(''),
      symbol: ref(''),
      flat: ref(''),
      count: ref('')
    }
  },
  emits: [
    // REQUIRED
    'ok', 'hide'
  ],
  methods: {
    // following method is REQUIRED
    // (don't change its name --> "show")
    show({ name = '', symbol = '', flat = '', count = '' }) {
      this.name = name
      this.symbol = symbol
      this.flat = String(flat)
      this.count = String(count)
      this.$refs.dialog.show()
    },

    // following method is REQUIRED
    // (don't change its name --> "hide")
    hide () {
      this.$refs.dialog.hide()
    },

    onDialogHide () {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit('hide')
    },

    onOKClick () {
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      const { name, symbol, flat, count } = this
      this.$emit('ok', { name, symbol, flat, count })
      // or with payload: this.$emit('ok', { ... })

      // then hiding dialog
      this.hide()
    },

    onCancelClick () {
      // we just need to hide the dialog
      this.hide()
    },
    async onBlur() {
      const res = await getSymbol(this.name)
      if (res && res.length > 0) {
        const { code, cname } = res[0]
        this.name = cname
        this.symbol = code
      } else {
        this.$q.dialog({
          title: '알림',
          message: '이런 종목이 없습니다.'
        })
      }
    }
  }
}
</script>
