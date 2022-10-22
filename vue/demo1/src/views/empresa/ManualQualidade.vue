<template>
  <div class="card">
    <div class="card-header border-0 py-2">
      <h3 class="card-title fw-bolder">Manual da Qualidade</h3>
    </div>
    <div class="card-body">
      <div class="d-flex flex-column justify-items-center align-items-start">
        <div
          style="padding: 12px; border-radius: 5px"
          class="d-flex w-100 bg-light"
        >
          <div
            @click="selecionarCapitulo(x)"
            v-for="x in auditoria"
            :key="x.numero"
            style="
              border: solid 1px #cecece;
              padding: 12px;
              border-radius: 10px;
              cursor: pointer;
            "
            class="d-flex flex-column me-2 bg-white"
          >
            <span>Capitulo {{ x.numero }}</span>
            <div
              class="w-100 border"
              :class="x.ok ? 'border-success' : 'border-warning'"
              style="height: 15px"
              v-if="contarItemsOk(x) > 0 || x.numero == 2 || x.numero == 3"
            >
              <div
                :class="x.ok ? 'bg-success' : 'bg-warning'"
                style="
                  height: 100%;
                  color: #fff;
                  font-size: 8px;
                  text-align: right;
                "
                :style="`width:${contarItemsOk(x)}%`"
              >
                {{ contarItemsOk(x) }}%
              </div>
            </div>
            <div v-else>
              <span class="text-danger">À fazer</span>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex mt-3">
        <div class="w-500px bg-light px-2" style="border-radius: 5px">
          <div
            v-for="item in listaItems"
            :key="item.numero"
            class="d-flex flex-column w-100 border p-2 my-2 bg-white"
            style="border-radius: 10px; cursor: pointer"
            @click="selecionarItem(item)"
          >
            <div class="d-flex justify-content-between align-items-center">
              <span class="titulo text-uppercase"
                >{{ item.capitulo }}.{{ item.numero }} - {{ item.titulo }}</span
              >
              <div
                style="width: 10px; height: 10px; border-radius: 10px"
                :class="item.ok ? 'bg-success' : 'bg-danger'"
              ></div>
            </div>
            <div
              class="d-flex flex-column w-100 my-2"
              style="border-radius: 10px; cursor: pointer; padding-left: 12px"
              v-if="item.subItems && item.subItems.length > 0"
            >
              <div
                v-for="i in item.subItems"
                :key="i.numero"
                class="d-flex justify-content-between align-items-center my-2"
              >
                <span class="titulo text-uppercase"
                  >{{ i.capitulo }}.{{ i.item }}.{{ i.numero }} -
                  {{ i.titulo }}</span
                >
                <div
                  style="width: 10px; height: 10px; border-radius: 10px"
                  :class="i.ok ? 'bg-success' : 'bg-danger'"
                ></div>
              </div>
            </div>
          </div>
          <div v-if="capituloSelecionado && capituloSelecionado.numero == 2">
            <div
              class="d-flex flex-column w-100 border p-2 my-2 bg-white"
              style="border-radius: 10px; cursor: pointer"
            >
              <div class="d-flex justify-content-between align-items-center">
                <span class="titulo text-uppercase"
                  >2 - REFERÊNCIAS NORMATIVAS</span
                >
              </div>
            </div>
          </div>
          <div v-if="capituloSelecionado && capituloSelecionado.numero == 3">
            <div
              class="d-flex flex-column w-100 border p-2 my-2 bg-white"
              style="border-radius: 10px; cursor: pointer"
            >
              <div class="d-flex justify-content-between align-items-center">
                <span class="titulo text-uppercase"
                  >3 - TERMOS E DEFINIÇÕES</span
                >
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex flex-column w-100">
          <div
            class="d-flex flex-column bg-light p-2 w-100 mb-3"
            style="margin-left: 10px; border-radius: 10px"
            v-if="
              itemSelecionado != null &&
              itemSelecionado.subItems.length == 0 &&
              !(
                itemSelecionado.capitulo == 4 &&
                (itemSelecionado.numero == 1 ||
                  itemSelecionado.numero == 2 ||
                  itemSelecionado.numero == 4)
              ) &&
              !(itemSelecionado.capitulo == 7 && itemSelecionado.numero == 4) &&
              !(itemSelecionado.capitulo == 8 && itemSelecionado.numero == 3)
            "
          >
            <span class="titulo-resposta text-uppercase"
              >{{ itemSelecionado.capitulo }}.{{ itemSelecionado.numero }} -
              {{ itemSelecionado.titulo }}</span
            >
            <div
              class="p-5 rounded bg-secondary text-dark fw-semobold mb-2"
              data-kt-element="message-text"
              v-if="itemSelecionado.norma"
            >
              <p>Recorte da ISO9001:2015:</p>
              <span v-html="itemSelecionado.norma"></span>
            </div>
            <label>Resposta: </label>
            <textarea
              :rows="6"
              style="w-100"
              v-model="itemSelecionado.resposta"
            ></textarea>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <div class="d-flex align-items-center">
                <div class="d-flex flex-column align-items-center me-2">
                  <input
                    type="file"
                    class="form-control form-control-sm"
                    :ref="
                      (el) => {
                        if (itemSelecionado != null) {
                          itemSelecionado.file = el;
                        }
                      }
                    "
                  />
                  <a
                    class="btn btn-sm btn-warning mt-1"
                    v-if="
                      itemSelecionado.documento && itemSelecionado.documento.url
                    "
                    :href="itemSelecionado.documento.url"
                    target="_blank"
                    >Ver doc: {{ itemSelecionado.documento.nome }}</a
                  >
                </div>
                <!-- <button class="btn btn-sm btn-warning me-3">Anexar documentos</button> -->
                <button
                  class="btn btn-sm btn-warning"
                  data-bs-toggle="modal"
                  data-bs-target="#auditoria_interna_popup"
                  v-if="
                    itemSelecionado.auditoriaInterna != null &&
                    itemSelecionado.auditoriaInterna.length > 0
                  "
                  @click="abrirAuditoriaInterna(itemSelecionado)"
                >
                  Pré Auditoria Documental
                </button>
              </div>
              <button
                class="btn btn-sm btn-primary"
                @click="salvarRespostaItem"
              >
                Salvar
              </button>
            </div>
          </div>
          <div
            class="d-flex flex-column bg-light p-2 w-100 mb-3"
            style="margin-left: 10px; border-radius: 10px"
            v-if="
              itemSelecionado != null &&
              itemSelecionado.capitulo == 8 &&
              itemSelecionado.numero == 3
            "
          >
            <span class="titulo-resposta text-uppercase"
              >{{ itemSelecionado.capitulo }}.{{ itemSelecionado.numero }} -
              {{ itemSelecionado.titulo }}</span
            >
            <div
              class="p-5 rounded bg-secondary text-dark fw-semobold mb-2"
              data-kt-element="message-text"
              v-if="itemSelecionado.norma"
            >
              <p>Recorte da ISO9001:2015:</p>
              <span v-html="itemSelecionado.norma"></span>
            </div>
            <div class="form-check form-check-solid form-switch fv-row">
              <input
                class="form-check-input form-input-sm"
                type="checkbox"
                id="item83"
                v-model="item83.ativo"
              />
              <label class="form-check-label" for="item83"
                >Deseja habilitar esse item?</label
              >
            </div>
            <div class="alert alert-warning my-3">
              Caso esteja ativado será mostrado o que estiver preenchido aqui
              <br />
              Se não, será apresentado juntamente ao item 4.3 citando a ausência
              deste item porque não faz parte do escopo da empresa.
            </div>
            <div class="d-flex justify-content-end align-items-center mt-3">
              <button
                class="btn btn-sm btn-primary"
                @click="salvarRespostaItem(item83.ativo)"
              >
                Salvar
              </button>
            </div>
          </div>

          <div v-for="subItem in listaSubItems" :key="subItem.numero">
            <div
              class="d-flex flex-column bg-light p-2 w-100 mb-3"
              style="margin-left: 10px; border-radius: 10px"
              v-if="subItem.capitulo == 8 && subItem.item == 3 && item83.ativo"
            >
              <span class="titulo-resposta text-uppercase"
                >{{ subItem.capitulo }}.{{ subItem.item }}.{{
                  subItem.numero
                }}
                - {{ subItem.titulo }}</span
              >
              <div
                class="p-5 rounded bg-secondary text-dark fw-semobold mb-2"
                data-kt-element="message-text"
                v-if="subItem && subItem.norma"
              >
                <p>Recorte da ISO9001:2015:</p>
                <span v-html="subItem.norma"></span>
              </div>
              <label>Resposta: </label>
              <textarea
                :rows="6"
                style="w-100"
                v-model="subItem.resposta"
              ></textarea>
              <div
                class="d-flex justify-content-between align-items-center mt-3"
              >
                <div class="d-flex align-items-center">
                  <div class="d-flex flex-column align-items-center me-2">
                    <input
                      type="file"
                      class="form-control form-control-sm"
                      :ref="
                        (el) => {
                          subItem.file = el;
                        }
                      "
                    />
                    <a
                      class="btn btn-sm btn-warning mt-1"
                      v-if="subItem.documento && subItem.documento.url"
                      :href="subItem.documento.url"
                      target="_blank"
                      >Ver doc: {{ subItem.documento.nome }}</a
                    >
                  </div>
                  <button
                    class="btn btn-sm btn-warning"
                    data-bs-toggle="modal"
                    data-bs-target="#auditoria_interna_popup"
                    v-if="
                      subItem.auditoriaInterna != null &&
                      subItem.auditoriaInterna.length > 0
                    "
                    @click="abrirAuditoriaInterna(subItem)"
                  >
                    Pré Auditoria Documental
                  </button>
                </div>
                <button
                  class="btn btn-sm btn-primary"
                  @click="salvarRespostaSubItem(subItem)"
                >
                  Salvar
                </button>
              </div>
            </div>
            <div
              v-else-if="
                subItem.capitulo == 8 && subItem.item == 3 && !item83.ativo
              "
            ></div>
            <div
              class="d-flex flex-column bg-light p-2 w-100 mb-3"
              style="margin-left: 10px; border-radius: 10px"
              v-else-if="
                itemSelecionado != null &&
                itemSelecionado.capitulo == 7 &&
                itemSelecionado.numero == 1 &&
                subItem.numero == 5
              "
            >
              <span class="titulo-resposta text-uppercase"
                >{{ subItem.capitulo }}.{{ subItem.item }}.{{
                  subItem.numero
                }}
                - {{ subItem.titulo }}</span
              >
              <div
                class="p-5 rounded bg-secondary text-dark fw-semobold mb-2"
                data-kt-element="message-text"
                v-if="subItem && subItem.norma"
              >
                <p>Recorte da ISO9001:2015:</p>
                <span v-html="subItem.norma"></span>
              </div>
              <div class="form-check form-check-solid form-switch fv-row">
                <input
                  class="form-check-input form-input-sm"
                  type="checkbox"
                  id="item715"
                  v-model="item715.ativo"
                />
                <label class="form-check-label" for="item715"
                  >Deseja habilitar esse subitem?</label
                >
              </div>
              <div class="alert alert-warning my-3">
                Caso esteja ativado será mostrado o que estiver preenchido aqui
                <br />
                Se não, será apresentado juntamente ao item 4.3 citando a
                ausência deste item porque não faz parte do escopo da empresa.
              </div>
              <label v-if="item715.ativo">Resposta: </label>
              <textarea
                :rows="6"
                style="w-100"
                v-model="subItem.resposta"
                v-if="item715.ativo"
              ></textarea>
              <div
                class="d-flex justify-content-between align-items-center mt-3"
              >
                <div class="d-flex align-items-center">
                  <div class="d-flex flex-column align-items-center me-2">
                    <input
                      type="file"
                      class="form-control form-control-sm"
                      :ref="
                        (el) => {
                          subItem.file = el;
                        }
                      "
                    />
                    <a
                      class="btn btn-sm btn-warning mt-1"
                      v-if="subItem.documento && subItem.documento.url"
                      :href="subItem.documento.url"
                      target="_blank"
                      >Ver doc: {{ subItem.documento.nome }}</a
                    >
                  </div>
                  <button
                    class="btn btn-sm btn-warning"
                    data-bs-toggle="modal"
                    data-bs-target="#auditoria_interna_popup"
                    v-if="
                      subItem.auditoriaInterna != null &&
                      subItem.auditoriaInterna.length > 0
                    "
                    @click="abrirAuditoriaInterna(subItem)"
                  >
                    Pré Auditoria Documental
                  </button>
                </div>
                <button
                  class="btn btn-sm btn-primary"
                  @click="salvarRespostaSubItem(subItem, item715.ativo)"
                >
                  Salvar
                </button>
              </div>
            </div>
            <div
              class="d-flex flex-column bg-light p-2 w-100 mb-3"
              style="margin-left: 10px; border-radius: 10px"
              v-else
            >
              <span class="titulo-resposta text-uppercase"
                >{{ subItem.capitulo }}.{{ subItem.item }}.{{
                  subItem.numero
                }}
                - {{ subItem.titulo }}</span
              >
              <div
                class="p-5 rounded bg-secondary text-dark fw-semobold mb-2"
                data-kt-element="message-text"
                v-if="subItem && subItem.norma"
              >
                <p>Recorte da ISO9001:2015:</p>
                <span v-html="subItem.norma"></span>
              </div>
              <label>Resposta: </label>
              <textarea
                :rows="6"
                style="w-100"
                v-model="subItem.resposta"
              ></textarea>
              <div
                class="d-flex justify-content-between align-items-center mt-3"
              >
                <div class="d-flex align-items-center">
                  <div class="d-flex flex-column align-items-center me-2">
                    <input
                      type="file"
                      class="form-control form-control-sm"
                      :ref="
                        (el) => {
                          subItem.file = el;
                        }
                      "
                    />
                    <a
                      class="btn btn-sm btn-warning mt-1"
                      v-if="subItem.documento && subItem.documento.url"
                      :href="subItem.documento.url"
                      target="_blank"
                      >Ver doc: {{ subItem.documento.nome }}</a
                    >
                  </div>
                  <button
                    class="btn btn-sm btn-warning"
                    data-bs-toggle="modal"
                    data-bs-target="#auditoria_interna_popup"
                    v-if="
                      subItem.auditoriaInterna != null &&
                      subItem.auditoriaInterna.length > 0
                    "
                    @click="abrirAuditoriaInterna(subItem)"
                  >
                    Pré Auditoria Documental
                  </button>
                </div>
                <button
                  class="btn btn-sm btn-primary"
                  @click="salvarRespostaSubItem(subItem)"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
          <div
            class="d-flex flex-column bg-light p-2 w-100 mb-3"
            style="margin-left: 10px; border-radius: 10px"
            v-if="capituloSelecionado && capituloSelecionado.numero == 2"
          >
            <span class="titulo-resposta text-uppercase"
              >2 - REFERÊNCIAS NORMATIVAS</span
            >
            <div
              class="p-5 rounded bg-secondary text-dark fw-semobold mb-2"
              data-kt-element="message-text"
            >
              <span
                >Aqui você pode habilitar e listar outras referências normativas
                as quais a organização se refere para a elaboração deste
                documento.</span
              >
            </div>
            <div class="form-check form-check-solid form-switch fv-row">
              <input
                class="form-check-input form-input-sm"
                type="checkbox"
                id="capitulo2"
                v-model="capitulo2.ativo"
              />
              <label class="form-check-label" for="capitulo2"
                >Habilitar resposta?</label
              >
            </div>
            <div class="alert alert-warning my-3">
              Caso esteja desativado a mensagem padrão será <br />
              "Este Manual foi concebido seguindo as diretrizes de Referências
              Normativas da ISO9001:2015."
            </div>
            <label v-if="capitulo2.ativo == true">Resposta: </label>
            <textarea
              :rows="6"
              style="w-100"
              v-model="capitulo2.texto"
              v-if="capitulo2.ativo == true"
            ></textarea>
            <div class="d-flex justify-content-end mt-3">
              <button
                class="btn btn-sm btn-primary"
                @click="salvarCapitulo(capitulo2)"
              >
                Salvar
              </button>
            </div>
          </div>
          <div
            class="d-flex flex-column bg-light p-2 w-100 mb-3"
            style="margin-left: 10px; border-radius: 10px"
            v-if="capituloSelecionado && capituloSelecionado.numero == 3"
          >
            <span class="titulo-resposta text-uppercase"
              >3 - TERMOS E DEFINIÇÕES</span
            >
            <div
              class="p-5 rounded bg-secondary text-dark fw-semobold mb-2"
              data-kt-element="message-text"
            >
              <span
                >A ISO9001 se baseia na ISO9000. Aqui você pode habilitar e
                referenciar um documento externo de termos e definições criados
                para nortear o auditor em palavras técnicas internas utilizadas
                pela organização.</span
              >
              <br />
              <span
                >A FACCAT (Faculdades Integradas de Taquara) disponibiliza na
                internet um link para download de sua cópia da ISO9000:2015:
                <a
                  href="https://tecnologia.qualidade.faccat.br/moodle/pluginfile.php/1386/mod_folder/content/0/NORMA%20ISO%2090002015.pdf?forcedownload=1"
                  target="_blank"
                  >https://tecnologia.qualidade.faccat.br/moodle/pluginfile.php/1386/mod_folder/content/0/NORMA%20ISO%2090002015.pdf?forcedownload=1</a
                ></span
              >
            </div>
            <div class="form-check form-check-solid form-switch fv-row">
              <input
                class="form-check-input"
                type="checkbox"
                id="capitulo3"
                v-model="capitulo3.ativo"
              />
              <label class="form-check-label" for="capitulo3"
                >Habilitar resposta?</label
              >
            </div>
            <div class="alert alert-warning my-3">
              Caso esteja desativado a mensagem padrão será <br />
              "Este Manual foi concebido seguindo as diretrizes de Termos e
              Definições da ISO9001:2015."
            </div>
            <label v-if="capitulo3.ativo == true">Resposta: </label>
            <textarea
              :rows="6"
              style="w-100"
              v-model="capitulo3.texto"
              v-if="capitulo3.ativo == true"
            ></textarea>
            <div class="d-flex justify-content-end mt-3">
              <button
                class="btn btn-sm btn-primary"
                @click="salvarCapitulo(capitulo3)"
              >
                Salvar
              </button>
            </div>
          </div>
          <div
            class="d-flex flex-column bg-light p-2 w-100 mb-3"
            style="margin-left: 10px; border-radius: 10px"
            v-if="
              itemSelecionado != null &&
              itemSelecionado.capitulo == 4 &&
              itemSelecionado.numero == 1
            "
          >
            <span class="titulo-resposta text-uppercase"
              >{{ itemSelecionado.capitulo }}.{{ itemSelecionado.numero }} -
              {{ itemSelecionado.titulo }}</span
            >
            <div
              class="p-5 rounded bg-secondary text-dark fw-semobold mb-2"
              data-kt-element="message-text"
              v-if="itemSelecionado.norma"
            >
              <p>Recorte da ISO9001:2015:</p>
              <span v-html="itemSelecionado.norma"></span>
            </div>
            <div class="form-check form-check-solid form-switch fv-row">
              <input
                class="form-check-input form-input-sm"
                type="checkbox"
                id="item41"
                v-model="item41.ativo"
              />
              <label class="form-check-label" for="item41"
                >Habilitar tabela SWOT?</label
              >
            </div>
            <div class="alert alert-warning my-3">
              Caso esteja ativado será apresentado a tabela SWOT conforme for
              preenchida <br />
              Se não, será disponibilizado um campo de texto para você citar
              onde está o documento externo.
            </div>
            <label>Resposta: </label>
            <div class="w-100 px-2" v-if="item41.ativo == true">
              <div class="row">
                <div class="border col-3 min-h-100px py-2 d-flex flex-column">
                  <h5 class="text-center">Forças</h5>
                  <ul
                    class="
                      list-group list-group-flush
                      min-h-100px
                      m-3
                      border border-secondary
                      flex-fill
                    "
                  >
                    <li
                      class="list-group-item d-flex justify-content-between"
                      v-for="(s, index) in strengths"
                      :key="index"
                    >
                      <span>{{ s }}</span>
                      <div
                        class="deleteSwot"
                        @click="deleteSwot(strengths, index)"
                      ></div>
                    </li>
                  </ul>
                  <div class="w-100 d-flex">
                    <input
                      class="form-control form-control-sm me-2"
                      v-model="ns"
                    />
                    <button
                      class="btn btn-sm btn-info"
                      @click="
                        addSWOT(strengths, ns);
                        ns = '';
                      "
                    >
                      Add
                    </button>
                  </div>
                </div>
                <div class="border col-3 min-h-100px py-2 d-flex flex-column">
                  <h5 class="text-center">Fraquezas</h5>
                  <ul
                    class="
                      list-group list-group-flush
                      min-h-100px
                      m-3
                      border border-secondary
                      flex-fill
                    "
                  >
                    <li
                      class="list-group-item d-flex justify-content-between"
                      v-for="(w, index) in weaknesses"
                      :key="index"
                    >
                      <span>{{ w }}</span>
                      <div
                        class="deleteSwot"
                        @click="deleteSwot(weaknesses, index)"
                      ></div>
                    </li>
                  </ul>
                  <div class="w-100 d-flex">
                    <input
                      class="form-control form-control-sm me-2"
                      v-model="nw"
                    />
                    <button
                      class="btn btn-sm btn-info"
                      @click="
                        addSWOT(weaknesses, nw);
                        nw = '';
                      "
                    >
                      Add
                    </button>
                  </div>
                </div>
                <div class="border col-3 min-h-100px py-2 d-flex flex-column">
                  <h5 class="text-center">Oportunidades</h5>
                  <ul
                    class="
                      list-group list-group-flush
                      min-h-100px
                      m-3
                      border border-secondary
                      flex-fill
                    "
                  >
                    <li
                      class="list-group-item d-flex justify-content-between"
                      v-for="(o, index) in opportunities"
                      :key="index"
                    >
                      <span>{{ o }}</span>
                      <div
                        class="deleteSwot"
                        @click="deleteSwot(opportunities, index)"
                      ></div>
                    </li>
                  </ul>
                  <div class="w-100 d-flex">
                    <input
                      class="form-control form-control-sm me-2"
                      v-model="no"
                    />
                    <button
                      class="btn btn-sm btn-info"
                      @click="
                        addSWOT(opportunities, no);
                        no = '';
                      "
                    >
                      Add
                    </button>
                  </div>
                </div>
                <div class="border col-3 min-h-100px py-2 d-flex flex-column">
                  <h5 class="text-center">Ameaças</h5>
                  <ul
                    class="
                      list-group list-group-flush
                      min-h-100px
                      m-3
                      border border-secondary
                      flex-fill
                    "
                  >
                    <li
                      class="list-group-item d-flex justify-content-between"
                      v-for="(t, index) in threats"
                      :key="index"
                    >
                      <span>{{ t }}</span>
                      <div
                        class="deleteSwot"
                        @click="deleteSwot(threats, index)"
                      ></div>
                    </li>
                  </ul>
                  <div class="w-100 d-flex">
                    <input
                      class="form-control form-control-sm me-2"
                      v-model="nt"
                    />
                    <button
                      class="btn btn-sm btn-info"
                      @click="
                        addSWOT(threats, nt);
                        nt = '';
                      "
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <textarea
              :rows="6"
              v-else
              style="w-100"
              v-model="item41.texto"
            ></textarea>

            <div class="d-flex justify-content-between align-items-center mt-3">
              <div class="d-flex align-items-center">
                <div class="d-flex flex-column align-items-center me-2">
                  <input
                    type="file"
                    class="form-control form-control-sm"
                    :ref="
                      (el) => {
                        if (itemSelecionado != null) {
                          itemSelecionado.file = el;
                        }
                      }
                    "
                  />
                  <a
                    class="btn btn-sm btn-warning mt-1"
                    v-if="
                      itemSelecionado.documento && itemSelecionado.documento.url
                    "
                    :href="itemSelecionado.documento.url"
                    target="_blank"
                    >Ver doc: {{ itemSelecionado.documento.nome }}</a
                  >
                </div>
                <button
                  class="btn btn-sm btn-warning"
                  data-bs-toggle="modal"
                  data-bs-target="#auditoria_interna_popup"
                  v-if="
                    itemSelecionado.auditoriaInterna != null &&
                    itemSelecionado.auditoriaInterna.length > 0
                  "
                  @click="abrirAuditoriaInterna(itemSelecionado)"
                >
                  Pré Auditoria Documental
                </button>
              </div>
              <button
                class="btn btn-sm btn-primary"
                @click="salvarSWOT(item41)"
              >
                Salvar
              </button>
            </div>
          </div>
          <div
            class="d-flex flex-column bg-light p-2 w-100 mb-3"
            style="margin-left: 10px; border-radius: 10px"
            v-if="
              itemSelecionado != null &&
              itemSelecionado.capitulo == 4 &&
              itemSelecionado.numero == 2
            "
          >
            <span class="titulo-resposta text-uppercase"
              >{{ itemSelecionado.capitulo }}.{{ itemSelecionado.numero }} -
              {{ itemSelecionado.titulo }}</span
            >
            <div
              class="p-5 rounded bg-secondary text-dark fw-semobold mb-2"
              data-kt-element="message-text"
              v-if="itemSelecionado.norma"
            >
              <p>Recorte da ISO9001:2015:</p>
              <span v-html="itemSelecionado.norma"></span>
            </div>
            <div class="form-check form-check-solid form-switch fv-row">
              <input
                class="form-check-input form-input-sm"
                type="checkbox"
                id="item42"
                v-model="item42.ativo"
              />
              <label class="form-check-label" for="item41"
                >Habilitar tabela das Partes Interessadas?</label
              >
            </div>
            <div class="alert alert-warning my-3">
              Caso esteja ativado será apresentado a tabela das Partes
              Interessadas conforme for preenchida <br />
              Se não, será disponibilizado um campo de texto para você citar
              onde está o documento externo.
            </div>
            <label>Resposta: </label>
            <div
              class="
                w-100
                px-2
                d-flex
                flex-column
                justify-content-center
                align-items-center
              "
              v-if="item42.ativo"
            >
              <table class="table mb-3">
                <thead>
                  <th>
                    <div class="parte-interessada-topo bg-secondary">
                      Parte interessada
                    </div>
                  </th>
                  <th>
                    <div class="parte-interessada-topo bg-secondary">
                      Expectativas
                    </div>
                  </th>
                  <th>
                    <div class="parte-interessada-topo bg-secondary">
                      Métodos para atender as expectativas
                    </div>
                  </th>
                </thead>
                <tbody>
                  <tr
                    v-for="(parte, index) in partesInteressadas"
                    :key="index"
                    style="border-bottom: solid 1px #cecece"
                  >
                    <td>
                      <div class="d-flex justify-content-between w-100">
                        <span>{{ parte.nome }}</span>
                      </div>
                    </td>
                    <td>
                      <div class="d-flex justify-content-between w-100">
                        <span>{{ parte.expectativa }}</span>
                      </div>
                    </td>
                    <td>
                      <div class="d-flex justify-content-between w-100">
                        <span>{{ parte.metodo }}</span>
                        <div
                          class="deleteSwot"
                          @click="deleteParteInteressada(index)"
                        ></div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="w-100 d-flex">
                <input
                  class="form-control form-control-sm me-2"
                  placeholder="Parte interessada"
                  v-model="novaParte.nome"
                />
                <input
                  class="form-control form-control-sm me-2"
                  placeholder="Expectativa"
                  v-model="novaParte.expectativa"
                />
                <input
                  class="form-control form-control-sm me-2"
                  placeholder="Método para atender"
                  v-model="novaParte.metodo"
                />
                <button
                  class="btn btn-sm btn-info"
                  @click="
                    addParteInteressada(novaParte);
                    novaParte = {};
                  "
                >
                  Add
                </button>
              </div>
            </div>
            <textarea
              :rows="6"
              v-else
              style="w-100"
              v-model="item42.texto"
            ></textarea>
            <div class="d-flex justify-content-between mt-3">
              <div class="d-flex align-items-center">
                <div class="d-flex flex-column align-items-center me-2">
                  <input
                    type="file"
                    class="form-control form-control-sm"
                    :ref="
                      (el) => {
                        if (itemSelecionado != null) {
                          itemSelecionado.file = el;
                        }
                      }
                    "
                  />
                  <a
                    class="btn btn-sm btn-warning mt-1"
                    v-if="
                      itemSelecionado.documento && itemSelecionado.documento.url
                    "
                    :href="itemSelecionado.documento.url"
                    target="_blank"
                    >Ver doc: {{ itemSelecionado.documento.nome }}</a
                  >
                </div>
                <button
                  class="btn btn-sm btn-warning"
                  data-bs-toggle="modal"
                  data-bs-target="#auditoria_interna_popup"
                  v-if="
                    itemSelecionado.auditoriaInterna != null &&
                    itemSelecionado.auditoriaInterna.length > 0
                  "
                  @click="abrirAuditoriaInterna(itemSelecionado)"
                >
                  Pré Auditoria Documental
                </button>
              </div>
              <button
                class="btn btn-sm btn-primary"
                @click="salvarParteInteressada(item42)"
              >
                Salvar
              </button>
            </div>
          </div>
          <div
            class="d-flex flex-column bg-light p-2 w-100 mb-3"
            style="margin-left: 10px; border-radius: 10px"
            v-if="
              itemSelecionado != null &&
              itemSelecionado.capitulo == 4 &&
              itemSelecionado.numero == 4
            "
          >
            <span class="titulo-resposta text-uppercase"
              >{{ itemSelecionado.capitulo }}.{{ itemSelecionado.numero }} -
              {{ itemSelecionado.titulo }}</span
            >
            <div
              class="p-5 rounded bg-secondary text-dark fw-semobold mb-2"
              data-kt-element="message-text"
              v-if="itemSelecionado.norma"
            >
              <p>Recorte da ISO9001:2015:</p>
              <span v-html="itemSelecionado.norma"></span>
            </div>
            <label>Resposta: </label>
            <textarea
              :rows="6"
              style="w-100"
              v-model="itemSelecionado.resposta"
            ></textarea>
            <div class="alert alert-warning my-3">
              Adicione a imagem do fluxo no quadro abaixo!
            </div>
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
                  sistemaGestao.imagem !== null
                    ? sistemaGestao.imagem
                    : previewImage
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
            <div class="d-flex justify-content-between mt-3">
              <div class="d-flex align-items-center">
                <div class="d-flex flex-column align-items-center me-2">
                  <input
                    type="file"
                    class="form-control form-control-sm"
                    :ref="
                      (el) => {
                        if (itemSelecionado != null) {
                          itemSelecionado.file = el;
                        }
                      }
                    "
                  />
                  <a
                    class="btn btn-sm btn-warning mt-1"
                    v-if="
                      itemSelecionado.documento && itemSelecionado.documento.url
                    "
                    :href="itemSelecionado.documento.url"
                    target="_blank"
                    >Ver doc: {{ itemSelecionado.documento.nome }}</a
                  >
                </div>
                <button
                  class="btn btn-sm btn-warning"
                  data-bs-toggle="modal"
                  data-bs-target="#auditoria_interna_popup"
                  v-if="
                    itemSelecionado.auditoriaInterna != null &&
                    itemSelecionado.auditoriaInterna.length > 0
                  "
                  @click="abrirAuditoriaInterna(itemSelecionado)"
                >
                  Pré Auditoria Documental
                </button>
              </div>
              <button
                class="btn btn-sm btn-primary"
                @click="salvarSistemaGestao"
              >
                Salvar
              </button>
            </div>
          </div>
          <div
            class="d-flex flex-column bg-light p-2 w-100 mb-3"
            style="margin-left: 10px; border-radius: 10px"
            v-if="
              itemSelecionado != null &&
              itemSelecionado.capitulo == 7 &&
              itemSelecionado.numero == 4
            "
          >
            <span class="titulo-resposta text-uppercase"
              >{{ itemSelecionado.capitulo }}.{{ itemSelecionado.numero }} -
              {{ itemSelecionado.titulo }}</span
            >
            <div
              class="p-5 rounded bg-secondary text-dark fw-semobold mb-2"
              data-kt-element="message-text"
              v-if="itemSelecionado.norma"
            >
              <p>Recorte da ISO9001:2015:</p>
              <span v-html="itemSelecionado.norma"></span>
            </div>
            <label>Resposta: </label>
            <div
              class="
                w-100
                px-2
                d-flex
                flex-column
                justify-content-center
                align-items-center
              "
            >
              <table class="table mb-3">
                <thead>
                  <th>
                    <div class="parte-interessada-topo bg-secondary">
                      Parte interessada
                    </div>
                  </th>
                  <th>
                    <div class="parte-interessada-topo bg-secondary">
                      Responsável
                    </div>
                  </th>
                  <th>
                    <div class="parte-interessada-topo bg-secondary">
                      Conteúdo/Temas
                    </div>
                  </th>
                  <th>
                    <div class="parte-interessada-topo bg-secondary">
                      Quando/Periocidade
                    </div>
                  </th>
                  <th>
                    <div class="parte-interessada-topo bg-secondary">
                      Método/Ferramentas
                    </div>
                  </th>
                </thead>
                <tbody>
                  <tr
                    v-for="(c, index) in comunicacao"
                    :key="index"
                    style="border-bottom: solid 1px #cecece"
                  >
                    <td>
                      <div class="d-flex justify-content-between w-100">
                        <span>{{ c.parteInteressada }}</span>
                      </div>
                    </td>
                    <td>
                      <div class="d-flex justify-content-between w-100">
                        <span>{{ c.responsavel }}</span>
                      </div>
                    </td>
                    <td>
                      <div class="d-flex justify-content-between w-100">
                        <span>{{ c.conteudo }}</span>
                      </div>
                    </td>
                    <td>
                      <div class="d-flex justify-content-between w-100">
                        <span>{{ c.quando }}</span>
                      </div>
                    </td>
                    <td>
                      <div class="d-flex justify-content-between w-100">
                        <span>{{ c.metodo }}</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="w-100 d-flex">
                <!-- <input class="form-control form-control-sm me-2" placeholder="Parte interessada" v-model="novaComunicacao.nome" /> -->
                <el-select
                  class="form-select-solid me-2 min-w-150px"
                  placeholder="Parte interessada"
                  v-model="novaComunicacao.parteInteressada"
                >
                  <el-option
                    v-for="(p, index) in partesInteressadas"
                    :key="index"
                    :label="p.nome"
                    :value="p.nome"
                    >{{ p.nome }}</el-option
                  >
                </el-select>
                <input
                  class="form-control form-control-sm me-2"
                  placeholder="Responsável"
                  v-model="novaComunicacao.responsavel"
                />
                <input
                  class="form-control form-control-sm me-2"
                  placeholder="Conteúdo/Temas"
                  v-model="novaComunicacao.conteudo"
                />
                <input
                  class="form-control form-control-sm me-2"
                  placeholder="Quando/Periocidade"
                  v-model="novaComunicacao.quando"
                />
                <input
                  class="form-control form-control-sm me-2"
                  placeholder="Método/Ferramentas"
                  v-model="novaComunicacao.metodo"
                />
                <button
                  class="btn btn-sm btn-info"
                  @click="
                    AddComunicacao(novaComunicacao);
                    novaComunicacao = {};
                  "
                >
                  Add
                </button>
              </div>
            </div>
            <div class="d-flex justify-content-between mt-3">
              <div class="d-flex align-items-center">
                <div class="d-flex flex-column align-items-center me-2">
                  <input
                    type="file"
                    class="form-control form-control-sm"
                    :ref="
                      (el) => {
                        if (itemSelecionado != null) {
                          itemSelecionado.file = el;
                        }
                      }
                    "
                  />
                  <a
                    class="btn btn-sm btn-warning mt-1"
                    v-if="
                      itemSelecionado.documento && itemSelecionado.documento.url
                    "
                    :href="itemSelecionado.documento.url"
                    target="_blank"
                    >Ver doc: {{ itemSelecionado.documento.nome }}</a
                  >
                </div>
                <button
                  class="btn btn-sm btn-warning"
                  data-bs-toggle="modal"
                  data-bs-target="#auditoria_interna_popup"
                  v-if="
                    itemSelecionado.auditoriaInterna != null &&
                    itemSelecionado.auditoriaInterna.length > 0
                  "
                  @click="abrirAuditoriaInterna(itemSelecionado)"
                >
                  Pré Auditoria Documental
                </button>
              </div>
              <button class="btn btn-sm btn-primary" @click="salvarComunicacao">
                Salvar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <AuditoriaInternaPopup
    :listaAuditoria="auditoriaInterna"
    @close="closeAuditoriaInterna"
  />
