<template>
  <div class="col-4 col-sm-12 col-xl-3">
    <!--begin::Card-->
    <div class="card h-100">
      <!--begin::Card body-->
      <div
        class="
          card-body
          d-flex
          justify-content-center
          text-center
          flex-column
          p-8
        "
      >
        <!--begin::Name-->
        <router-link
          :to="{
            name: 'DocumentosCapitulo',
            params: { empresaId: empresaId, capituloId: id },
          }"
          class="text-gray-800 text-hover-primary d-flex flex-column"
          v-if="type == 'capitulo'"
        >
          <!--begin::Image-->
          <div class="symbol symbol-75px mb-6">
            <img src="media/svg/files/folder-document.svg" alt="" />
          </div>
          <!--end::Image-->

          <!--begin::Title-->
          <div class="fs-5 fw-bolder mb-2">
            {{ folderName }}
          </div>
          <!--end::Title-->
        </router-link>

        <router-link
          :to="{
            name: 'DocumentosItem',
            params: { empresaId: empresaId, itemId: id },
          }"
          class="text-gray-800 text-hover-primary d-flex flex-column"
          v-if="type == 'item'"
        >
          <!--begin::Image-->
          <div class="symbol symbol-75px mb-6">
            <img src="media/svg/files/folder-document.svg" alt="" />
          </div>
          <!--end::Image-->

          <!--begin::Title-->
          <div class="fs-5 fw-bolder mb-2">
            {{ folderName }}
          </div>
          <!--end::Title-->
        </router-link>

        <router-link
          :to="{
            name: 'DocumentosSubItem',
            params: { empresaId: empresaId, subitemId: id },
          }"
          class="text-gray-800 text-hover-primary d-flex flex-column"
          v-if="type == 'subitem'"
        >
          <!--begin::Image-->
          <div class="symbol symbol-75px mb-6">
            <img src="media/svg/files/folder-document.svg" alt="" />
          </div>
          <!--end::Image-->

          <!--begin::Title-->
          <div class="fs-5 fw-bolder mb-2">
            {{ folderName }}
          </div>
          <!--end::Title-->
        </router-link>
        <!--end::Name-->

        <!--begin::Description-->
        <div class="fs-7 fw-bold text-gray-400 mt-auto">
          {{ quantidade }} arquivos
        </div>
        <!--end::Description-->
      </div>
      <!--end::Card body-->
    </div>
    <!--end::Card-->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "file",
  props: {
    empresaId: String,
    id: String,
    folderName: String,
    quantidade: Number,
    files: String,
    type: String,
  },
  components: {},
});
</script>
