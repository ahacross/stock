<template>
  <q-dialog ref="dialog" @hide="onDialogHide" persistent>
    <q-card class="q-dialog-plugin" >
      <q-card-section>
        <div class="text-h6">물타기 {{ commaOn(row.flat) }}</div>
      </q-card-section>
      <q-separator />
      <table style="width: 100%;padding: 10px;">
        <tbody>
          <tr>
            <td><q-input v-model="tempClose" label="물타기 단가" type="tel" @blur="onBlur" @keydown.enter="onBlur" /></td>
          </tr>
          <tr>
            <td><q-input v-model="tempCount" label="물타기 수량" type="tel" @blur="onBlur" @keydown.enter="onBlur" /></td>
          </tr>
        </tbody>
      </table>
      <q-separator style="margin-top: 5px; "/>
      <div style="text-align: center;width:95%;">
        물탄 후 단가: {{ commaOn(newFlat) }}
      </div>
      <q-separator style="margin-top: 5px;"/>
      <!-- buttons example -->
      <q-card-actions align="right">
        <q-btn label="Cancel" @click="onCancelClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { commaOn } from '@/js/index'
export default {
  data() {
    return {
      row: {},
      tempClose: 0,
      tempCount: 0,
      newFlat: 0
    }
  },
  emits: [
    // REQUIRED
    'ok', 'hide'
  ],
  methods: {
    commaOn,
    // following method is REQUIRED
    // (don't change its name --> "show")
    show(row) {
      this.row = row
      this.tempClose = row.close
      this.tempCount = 0
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
      this.$emit('ok')
      // or with payload: this.$emit('ok', { ... })

      // then hiding dialog
      this.hide()
    },

    onCancelClick () {
      // we just need to hide the dialog
      this.hide()
    },

    onBlur() {
      let { flat, count } = this.row
      flat = Number(flat)
      count = Number(count)
      const tempClose = Number(this.tempClose)
      const tempCount = Number(this.tempCount)
      console.log(flat, count, tempClose, tempCount)
      this.newFlat = Math.floor(((flat * count) + (tempClose * tempCount)) / (count + tempCount))
    }
  }
}
</script>