</template>
<style>
.parte-interessada-topo {
  margin-right: 12px;
}

.deleteSwot {
  cursor: pointer;
}

.deleteSwot:after {
  display: inline-block;
  content: "\00d7"; /* This will render the 'X' */
}

.titulo-resposta {
  font-size: 16px;
  padding: 10px 0;
  font-weight: bold;
}
</style>

<script lang="ts">
interface AuditoriaInterna {
  id: string;
  capitulo: string;
  capituloId: string;
  item: string;
  itemId: string;
  conforme: boolean;
  titulo: string;
}

interface Documento {
  id: string;
  nome: string;
  url: string;
}

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
  resposta: string;
  auditoriaInterna: Array<AuditoriaInterna>;
  documento: Documento;
  file: HTMLInputElement;
}

interface Item {
  id: string;
  capitulo: number;
  capituloId: string;
  titulo: string;
  norma: string;
  numero: number;
  ok: boolean;
  resposta: string;
  subItems: Array<SubItem>;
  auditoriaInterna: Array<AuditoriaInterna>;
  documento: Documento;
  file: HTMLInputElement;
}

interface Capitulo {
  id: string;
  numero: number;
  ok: boolean;
  items: Array<Item>;
  ativo: boolean;
  resposta: string;
}

interface ParteInteressada {
  nome: string;
  expectativa: string;
  metodo: string;
}

