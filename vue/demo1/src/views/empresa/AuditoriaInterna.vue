<template>
  <div class="card">
    <div class="card-header border-0 py-5">
      <h3 class="card-title fw-bolder">Auditoria interna</h3>
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <!--begin::Table-->
        <div
          class="panel bg-light mb-3"
          style="border-radius: 10px"
          v-for="capitulo in capitulos"
          :key="capitulo.numero"
        >
          <h2 class="p-3">{{ capitulo.numero }} - {{ capitulo.titulo }}</h2>
          <div class="w-100 p-2">
            <table
              class="table align-middle gs-0 bg-white border"
              style="border-radius: 10px"
              v-for="item in capitulo.items"
              :key="item.numero"
            >
              <!--begin::Table head-->
              <thead>
                <tr class="fw-bolder text-muted">
                  <th class="ps-4 min-w-300px">
                    <div
                      class="d-flex justify-content-between align-items-center"
                    >
                      <span
                        >{{ item.capitulo }}.{{ item.numero }} -
                        {{ item.titulo }}</span
                      >
                      <button
                        class="btn btn-sm btn-secondary me-3"
                        data-bs-toggle="modal"
                        data-bs-target="#cadastrar_pergunta"
                      >
                        Adicionar pergunta
                      </button>
                    </div>
                  </th>
                </tr>
              </thead>
              <!--end::Table head-->
              <!--begin::Table body-->
              <tbody>
                <tr>
                  <td colspan="2">
                    <div class="p-2 w-100">
                      <table class="table align-middle gs-0 border">
                        <thead>
                          <th class="w-400px ps-4">Descrição</th>
                          <th class="w-100px">Conforme</th>
                          <th>Evidências</th>
                        </thead>
                        <tbody>
                          <tr
                            v-for="pergunta in item.auditoriaInterna"
                            :key="pergunta.id"
                          >
                            <td class="ps-4">
                              <textarea
                                rows="5"
                                class="w-100 border-light"
                                v-model="pergunta.titulo"
                              ></textarea>
                            </td>
                            <td class="ps-4">
                              <div
                                class="
                                  form-check form-check-solid form-switch
                                  fv-row
                                "
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
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td class="ps-4 w-100 d-flex justify-content-end">
                    <button class="btn btn-primary me-3">Salvar</button>
                  </td>
                </tr>
              </tfoot>
              <!--end::Table body-->
            </table>
          </div>
        </div>
        <!--end::Table-->
      </div>
    </div>
  </div>
  <CadastroPergunta :pergunta="pergunta" @close="closePergunta" />
</template>

<script lang="ts">
interface SubItem {
  id: string;
  capitulo: number;
  item: number;
  itemId: string;
  capituloId: string;
  titulo: string;
  norma: string;
  numero: number;
  ok: boolean;
}

interface Item {
  id: string;
  capitulo: number;
  capituloId: string;
  titulo: string;
  norma: string;
  numero: number;
  ok: boolean;
  subItems: Array<SubItem>;
  auditoriaInterna: Array<AuditoriaInterna>;
}

interface Capitulo {
  id: string;
  numero: number;
  ok: boolean;
  items: Array<Item>;
}

interface AuditoriaInterna {
  id: string;
  capitulo: string;
  capituloId: string;
  item: string;
  itemId: string;
  conforme: boolean;
  titulo: string;
}

import { defineComponent, ref, onMounted } from "vue";
import emitter from "tiny-emitter/instance";
import CadastroPergunta from "@/views/empresa/Widget/CadastrarPergunta.vue";
import ApiService from "@/core/services/ApiService";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "AuditoriaIntera",
  components: { CadastroPergunta },
  setup() {
    const pergunta = ref<any>({});
    const lista = ref<any>([]);
    const capitulos = ref<Array<Capitulo>>();
    const route = useRouter();
    const empresaId = route.currentRoute.value.params.empresaId;
    ApiService.get("manual-auditoria/" + empresaId).then(({ data }) => {
      capitulos.value = data.capitulos;
    });

    const closePergunta = () => {
      pergunta.value = null;
    };

    const mergeArrayWithObject = (arr, obj) =>
      arr && arr.map((t) => (t.id === obj.id ? obj : t));

    onMounted(() => {
      emitter.on("adicionarPergunta", (data) => {
        lista.value = mergeArrayWithObject(lista.value, data);
      });

      emitter.on("adicionarPergunta", (data) => {
        lista.value?.push(data);
      });
    });

    return {
      pergunta,
      closePergunta,
      capitulos,
    };
  },
});
</script>
