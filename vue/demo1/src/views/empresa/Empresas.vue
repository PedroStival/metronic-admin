<template>
  <div class="card">
    <div class="card-header border-0 py-5">
      <h3 class="card-title fw-bolder">Empresas</h3>
      <div class="card-toolbar">
        <!--begin::Menu-->
        <button
          type="button"
          class="btn btn-sm btn-primary border-0 me-n3"
          data-bs-toggle="modal"
          data-bs-target="#vbo_empresa_cadastro"
        >
          <span class="svg-icon svg-icon-2">
            <inline-svg src="media/icons/duotone/Interface/Plus-Square.svg" />
          </span>
          Nova empresa
        </button>
        <!--end::Menu-->
      </div>
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <!--begin::Table-->
        <table class="table align-middle gs-0 gy-4">
          <!--begin::Table head-->
          <thead>
            <tr class="fw-bolder text-muted bg-light">
              <th class="ps-4 min-w-100px rounded-start">Nome</th>
              <th v-if="!verMais" :colspan="2">
                <div
                  class="w-100 d-flex align-items-center justify-content-center"
                >
                  <button class="btn btn-link p-0" @click="ativarVerMais">
                    Ver mais
                  </button>
                </div>
              </th>
              <th class="min-w-150px" v-if="verMais">Email</th>
              <th class="min-w-150px" v-if="verMais">CNPJ</th>
              <th></th>
              <th class="min-w-100px text-end rounded-end"></th>
            </tr>
          </thead>
          <!--end::Table head-->

          <!--begin::Table body-->
          <tbody>
            <template v-for="(item, index) in lista" :key="index">
              <tr>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="symbol symbol-50px symbol-2by3 me-4">
                      <div
                        class="symbol-label"
                        :style="`background-image: url('${item.imagem}')`"
                      ></div>
                    </div>

                    <div class="d-flex justify-content-start flex-column">
                      <span class="text-secondary fw-bolder mb-1 fs-6">{{
                        item.nome
                      }}</span>
                    </div>
                  </div>
                </td>

                <td v-if="!verMais"></td>

                <td v-if="verMais">
                  <span class="text-dark fw-bolder d-block mb-1 fs-6">
                    {{ item.email }}
                  </span>
                </td>

                <td v-if="verMais">
                  <span class="text-dark fw-bolder d-block mb-1 fs-6">{{
                    item.cnpj
                  }}</span>
                </td>

                <td>
                  <div class="d-flex flex-column">
                    <router-link
                      :to="{
                        name: 'ManualQualidade',
                        params: { empresaId: item.id },
                      }"
                      class="btn btn-sm btn-light-primary mb-1"
                    >
                      <i class="fa fa-solid fa-scroll"></i> Manual da Qualidade
                    </router-link>
                    <router-link
                      :to="{
                        name: 'AuditoriaInterna',
                        params: { empresaId: item.id },
                      }"
                      class="btn btn-sm btn-light-primary mb-1"
                    >
                      <i class="fa fa-solid fa-list"></i> Pré Auditoria
                      Documental
                    </router-link>
                    <router-link
                      :to="{ name: 'Manual', params: { empresaId: item.id } }"
                      class="btn btn-sm btn-light-primary mb-1"
                      target="_blank"
                    >
                      <i class="fa fa-regular fa-code"></i> HTML Manual da
                      Qualidade
                    </router-link>
                    <router-link
                      :to="{
                        name: 'Documentos',
                        params: { empresaId: item.id },
                      }"
                      class="btn btn-sm btn-light-primary"
                    >
                      <i class="fa fa-solid fa-file"></i> Documentos
                    </router-link>
                    <!-- <a href=""></a>
                      <a href=""></a> -->
                  </div>
                </td>

                <td class="text-end">
                  <button
                    class="btn btn-primary btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#vbo_empresa_cadastro"
                    @click="setEmpresa(item)"
                  >
                    <span class="svg-icon svg-icon-2x svg-icon-primary">
                      <inline-svg src="media/icons/duotone/Interface/Cog.svg" />
                    </span>
                    Editar
                  </button>
                </td>
              </tr>
            </template>
          </tbody>
          <!--end::Table body-->
        </table>
        <!--end::Table-->
      </div>
    </div>
  </div>
  <CadastroEmpresa :empresa="empresa" @close="closeEmpresa" />
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

import { defineComponent, ref, onMounted } from "vue";
import ApiService from "@/core/services/ApiService";
import CadastroEmpresa from "@/views/empresa/Widget/CadastroEmpresa.vue";
import emitter from "tiny-emitter/instance";

export default defineComponent({
  name: "Empresas",
  components: { CadastroEmpresa },
  setup() {
    const lista = ref<Array<Empresa>>();
    const empresa = ref<any>({});
    const verMais = ref(false);

    ApiService.get("empresa/listar").then(({ data }) => {
      lista.value = data;
    });

    const setEmpresa = (data) => {
      console.log(data);
      empresa.value = data;
    };

    const closeEmpresa = () => {
      empresa.value = null;
    };

    const mergeArrayWithObject = (arr, obj) =>
      arr && arr.map((t) => (t.id === obj.id ? obj : t));

    onMounted(() => {
      emitter.on("atualizarEmpresa", (data) => {
        lista.value = mergeArrayWithObject(lista.value, data);
      });

      emitter.on("adicionarEmpresa", (data) => {
        lista.value?.push(data);
      });
    });

    const ativarVerMais = () => {
      verMais.value = true;
    };

    return {
      CadastroEmpresa,
      lista,
      empresa,
      setEmpresa,
      closeEmpresa,
      verMais,
      ativarVerMais,
    };
  },
});
</script>
