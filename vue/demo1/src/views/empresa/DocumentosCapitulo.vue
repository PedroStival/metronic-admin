<template>
  <!--begin::Documents toolbar-->
  <div class="card-header border-0 py-5">
    <h3 class="card-title fw-bolder">Documentos</h3>
  </div>
  <div class="card-header border-0 py-5 mt-3">
    <h5 class="card-title fw-bolder" v-if="capitulo">
      Capitulo {{ capitulo.numero }}
    </h5>
  </div>

  <!--end::Documents toolbar-->
  <div
    class="row g-6 g-xl-9 mb-6 mb-xl-9 mt-3"
    v-if="capitulo && capitulo.itens.length > 0"
  >
    <KTFolder
      v-for="item in capitulo.itens"
      :key="item.id"
      :folder-name="`Item ${capitulo.numero}.${item.numero}`"
      :quantidade="item.quantidadeArquivos"
      type="item"
      :id="item.id"
      :empresaId="empresaId"
    ></KTFolder>

    <div class="col d-none d-xl-block"></div>

    <div class="col d-none d-xl-block"></div>
  </div>
</template>

<script lang="ts">
interface ListarDocumentoItemModel {
  id: string;
  numero: number;
  itens: Array<ListarDocumentoCapituloModel>;
}

interface ListarDocumentoCapituloModel {
  id: string;
  numero: number;
  quantidadeArquivos: number;
}

import { defineComponent, ref } from "vue";
import KTFolder from "@/components/file/Folder.vue";
import { useRouter } from "vue-router";
import ApiService from "@/core/services/ApiService";

export default defineComponent({
  name: "DocumentosCapitulo",
  components: {
    KTFolder,
  },
  setup() {
    const route = useRouter();
    const capitulo = ref<ListarDocumentoItemModel>();

    const empresaId = route.currentRoute.value.params.empresaId;
    const capituloId = route.currentRoute.value.params.capituloId;

    console.log(empresaId);
    console.log(capituloId);

    ApiService.get("documento/capitulo/" + empresaId + "/" + capituloId).then(
      ({ data }) => {
        capitulo.value = data;
      }
    );

    return { capitulo, empresaId };
  },
});
</script>
