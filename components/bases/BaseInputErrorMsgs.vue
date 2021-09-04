<template>
  <div
    v-if="data.$error && errorMsg"
    class="text-field-error font-caption text-red-500"
  >
    <small class="helper">
      {{ errorMsg }}
    </small>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import validation from '~/helpers/validation'

export default Vue.extend({
  props: {
    /**
     * Vuelidate $v object
     */
    data: {
      type: Object,
      default: null,
    },

    customErrorMsg: {
      type: String,
      default: '',
    } as PropOptions<string>,
  },

  computed: {
    errorMsg() {
      const errorField: string =
        this.customErrorMsg || this.failedValidationKey || ''
      return validation(errorField)
    },

    validationKeys(): Array<any> {
      return Object.keys(this.data).filter((key) => !key.startsWith('$'))
    },

    // Get only first failed validation key
    failedValidationKey(): string | null {
      return (
        this.validationKeys.find(
          (validationKey: string) => !this.data[validationKey]
        ) || null
      )
    },
  },
})
</script>

<style lang="scss" scoped>
.text-field-error {
  > .helper {
    font-weight: 500;
  }
}
</style>
