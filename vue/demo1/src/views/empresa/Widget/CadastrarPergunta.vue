<template>
  <div class="modal fade" ref="modal" tabindex="-1" id="cadastrar_pergunta">
    <div
      class="
        modal-dialog
        modal-dialog-centered
        modal-dialog-scrollable
        modal-fullscreen-sm-down
      "
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{
              isCadastroNovo === true
                ? "Cadastro de nova pergunta"
                : "Atualizar pergunta"
            }}
          </h5>
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
          <Form
            novalidate="novalidate"
            autocomplete="false"
            name="formEvento"
            id="formEvento"
            class="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
            ref="form"
            @submit="isCadastroNovo === true ? cadastrar() : atualizar()"
            :validation-schema="validacoes"
          >
            <div class="row mb-6">
              <label class="col-lg-4 col-form-label required fw-bold fs-6"
                >Pergunta</label
              >
              <div class="col-lg-8 fv-row">
                <Field
                  type="text"
                  name="pergunta"
                  class="form-control form-control-lg form-control-solid"
                  placeholder="Pergunta a ser feita"
                  v-model="cadastro.pergunta"
                />
                <div class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    <ErrorMessage name="vboTema" />
                  </div>
                </div>
              </div>
            </div>
          </Form>
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
          <button
            type="submit"
            class="btn btn-primary"
            form="formEvento"
            ref="submitButton"
          >
            <span class="indicator-label">
              {{ isCadastroNovo === true ? "Cadastrar" : "Atualizar" }}
            </span>

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
import { defineComponent, ref, reactive, onMounted, watch } from "vue";
import { Field, Form, ErrorMessage } from "vee-validate";
import * as Yup from "yup";
import { pt } from "yup-locale-pt";
import emitter from "tiny-emitter/instance";

export default defineComponent({
  name: "CadastrarEmpresa",
  components: { Field, Form, ErrorMessage },
  props: {
    evento: Object,
  },
  emits: ["close"],
  setup(props, context) {
    Yup.setLocale(pt);
    const valoresIniciais = {
      pergunta: null,
    };

    const cadastro = ref<any>(JSON.parse(JSON.stringify(valoresIniciais)));
    const eventoProp = reactive<any>(props);
    const modal = ref<HTMLElement | null>(null);
    const closeModal = ref<HTMLButtonElement | null>(null);
    const submitButton = ref<HTMLButtonElement | null>(null);
    const isCadastroNovo = ref(true);
    const form = ref<HTMLFormElement>();

    const validacoes = Yup.object().shape({
      pergunta: Yup.string().nullable().required().label("Pergunta"),
    });

    onMounted(() => {
      modal.value?.addEventListener("hidden.bs.modal", () => {
        isCadastroNovo.value = true;
        cadastro.value = JSON.parse(JSON.stringify(valoresIniciais));
        form.value?.resetForm();
        context.emit("close");
      });
    });

    watch(eventoProp, () => {
      if (eventoProp.evento === null) return;
      isCadastroNovo.value = false;
      const evento = eventoProp.evento;
      const merged = { ...cadastro.value, ...evento };
      cadastro.value = merged;
    });

    const atualizarPergunta = (data) => {
      emitter.emit("atualizarPergunta", data);
    };

    const adicionarPergunta = (data) => {
      emitter.emit("adicionarPergunta", data);
    };

    const cadastrar = () => {
      adicionarPergunta(cadastro.value);
    };

    const atualizar = () => {
      atualizarPergunta(cadastro.value);
      //   const formData = new FormData();
      //   formData.append("relatorio", relatorio.value.files[0]);
      //   const data = JSON.stringify(cadastro.value, (key, value) => {
      //     if (value !== null) return value;
      //   });

      //   formData.append("model", data);

      //   ApiService.post("admin/eventos/atualizar", formData, {
      //     headers: {
      //       "Content-Type": "multipart/form-data"
      //     }
      //   }).then(() => {
      //     atualizarPergunta(cadastro.value);
      //     Swal.fire({
      //       text: "Evento no " + cadastro.value["empresa"] + " foi atualizado com sucesso!",
      //       icon: "success",
      //       buttonsStyling: false,
      //       confirmButtonText: "Ok, proximo!",
      //       customClass: {
      //         confirmButton: "btn fw-bold btn-light-primary",
      //       },
      //     }).then(() => {
      //       closeModal.value?.click();
      //     });
      //   })
      //   .catch(({ response }) => {
      //     Swal.fire({
      //       text: response.data,
      //       icon: "error",
      //       buttonsStyling: false,
      //       confirmButtonText: "Tente de novo!",
      //       customClass: {
      //         confirmButton: "btn fw-bold btn-light-danger"
      //       }
      //     });
      //   })
      //   .finally(() => {
      //     setWaitButtonOff();
      //   });
    };

    return {
      Form,
      Field,
      ErrorMessage,
      isCadastroNovo,
      cadastro,
      modal,
      form,
      submitButton,
      closeModal,
      validacoes,
      cadastrar,
      atualizar,
    };
  },
});
</script>