interface Comunicacao {
  parteInteressada: string;
  responsavel: string;
  conteudo: string;
  quando: string;
  metodo: string;
}

import { defineComponent, ref } from "vue";
import AuditoriaInternaPopup from "@/views/empresa/Widget/AuditoriaInternaPopup.vue";
import ApiService from "@/core/services/ApiService";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "ManualQualidade",
  components: { AuditoriaInternaPopup },
  setup() {
    const route = useRouter();
    const previewImage = ref("media/avatars/blank.png");
    const imagem = ref<any>();
    const listaItems = ref<Array<Item>>([]);
    const capituloSelecionado = ref();
    const itemSelecionado = ref<Item | null>(null);
    const listaSubItems = ref<Array<SubItem>>([]);
    const auditoriaInterna = ref([]);
    const auditoria = ref<Array<Capitulo>>();
    const strengths = ref<Array<string>>([]);
    const weaknesses = ref<Array<string>>([]);
    const opportunities = ref<Array<string>>([]);
    const threats = ref<Array<string>>([]);
    const partesInteressadas = ref<Array<ParteInteressada>>([]);
    const comunicacao = ref<Array<Comunicacao>>([]);
    const sistemaGestao = ref({
      imagem: null,
    });
    const capitulo2 = ref({
      ativo: false,
      texto: "",
    });
    const capitulo3 = ref({
      ativo: false,
      texto: "",
    });
    const item41 = ref({
      ativo: true,
      texto: "",
    });

    const item42 = ref({
      ativo: true,
      texto: "",
    });

    const item83 = ref({
      ativo: true,
      texto: "",
    });

    const item715 = ref({
      ativo: true,
      texto: "",
    });

    const novaParte = ref<ParteInteressada>({
      nome: "",
      metodo: "",
      expectativa: "",
    });

    const novaComunicacao = ref<Comunicacao>({
      parteInteressada: "",
      responsavel: "",
      conteudo: "",
      quando: "",
      metodo: "",
    });

    const empresaId = route.currentRoute.value.params.empresaId;
    ApiService.get("manual-auditoria/" + empresaId).then(({ data }) => {
      auditoria.value = data.capitulos;
      const c2 = data.capitulos.find((x) => x.numero == 2);
      const c3 = data.capitulos.find((x) => x.numero == 3);
      const c4 = data.capitulos.find((x) => x.numero == 4);
      const c7 = data.capitulos.find((x) => x.numero == 7);
      const c8 = data.capitulos.find((x) => x.numero == 8);

      if (c2) {
        capitulo2.value.ativo = c2.ativo;
        capitulo2.value.texto = c2.resposta;
      }
      if (c3) {
        capitulo3.value.ativo = c3.ativo;
        capitulo3.value.texto = c3.resposta;
      }

      if (c4) {
        const item1 = c4.items.find((x) => x.numero == 1);
        const item2 = c4.items.find((x) => x.numero == 2);
        if (item1) {
          item41.value.ativo = item1.ativo;
          item41.value.texto = item1.resposta;
        }
        if (item2) {
          item42.value.ativo = item2.ativo;
          item42.value.texto = item2.resposta;
        }

        if (item2) {
          item42.value.ativo = item2.ativo;
          item42.value.texto = item2.resposta;
        }
      }

      if (c7) {
        console.log("1");
        const item1 = c7.items.find((x) => x.numero == 1);
        if (item1) {
          console.log("2");
          const subitem5 = item1.subItems.find((x) => x.numero == 5);

          if (subitem5) {
            console.log("3", subitem5);
            item715.value.ativo = subitem5.ativo;
          }
        }
      }

      if (c8) {
        const item3 = c8.items.find((x) => x.numero == 3);

        item83.value.ativo = item3.ativo;
      }

      if (data.swot) {
        strengths.value = data.swot.strengths;
        weaknesses.value = data.swot.weaknesses;
        opportunities.value = data.swot.opportunities;
        threats.value = data.swot.threats;
      }
      if (data.parteInteressada) {
        partesInteressadas.value = data.parteInteressada;
      }
      if (data.comunicacao) {
        comunicacao.value = data.comunicacao;
      }
      if (data.sistemaGestao && data.sistemaGestao.length > 0) {
        sistemaGestao.value.imagem = data.sistemaGestao;
      }
    });

    const salvarAnexarDocumentoItem = (itemId, file) => {
      const formData = new FormData();
      formData.append("documento", file);
      formData.append("empresaId", empresaId.toString());
      formData.append("itemId", itemId);
      ApiService.post("manual-auditoria/anexar-documento-item", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    };

    const salvarAnexarDocumentoSubItem = (subItemId, file) => {
      const formData = new FormData();
      formData.append("documento", file);
      formData.append("empresaId", empresaId.toString());
      formData.append("subItemId", subItemId);
      ApiService.post("manual-auditoria/anexar-documento-subitem", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    };

    const salvarRespostaItem = (active = true) => {
      const request = {
        empresaId: empresaId,
        itemId: itemSelecionado.value?.id,
        resposta: itemSelecionado.value?.resposta,
        ativo: active ? true : false,
      };
      ApiService.post("manual-auditoria/resposta", request).then(({ data }) => {
        if (itemSelecionado.value?.file) {
          const files = itemSelecionado.value?.file;
          console.log(files.files);
          if (files != null && files.files != null && files.files.length > 0) {
            salvarAnexarDocumentoItem(
              itemSelecionado.value?.id,
              files.files[0]
            );
          }
        }
      });
    };

    const salvarRespostaSubItem = (subItem, ativo = true) => {
      const data = {
        empresaId: empresaId,
        subItemId: subItem.id,
        resposta: subItem.resposta,
        ativo: ativo,
      };
      ApiService.post("manual-auditoria/resposta", data).then(({ data }) => {
        if (subItem.file) {
          const files = subItem.file;
          if (files != null && files.files != null && files.files.length > 0) {
            salvarAnexarDocumentoSubItem(subItem.id, files.files[0]);
          }
        }
      });
    };

    const selecionarCapitulo = (capitulo) => {
      capituloSelecionado.value = capitulo;
      listaItems.value = [];
      listaItems.value = capitulo.items;
      itemSelecionado.value = null;
      listaSubItems.value = [];
    };

    const selecionarItem = (item) => {
      itemSelecionado.value = item;
      listaSubItems.value = [];
      listaSubItems.value = item.subItems;
    };

    const abrirAuditoriaInterna = (item) => {
      if (item.auditoriaInterna) {
        auditoriaInterna.value = item.auditoriaInterna;
      } else {
        auditoriaInterna.value = [];
      }
    };

    const closeAuditoriaInterna = () => {
      auditoriaInterna.value = [];
    };

    const contarItemsOk = (capitulo) => {
      if (capitulo.items.length == 0) return 0;
      const sum = capitulo.items.reduce((accumulator, object) => {
        if (object.ok == true) {
          return accumulator + 1;
        } else {
          return accumulator;
        }
      }, 0);
      return (sum * 100) / capitulo.items.length;
    };

    const addSWOT = (lista, item) => {
      if (item.length > 0) {
        lista.push(item);
      }
    };

    const salvarSWOT = (item) => {
      if (item.ativo) {
        const data = {
          empresaId: empresaId,
          strengths: strengths.value,
          weaknesses: weaknesses.value,
          opportunities: opportunities.value,
          threats: threats.value,
        };
        ApiService.post("manual-auditoria/swot", data).then(({ data }) => {
          console.log("ok");
        });
      }

      const request = {
        empresaId: empresaId,
        itemId: itemSelecionado.value?.id,
        resposta: item.texto,
        ativo: item.ativo,
      };
      ApiService.post("manual-auditoria/resposta", request).then(({ data }) => {
        if (itemSelecionado.value?.file) {
          const files = itemSelecionado.value?.file;
          console.log(files.files);
          if (files != null && files.files != null && files.files.length > 0) {
            salvarAnexarDocumentoItem(
              itemSelecionado.value?.id,
              files.files[0]
            );
          }
        }
      });
    };

    const deleteSwot = (lista, index) => {
      lista.splice(index, 1);
    };

    const addParteInteressada = (parte) => {
      partesInteressadas.value.push({
        nome: parte.nome,
        expectativa: parte.expectativa,
        metodo: parte.metodo,
      });
    };

    const deleteParteInteressada = (index) => {
      partesInteressadas.value.splice(index, 1);
    };

    const salvarParteInteressada = (item) => {
      if (item.ativo) {
        const data = {
          empresaId: empresaId,
          parteInteressada: partesInteressadas.value,
        };
        ApiService.post("manual-auditoria/parte-interessada", data).then(
          ({ data }) => {
            console.log("ok");
          }
        );
      }

      const request = {
        empresaId: empresaId,
        itemId: itemSelecionado.value?.id,
        resposta: item.texto,
        ativo: item.ativo,
      };
      ApiService.post("manual-auditoria/resposta", request).then(({ data }) => {
        if (itemSelecionado.value?.file) {
          const files = itemSelecionado.value?.file;
          console.log(files.files);
          if (files != null && files.files != null && files.files.length > 0) {
            salvarAnexarDocumentoItem(
              itemSelecionado.value?.id,
              files.files[0]
            );
          }
        }
      });
    };

    const AddComunicacao = (c) => {
      comunicacao.value.push({
        parteInteressada: c.parteInteressada,
        responsavel: c.responsavel,
        conteudo: c.conteudo,
        quando: c.quando,
        metodo: c.metodo,
      });
    };

    const salvarComunicacao = () => {
      const data = {
        empresaId: empresaId,
        comunicacao: comunicacao.value,
      };
      ApiService.post("manual-auditoria/comunicacao", data).then(({ data }) => {
        console.log("ok");
      });
    };

    const onFileAdd = (event) => {
      sistemaGestao.value.imagem = null;
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
      sistemaGestao.value.imagem = null;
      previewImage.value = "media/avatars/blank.png";
    };

    const salvarSistemaGestao = () => {
      salvarRespostaItem();
      const formData = new FormData();
      formData.append("imagem", imagem.value.files[0]);
      formData.append("empresaId", empresaId.toString());
      ApiService.post("manual-auditoria/sistema-gestao", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    };

    const salvarCapitulo = (obj) => {
      const data = {
        empresaId: empresaId,
        capituloId: capituloSelecionado.value.id,
        capitulo: capituloSelecionado.value.numero,
        ativo: obj.ativo,
        resposta: obj.texto,
      };
      ApiService.post("manual-auditoria/capitulo-resposta", data).then(
        ({ data }) => {
          console.log("ok");
        }
      );
    };

    return {
      auditoria,
      previewImage,
      imagem,
      sistemaGestao,
      capituloSelecionado,
      salvarCapitulo,
      capitulo2,
      capitulo3,
      item41,
      item42,
      item715,
      item83,
      removeImage,
      onFileAdd,
      salvarSistemaGestao,
      partesInteressadas,
      novaParte,
      AddComunicacao,
      salvarComunicacao,
      novaComunicacao,
      comunicacao,
      addParteInteressada,
      salvarParteInteressada,
      deleteParteInteressada,
      selecionarCapitulo,
      selecionarItem,
      salvarRespostaItem,
      salvarRespostaSubItem,
      listaItems,
      listaSubItems,
      itemSelecionado,
      contarItemsOk,
      auditoriaInterna,
      abrirAuditoriaInterna,
      closeAuditoriaInterna,
      strengths,
      weaknesses,
      opportunities,
      threats,
      addSWOT,
      salvarSWOT,
      deleteSwot,
    };
  },
});
</script>
