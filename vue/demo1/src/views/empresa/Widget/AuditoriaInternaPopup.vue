<template>
  <div
    class="modal fade"
    ref="modal"
    tabindex="-1"
    id="auditoria_interna_popup"
  >
    <div class="modal-dialog modal-dialog-scrollable modal-fullscreen">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Auditoria interna</h5>
          <!--begin::Close-->
          <div
            class="btn btn-icon btn-sm btn-active-light-primary ms-2"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <span class="svg-icon svg-icon-2x"></span>
          </div>
          <!--end::Close-->
        </div>
        <div class="modal-body">
          <div class="w-100 p-2">
            <div class="p-2 w-100">
              <table class="table align-middle gs-0 border">
                <thead>
                  <th class="w-400px ps-4">Descrição</th>
                  <th class="w-100px">Conforme</th>
                  <th>Evidências</th>
                </thead>
                <tbody>
                  <tr v-for="pergunta in listaAuditoria" :key="pergunta.id">
                    <td class="ps-4">
                      <textarea
                        rows="5"
                        class="w-100 border-light"
                        v-model="pergunta.titulo"
                      ></textarea>
                    </td>
                    <td class="ps-4">
                      <div
                        class="form-check form-check-solid form-switch fv-row"
                      >
                        <input
                          class="form-check-input w-45px h-30px"
                          type="checkbox"
                          id="isRealizada"
                          v-model="pergunta.conforme"
                        />
                        <label
                          class="form-check-label"
                          for="isRealizada"
                        ></label>
                      </div>
                    </td>
                    <td class="p-3">
                      <textarea
                        rows="5"
                        class="w-100 form-input border border-secondary"
                      ></textarea>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            ref="closeModal"
            class="btn btn-light"
            data-bs-dismiss="modal"
          >
            Fechar
          </button>
          <button type="submit" class="btn btn-primary" ref="submitButton">
            <span class="indicator-label"> Salvar </span>

            <span class="indicator-progress">
              Aguarde...
              <span
                class="spinner-border spinner-border-sm align-middle ms-2"
              ></span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, watch } from "vue";

export default defineComponent({
  name: "CadastrarEmpresa",
  components: {},
  props: {
    listaAuditoria: Object,
  },
  emits: ["close"],
  setup(props) {
    const eventoProp = reactive<any>(props);
    const closeModal = ref<HTMLButtonElement | null>(null);
    const submitButton = ref<HTMLButtonElement | null>(null);

    watch(eventoProp, () => {
      console.log("oi");
      console.log(eventoProp);
    });

    return {
      submitButton,
      closeModal,
    };
  },
});
</script>
