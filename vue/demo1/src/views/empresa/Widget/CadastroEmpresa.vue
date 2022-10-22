<template>
  <div class="modal fade" ref="modal" :tabindex="-1" id="vbo_empresa_cadastro">
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
          <h5 class="modal-title">Cadastro de novo cliente</h5>
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
            name="formEmpresa"
            id="formEmpresa"
            class="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
            ref="form"
            mode="passive"
            @submit="isCadastroNovo === true ? cadastrar() : atualizar()"
            :validation-schema="validacoes"
          >
            <div class="row mb-6">
              <!--begin::Label-->
              <label class="col-lg-4 col-form-label fw-bold fs-6"
                >Logomarca</label
              >
              <!--end::Label-->

              <!--begin::Col-->
              <div class="col-lg-8">
                <!--begin::Image input-->
                <div
                  class="image-input image-input-outline"
                  data-kt-image-input="true"
                  style="background-image: url(media/avatars/blank.png)"
                >
                  <!--begin::Preview existing avatar-->
                  <div
                    class="image-input-wrapper w-100 mh-200px"
                    style="min-width: 200px"
                    :style="`background-image: url('${
                      cadastro.imagem !== null ? cadastro.imagem : previewImage
                    }')`"
                  ></div>
                  <!--end::Preview existing avatar-->

                  <!--begin::Label-->
                  <label
                    class="
                      btn btn-icon btn-circle btn-active-color-primary
                      w-25px
                      h-25px
                      bg-white
                      shadow
                    "
                    data-kt-image-input-action="change"
                    data-bs-toggle="tooltip"
                    title="Change avatar"
                  >
                    <i class="bi bi-pencil-fill fs-7"></i>

                    <!--begin::Inputs-->
                    <input
                      type="file"
                      name="avatar"
                      @change="onFileAdd"
                      accept=".png, .jpg, .jpeg"
                      ref="imagem"
                    />
                    <input type="hidden" name="avatar_remove" />
                    <!--end::Inputs-->
                  </label>
                  <!--end::Label-->

                  <!--begin::Remove-->
                  <span
                    class="
                      btn btn-icon btn-circle btn-active-color-primary
                      w-25px
                      h-25px
                      bg-white
                      shadow
                    "
                    data-kt-image-input-action="remove"
                    data-bs-toggle="tooltip"
                    @click="removeImage()"
                    title="Remove avatar"
                  >
                    <i class="bi bi-x fs-2"></i>
                  </span>
                  <!--end::Remove-->
                </div>
                <!--end::Image input-->

                <!--begin::Hint-->
                <div class="form-text">Aceito somento arquivos de imagem</div>
                <!--end::Hint-->
              </div>
              <!--end::Col-->
            </div>
            <div class="row mb-6">
              <label class="col-lg-4 col-form-label required fw-bold fs-6"
                >Nome</label
              >
              <div class="col-lg-8 fv-row">
                <Field
                  type="text"
                  name="vboNome"
                  class="form-control form-control-lg form-control-solid"
                  placeholder="Nome da empresa"
                  v-model="cadastro.nome"
                />
                <div class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    <ErrorMessage name="vboNome" />
                  </div>
                </div>
              </div>
            </div>

            <div class="row mb-6">
              <label class="col-lg-4 col-form-label required fw-bold fs-6"
                >Email</label
              >
              <div class="col-lg-8 fv-row">
                <Field
                  type="email"
                  name="vboEmail"
                  class="form-control form-control-lg form-control-solid"
                  placeholder="email@daempresa.com"
                  v-model="cadastro.email"
                />
                <div class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    <ErrorMessage name="vboEmail" />
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
            form="formEmpresa"
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
interface Empresa {
  id: string;
  nome: string;
  cnpj: string;
  email: string;
  imagem: string;
  anoFundacao: number;
}

import { defineComponent, ref, reactive, onMounted, watch } from "vue";
import Swal from "sweetalert2/dist/sweetalert2.min.js";
import { Field, Form, ErrorMessage } from "vee-validate";
import * as Yup from "yup";
import { pt } from "yup-locale-pt";
import ApiService from "@/core/services/ApiService";
import emitter from "tiny-emitter/instance";

