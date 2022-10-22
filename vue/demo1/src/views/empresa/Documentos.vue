<template>
  <!--begin::Documents toolbar-->
  <div class="card-header border-0 py-5">
    <h3 class="card-title fw-bolder">Documentos</h3>
  </div>
  <!--end::Documents toolbar-->
  <div class="row g-6 g-xl-9 mb-6 mb-xl-9 mt-3">
    <KTFolder
      v-for="capitulo in capitulos"
      :key="capitulo.id"
      :folder-name="`Capítulo ${capitulo.numero}`"
      :quantidade="capitulo.quantidadeArquivos"
      type="capitulo"
      :id="capitulo.id"
      :empresaId="empresaId"
    ></KTFolder>

    <div class="col d-none d-xl-block"></div>

    <div class="col d-none d-xl-block"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import KTFolder from "@/components/file/Folder.vue";
import { useRouter } from "vue-router";
import ApiService from "@/core/services/ApiService";
import { Capitulo } from "@/components/file/models";

export default defineComponent({
  name: "Documentos",
  components: {
    KTFolder,
  },
  setup() {
    const route = useRouter();
    const capitulos = ref<Array<Capitulo>>();

    const empresaId = route.currentRoute.value.params.empresaId;

    console.log(empresaId);

    ApiService.get("documento/" + empresaId).then(({ data }) => {
      capitulos.value = data;
    });

    return { capitulos, empresaId };
  },
});
</script>
