<template>
  <!--begin::Documents toolbar-->
  <div class="card-header border-0 py-5">
    <h3 class="card-title fw-bolder">Documentos</h3>
  </div>
  <div class="card-header border-0 py-5 mt-3">
    <h5 class="card-title fw-bolder" v-if="item">
      Capitulo {{ item.capituloNumero }}.{{ item.itemNumero }}.{{ item.numero }}
    </h5>
  </div>
  <!--end::Documents toolbar-->
  <!-- <div class="row g-6 g-xl-9 mb-6 mb-xl-9 mt-3" v-if="item && item.itens.length > 0">
    <KTFolder v-for="i in item.itens" :key="i.id" :folder-name="`Sub-item ${i.numero}`" :quantidade="i.quantidadeArquivos" type="subitem" :id="i.id" :empresaId="empresaId"></KTFolder>

    <div class="col d-none d-xl-block"></div>

    <div class="col d-none d-xl-block"></div>
  </div> -->

  <div
    class="row g-6 g-xl-9 mb-6 mb-xl-9 mt-3"
    v-if="item != null && item.documentos"
  >
    <KTFile
      v-for="doc in item.documentos"
      :key="doc.id"
      :file-title="doc.nome"
      :file-type="doc.type"
      :created-at="doc.criadoEm"
      :url="doc.url"
    ></KTFile>
  </div>
  <div v-else>
    <h3>Sem documentos nessa sessão</h3>
  </div>
</template>

<script lang="ts">
interface ListarDocumentoItemModel {
  id: string;
  numero: number;
  capituloNumero: number;
  itemNumero: number;
  itens: Array<ListarDocumentoCapituloModel>;
}

interface ListarDocumentoCapituloModel {
  id: string;
  numero: number;
  quantidadeArquivos: number;
}

import { defineComponent, onMounted, ref } from "vue";
import KTFolder from "@/components/file/Folder.vue";
import KTFile from "@/components/file/File.vue";
import { useRouter } from "vue-router";
import ApiService from "@/core/services/ApiService";

export default defineComponent({
  name: "DocumentoItem",
  components: {
    KTFile,
  },
  setup() {
    const route = useRouter();
    const item = ref<ListarDocumentoItemModel>();

    const empresaId = route.currentRoute.value.params.empresaId;
    const subitemId = route.currentRoute.value.params.subitemId;

    ApiService.get("documento/subitem/" + empresaId + "/" + subitemId).then(
      ({ data }) => {
        item.value = data;
      }
    );

    return { item, empresaId };
  },
});
</script>