export default defineComponent({
  name: "CadastrarEmpresa",
  components: { Field, Form, ErrorMessage },
  props: {
    empresa: Object,
  },
  emits: ["close"],
  setup(props, context) {
    Yup.setLocale(pt);
    const valoresIniciais = {
      imagem: null,
      id: null,
      nome: null,
      cnpj: null,
      email: null,
      anoFundacao: null,
    };
    const cadastro = ref<any>(JSON.parse(JSON.stringify(valoresIniciais)));
    const previewImage = ref("media/avatars/blank.png");
    const empresaProp = reactive<any>(props);
    const modal = ref<HTMLElement | null>(null);
    const closeModal = ref<HTMLButtonElement | null>(null);
    const submitButton = ref<HTMLButtonElement | null>(null);
    const isCadastroNovo = ref(true);
    const form = ref<HTMLFormElement>();
    const imagem = ref<any>();

    const validacoes = Yup.object().shape({
      vboNome: Yup.string().required().nullable().min(3).label("Nome"),
      vboCnpj: Yup.string().required().nullable().label("CNPJ"),
      vboEmail: Yup.string().required().nullable().email().label("Email"),
    });

    onMounted(() => {
      modal.value?.addEventListener("hidden.bs.modal", () => {
        isCadastroNovo.value = true;
        cadastro.value = JSON.parse(JSON.stringify(valoresIniciais));
        form.value?.resetForm();
        context.emit("close");
      });
    });

    watch(empresaProp, () => {
      if (empresaProp.empresa === null) return;
      isCadastroNovo.value = false;
      const empresa = empresaProp.empresa;
      const merged = { ...cadastro.value, ...empresa };
      cadastro.value = merged;
    });

    const onFileAdd = (event) => {
      cadastro.value.imagem = null;
      const input = event.target;
      let count = input.files.length;
      let index = 0;
      if (input.files) {
        while (count--) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            previewImage.value = e.target.result;
          };
          reader.readAsDataURL(input.files[index]);
          index++;
        }
      }
    };

    const removeImage = () => {
      cadastro.value.imagem = null;
      previewImage.value = "media/avatars/blank.png";
    };

    const atualizarEmpresa = (data) => {
      emitter.emit("atualizarEmpresa", data);
    };

    const adicionarEmpresa = (data) => {
      emitter.emit("adicionarEmpresa", data);
    };

    const setWaitButtonOn = () => {
      if (submitButton.value) {
        submitButton.value.setAttribute("data-kt-indicator", "on");
      }
    };

    const setWaitButtonOff = () => {
      if (submitButton.value) {
        submitButton.value.removeAttribute("data-kt-indicator");
      }
    };

    const cadastrar = () => {
      setWaitButtonOn();
      const formData = new FormData();
      formData.append("imagem", imagem.value.files[0]);
      formData.append("model", JSON.stringify(cadastro.value));

      ApiService.post("empresa/cadastrar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then(({ data }) => {
          cadastro.value.id = data.id;
          adicionarEmpresa(cadastro.value);
          Swal.fire({
            text: "Empresa foi registrada com sucesso!",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Ok, proximo!",
            customClass: {
              confirmButton: "btn fw-bold btn-light-primary",
            },
          }).then(() => {
            closeModal.value?.click();
          });
        })
        .catch(({ response }) => {
          Swal.fire({
            text: response.data,
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Tente de novo!",
            customClass: {
              confirmButton: "btn fw-bold btn-light-danger",
            },
          });
        })
        .finally(() => {
          setWaitButtonOff();
        });
    };

    const atualizar = () => {
      setWaitButtonOn();
      const formData = new FormData();
      formData.append("imagem", imagem.value.files[0]);
      formData.append("model", JSON.stringify(cadastro.value));

      ApiService.post("empresa/atualizar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then(() => {
          atualizarEmpresa(cadastro.value);
          Swal.fire({
            text: cadastro.value["nome"] + " foi atualizado com sucesso!",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Ok, proximo!",
            customClass: {
              confirmButton: "btn fw-bold btn-light-primary",
            },
          }).then(() => {
            closeModal.value?.click();
          });
        })
        .catch(({ response }) => {
          Swal.fire({
            text: response.data,
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Tente de novo!",
            customClass: {
              confirmButton: "btn fw-bold btn-light-danger",
            },
          });
        })
        .finally(() => {
          setWaitButtonOff();
        });
    };

    return {
      Form,
      Field,
      ErrorMessage,
      isCadastroNovo,
      cadastro,
      modal,
      form,
      closeModal,
      submitButton,
      validacoes,
      cadastrar,
      atualizar,
      onFileAdd,
      removeImage,
      previewImage,
      imagem,
    };
  },
});
</script>
