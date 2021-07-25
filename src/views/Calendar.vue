<template>
  <div id="calendar">
    <section>
      <div class="col2">
        <div class="calendar"></div>
        <v-row class="fill-height">
          <v-col>
            <v-sheet height="64">
              <v-toolbar flat>
                <v-btn
                  outlined
                  class="mr-4"
                  color="grey darken-2"
                  @click="setToday"
                >
                  Today
                </v-btn>
                <v-btn fab text small color="grey darken-2" @click="prev">
                  <v-icon small>
                    mdi-chevron-left
                  </v-icon>
                </v-btn>
                <v-btn fab text small color="grey darken-2" @click="next">
                  <v-icon small>
                    mdi-chevron-right
                  </v-icon>
                </v-btn>
                <v-toolbar-title v-if="$refs.calendar">
                  {{ $refs.calendar.title }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-dialog
                  v-model="open_dialog_edit_giorno"
                  persistent
                  max-width="600px"
                >
                  <v-card>
                    <v-card-title>
                      <span class="headline">Edit Presenza</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              label="Giorno"
                              required
                              v-model="edit_data"
                              disabled
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-autocomplete
                              :items="[
                                'Corso',
                                'Ferie',
                                'Festività',
                                'Lavorativa',
                                'Permessi',
                                'Visita Medica',
                                'Cassa Integ.',
                              ]"
                              label="Tipo Giornata"
                              v-model="edit_tipologia"
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="12" sm="3">
                            <v-text-field
                              label="Entrata Mattino"
                              type="time"
                              v-model="edit_entrata_mattino"
                              @input="up"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="3">
                            <v-text-field
                              label="Uscita Mattino"
                              type="time"
                              v-model="edit_uscita_mattino"
                              @input="up"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="3">
                            <v-text-field
                              label="Entrata Pomeriggio"
                              type="time"
                              v-model="edit_entrata_pomeriggio"
                              @input="up"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="3">
                            <v-text-field
                              label="Uscita Pomeriggio"
                              type="time"
                              v-model="edit_uscita_pomeriggio"
                              @input="up"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="50">
                            <v-text-field
                              label="Totale Giornata"
                              v-model="edit_totale_giorno"
                              required
                              disabled
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6"></v-col>
                          <v-col cols="12" sm="3">
                            <v-text-field
                              label="Ferie"
                              type="time"
                              v-model="edit_ferie"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="3">
                            <v-text-field
                              label="Permessi"
                              type="time"
                              v-model="edit_permessi"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="3">
                            <v-text-field
                              label="Ticket"
                              prefix="€"
                              v-model="edit_ticket"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-textarea
                              v-model="edit_note"
                              name="input-7-1"
                              label="Note"
                              value=""
                            ></v-textarea>
                          </v-col>
                          <v-col cols="12" sm="3">
                            <v-checkbox
                              v-model="edit_check_mese"
                              label="Tutto il mese"
                            ></v-checkbox>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="closeDay()">
                        Chiudi
                      </v-btn>
                      <v-btn color="blue darken-1" text @click="saveDay()">
                        Salva
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </v-sheet>
            <v-sheet height="600">
              <v-calendar
                ref="calendar"
                v-model="focus"
                color="primary"
                :events="events"
                :event-color="getEventColor"
                :type="type"
                @click:event="showEvent"
                @click:date="viewDay"
                :weekdays="weekdays"
              ></v-calendar>
              <v-menu
                v-model="selectedOpen"
                :close-on-content-click="false"
                :activator="selectedElementHtml"
                offset-x
              >
                <v-card color="grey lighten-4" min-width="350px" flat>
                  <v-toolbar :color="selectedEvent.color" dark>
                    <!-- <v-btn icon>
                      <v-icon @click="openEditModDay()">mdi-pencil</v-icon>
                    </v-btn>-->Ore fatte :
                    <v-toolbar-title
                      v-html="selectedEvent.name"
                    ></v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="deleteTime(selectedEvent)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-toolbar>
                  <v-card-text>
                    Entrata mattino:
                    <span v-html="selectedEvent.entrata_mattino"> </span> Uscita
                    mattino : <span v-html="selectedEvent.uscita_mattino"></span
                    ><br />
                    Entrata pomeriggio :
                    <span v-html="selectedEvent.entrata_pomeriggio"></span>
                    Uscita pomeriggio :
                    <span v-html="selectedEvent.uscita_pomeriggio"></span><br />
                    Permessi : <span v-html="selectedEvent.permessi"></span
                    ><br />
                    Ferie : <span v-html="selectedEvent.ferie"></span><br />
                    Ticket : <span v-html="selectedEvent.ticket"></span><br />
                    Note : <span v-html="selectedEvent.note"></span><br />
                  </v-card-text>
                  <v-card-actions>
                    <v-btn text color="secondary" @click="selectedOpen = false">
                      Cancel
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-menu>
            </v-sheet>
          </v-col>
        </v-row>
        <div class="text-center">
          <div>
            <v-btn class="ma-2" dark>
              <v-icon dark left> mdi-minus-circle </v-icon>Lavorate
              {{ this.ore_lavoro_totali }}
            </v-btn>

            <v-btn class="ma-2" dark>
              <v-icon dark left> mdi-minus-circle </v-icon>Permessi
              {{ this.ore_permesso_totali }}
            </v-btn>
            <v-btn class="ma-2" dark>
              <v-icon dark left> mdi-minus-circle </v-icon>Ferie
              {{ this.ore_ferie_totali }}
            </v-btn>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { commentsCollection } from "@/firebase";
import { mapState } from "vuex";
import moment from "moment";
export default {
  data() {
    return {
      ore_ferie_totali_view: "00:00",
      ore_permesso_totali_view: "00:00",
      ore_ferie_totali: 0,
      ore_permesso_totali: 0,
      ore_lavoro_totali: 0,
      edit_id: null,
      edit_data: null,
      edit_tipologia: null,
      edit_entrata_mattino: null,
      edit_entrata_mattino_view: false,
      edit_uscita_mattino: null,
      edit_uscita_mattino_view: false,
      edit_entrata_pomeriggio: null,
      edit_entrata_pomeriggio_view: false,
      edit_uscita_pomeriggio: null,
      edit_uscita_pomeriggio_view: false,
      edit_totale_giorno: null,
      edit_ferie: null,
      edit_permessi: null,
      edit_ticket: null,
      edit_note: null,
      edit_check_mese: false,
      edit_giorno_text: null,
      open_dialog_edit_giorno: false,
      current_date: new Date(),
      set_date: "",
      focus: "",
      type: "month",
      weekdays: [1, 2, 3, 4, 5, 6, 0],
      selectedEvent: {},
      selectedElement: {},
      selectedElementHtml: null,
      selectedOpen: false,
      dataSelezionata: null,
      time: null,
      colors: [
        "blue",
        "indigo",
        "deep-purple",
        "cyan",
        "green",
        "orange",
        "grey darken-1",
      ],
      items: [
        { text: "Ore Lavorate", icon: "mdi-clock" },
        { text: "Ore Ferie", icon: "mdi-account" },
        { text: "Ore Permesso", icon: "mdi-flag" },
      ],
    };
  },
  computed: {
    ...mapState(["userProfile", "events"]),
  },
  created() {
    this.setInfo(new Date());
  },
  beforeUpdate() {
    this.setInfo(this.current_date);
  },
  mounted() {
    this.$refs.calendar.checkChange();
    this.setInfo(this.current_date);
  },
  methods: {
    setInfo(data) {
      this.ore_lavoro_totali = 0;
      this.ore_ferie_totali = "00:00";
      this.ore_permesso_totali = "00:00";

      var filterTotali = this.events.filter(function(d) {
        return (
          d.mese == new Date(data).getMonth() + 1 &&
          d.anno == new Date(data).getFullYear()
        );
      });

      if (filterTotali.length > 1) {
        this.ore_lavoro_totali = filterTotali.reduce(function(acc, obj) {
          return acc + obj.totale_giorno;
        }, 0);

        this.ore_ferie_totali = filterTotali.reduce(
          (acc, time) => acc.add(moment.duration(time.ferie)._milliseconds),
          moment.duration()
        );

        this.ore_ferie_totali = moment.duration(
          this.ore_ferie_totali
        )._milliseconds;

        this.ore_permesso_totali = filterTotali.reduce(
          (acc, time) => acc.add(moment.duration(time.permessi)._milliseconds),
          moment.duration()
        );

        this.ore_permesso_totali = moment.duration(
          this.ore_permesso_totali
        )._milliseconds;
      } else if (filterTotali.length == 1) {
        this.ore_lavoro_totali = filterTotali[0].totale_giorno;

        this.ore_ferie_totali = moment.duration(
          filterTotali[0].ferie
        )._milliseconds;

        this.ore_permesso_totali = moment.duration(
          filterTotali[0].permessi
        )._milliseconds;
      }
      this.ore_ferie_totali =
        moment
          .duration(this.ore_ferie_totali)
          .hours()
          .toString() +
        ":" +
        moment
          .duration(this.ore_ferie_totali)
          .minutes()
          .toString();
      this.ore_permesso_totali =
        moment
          .duration(this.ore_permesso_totali)
          .hours()
          .toString() +
        ":" +
        moment
          .duration(this.ore_permesso_totali)
          .minutes()
          .toString();
    },

    viewDay({ date }) {
      var filter;
      if (this.events != undefined) {
        filter = this.events.filter(function(d) {
          return d.start == date;
        });
      }
      if (filter.length > 0) this.selectedElement = filter[0];
      else this.selectedElement = {};
      this.dataSelezionata = date;
      this.openEditDay();
    },

    getEventColor(event) {
      return event.color;
    },

    setToday() {
      this.focus = "";
      this.current_date = new Date();
      this.setInfo(this.current_date);
    },

    prev() {
      this.$refs.calendar.prev();
      this.current_date = new Date(
        this.current_date.setMonth(this.current_date.getMonth() - 1)
      );
      this.setInfo(this.current_date);
    },

    next() {
      this.$refs.calendar.next();
      this.current_date = new Date(
        this.current_date.setMonth(this.current_date.getMonth() + 1)
      );
      this.setInfo(this.current_date);
    },

    setTimeThroughoutMonth() {
      //devo capire come passare i dati ogni volta in modo da riutilizzare il save fatto prima
      var date = new Date(this.current_date);
      var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      var filterTotali = this.events.filter(function(d) {
        return (
          d.mese == new Date(date).getMonth() + 1 &&
          d.anno == new Date(date).getFullYear()
        );
      });
      for (var d = firstDay; d <= lastDay; d.setDate(d.getDate() + 1)) {
        if (d.getDay() != 6 && d.getDay() != 0) {
          var day = this.formatDate(d);
          var timeInMonth = filterTotali.filter(function(d) {
            return d.start == day;
          });
          if (timeInMonth == 0 && this.set_date != day) {
            this.edit_data = day;
            this.edit_check_mese = false;
            this.saveDay(false);
          }
        }
      }
      this.clearEditVariable();
    },

    clearEditVariable() {
      this.edit_data = null;
      this.edit_tipologia = null;
      this.edit_entrata_mattino = null;
      this.edit_uscita_mattino = null;
      this.edit_entrata_pomeriggio = null;
      this.edit_uscita_pomeriggio = null;
      this.edit_totale_giorno = null;
      this.edit_ferie = null;
      this.edit_permessi = null;
      this.edit_ticket = null;
      this.edit_note = null;
      this.edit_id = -1;
      this.edit_check_mese = false;
      this.open_dialog_edit_giorno = false;
      this.set_date = null;
    },

    saveDay(clearEdit = true) {
      this.ore_lavoro_totali = 0;
      this.ore_ferie_totali = "00:00";
      this.ore_permesso_totali = "00:00";
      this.edit_giorno_text = null;
      var filter;
      var filterTotali;
      var idForFilter = this.edit_id;
      var dataForFilter = this.edit_data;
      var checkMeseForFilter = false;
      if (this.edit_check_mese) {
        checkMeseForFilter = true;
        this.edit_check_mese = false;
      }

      var options = { weekday: "long" };
      this.edit_giorno_text = new Date(dataForFilter).toLocaleString(
        "it-IT",
        options
      );
      if (this.events != undefined) {
        filter = this.events.filter(function(d) {
          return d.id == idForFilter;
        });

        filterTotali = this.events.filter(function(d) {
          return (
            d.mese == new Date(dataForFilter).getMonth() + 1 &&
            d.anno == new Date(dataForFilter).getFullYear() &&
            d.id != idForFilter
          );
        });
      }

      var newDay = [];
      if (this.edit_ferie == null || this.edit_ferie == undefined)
        this.edit_ferie = "00:00";
      if (this.edit_permessi == null || this.edit_permessi == undefined)
        this.edit_permessi = "00:00";
      if (this.edit_ticket == null || this.edit_ticket == undefined)
        this.edit_ticket = "0";
      if (this.edit_note == null || this.edit_note == undefined)
        this.edit_note = " ";
      var color = "blue";
      if (this.edit_tipologia == "Corso") color = "blue";
      else if (this.edit_tipologia == "Ferie") color = "indigo";
      else if (this.edit_tipologia == "Festività") color = "deep-purple";
      else if (this.edit_tipologia == "Lavorativa") color = "green";
      else if (this.edit_tipologia == "Permessi") color = "cyan";
      else if (this.edit_tipologia == "Visita Medica") color = "orange";
      else if (this.edit_tipologia == "Cassa Integ.") color = "grey darken-1";

      if (filterTotali.length > 1) {
        this.ore_lavoro_totali = filterTotali.reduce(function(acc, obj) {
          return acc + obj.totale_giorno;
        }, 0);

        this.ore_lavoro_totali =
          this.ore_lavoro_totali + this.edit_totale_giorno;

        this.ore_ferie_totali = filterTotali.reduce(
          (acc, time) => acc.add(moment.duration(time.ferie)._milliseconds),
          moment.duration()
        );

        this.ore_ferie_totali =
          moment.duration(this.ore_ferie_totali)._milliseconds +
          moment.duration(this.edit_ferie)._milliseconds;

        this.ore_permesso_totali = filterTotali.reduce(
          (acc, time) => acc.add(moment.duration(time.permessi)._milliseconds),
          moment.duration()
        );

        this.ore_permesso_totali =
          moment.duration(this.ore_permesso_totali)._milliseconds +
          moment.duration(this.edit_permessi)._milliseconds;
      } else if (filterTotali.length == 0) {
        this.ore_lavoro_totali =
          this.ore_lavoro_totali + this.edit_totale_giorno;

        this.ore_ferie_totali =
          moment.duration(this.ore_ferie_totali)._milliseconds +
          moment.duration(this.edit_ferie)._milliseconds;

        this.ore_permesso_totali =
          moment.duration(this.ore_permesso_totali)._milliseconds +
          moment.duration(this.edit_permessi)._milliseconds;
      } else if (filterTotali.length == 1) {
        if (filterTotali[0].id != idForFilter) {
          this.ore_lavoro_totali =
            filterTotali[0].totale_giorno + this.edit_totale_giorno;

          this.ore_ferie_totali =
            moment.duration(filterTotali[0].ferie)._milliseconds +
            moment.duration(this.edit_ferie)._milliseconds;

          this.ore_permesso_totali =
            moment.duration(filterTotali[0].permessi)._milliseconds +
            moment.duration(this.edit_permessi)._milliseconds;
        } else if (filterTotali[0].id == idForFilter) {
          this.ore_lavoro_totali = this.edit_totale_giorno;

          this.ore_ferie_totali = moment.duration(
            this.edit_ferie
          )._milliseconds;

          this.ore_permesso_totali = moment.duration(
            this.edit_permessi
          )._milliseconds;
        }
      }

      this.ore_ferie_totali =
        moment
          .duration(this.ore_ferie_totali)
          .hours()
          .toString() +
        ":" +
        moment
          .duration(this.ore_ferie_totali)
          .minutes()
          .toString();
      this.ore_permesso_totali =
        moment
          .duration(this.ore_permesso_totali)
          .hours()
          .toString() +
        ":" +
        moment
          .duration(this.ore_permesso_totali)
          .minutes()
          .toString();

      newDay.push({
        name: this.edit_totale_giorno.toString(),
        start: this.edit_data,
        end: this.edit_data,
        giorno_name: this.edit_giorno_text,
        color: color,
        timed: this.rnd(0, 3) === 0,
        details: "test",
        tipologia: this.edit_tipologia,
        entrata_mattino: this.edit_entrata_mattino,
        uscita_mattino: this.edit_uscita_mattino,
        entrata_pomeriggio: this.edit_entrata_pomeriggio,
        uscita_pomeriggio: this.edit_uscita_pomeriggio,
        totale_giorno: this.edit_totale_giorno,
        ferie: this.edit_ferie,
        permessi: this.edit_permessi,
        ticket: this.edit_ticket,
        note: this.edit_note,
        check_mese: this.edit_check_mese,
        mese: new Date(this.edit_data).getMonth() + 1,
        anno: new Date(this.edit_data).getFullYear(),
        ore_ferie_totali: this.ore_ferie_totali.toString(),
        ore_permesso_totali: this.ore_permesso_totali.toString(),
        ore_lavoro_totali: this.ore_lavoro_totali,
      });

      if (filter.length == 0) {
        this.$store.dispatch("createTime", { content: newDay });
      } else {
        this.$store.dispatch("updateTime", {
          content: newDay,
          id: this.edit_id,
        });
      }

      filterTotali.forEach((element) => {
        newDay = [];
        if (element.id != idForFilter) {
          newDay.push({
            name: element.name.toString(),
            start: element.start,
            end: element.end,
            giorno_name: element.giorno_text,
            color: element.color,
            timed: this.rnd(0, 3) === 0,
            details: element.details,
            tipologia: element.tipologia,
            entrata_mattino: element.entrata_mattino,
            uscita_mattino: element.uscita_mattino,
            entrata_pomeriggio: element.entrata_pomeriggio,
            uscita_pomeriggio: element.uscita_pomeriggio,
            totale_giorno: element.totale_giorno,
            ferie: element.ferie,
            permessi: element.permessi,
            ticket: element.ticket,
            note: element.note,
            check_mese: element.check_mese,
            mese: element.mese,
            anno: element.anno,
            ore_ferie_totali: this.ore_ferie_totali.toString(),
            ore_permesso_totali: this.ore_permesso_totali.toString(),
            ore_lavoro_totali: this.ore_lavoro_totali,
          });
          this.$store.dispatch("updateTime", {
            content: newDay,
            id: element.id,
          });
        }
      });

      if (checkMeseForFilter) {
        this.set_date = this.edit_data;
        this.setTimeThroughoutMonth();
      }

      if (clearEdit) this.clearEditVariable();
    },

    deleteTime(item) {
      //delete del singolo evento
      //sottrare le oe di lavoro, ferie e permessi
      //aggiornare gli altri
      this.ore_lavoro_totali = 0;
      this.ore_ferie_totali = "00:00";
      this.ore_permesso_totali = "00:00";
      var filter;
      var filterTotali;
      var idForFilter = item.id;
      var dataForFilter = item.start;
      if (this.events != undefined) {
        filter = this.events.filter(function(d) {
          return d.id == idForFilter;
        });

        filterTotali = this.events.filter(function(d) {
          return (
            d.mese == new Date(dataForFilter).getMonth() + 1 &&
            d.anno == new Date(dataForFilter).getFullYear() &&
            d.id != idForFilter
          );
        });
      }

      var newDay = [];

      if (filterTotali.length > 1) {
        console.log("filterTotali.length > 1");
        this.ore_lavoro_totali = filterTotali.reduce(function(acc, obj) {
          return acc + obj.totale_giorno;
        }, 0);

        this.ore_lavoro_totali = this.ore_lavoro_totali - item.totale_giorno;

        this.ore_ferie_totali = filterTotali.reduce(
          (acc, time) => acc.add(moment.duration(time.ferie)._milliseconds),
          moment.duration()
        );

        this.ore_ferie_totali =
          moment.duration(this.ore_ferie_totali)._milliseconds -
          moment.duration(item.ferie)._milliseconds;

        this.ore_permesso_totali = filterTotali.reduce(
          (acc, time) => acc.add(moment.duration(time.permessi)._milliseconds),
          moment.duration()
        );

        this.ore_permesso_totali =
          moment.duration(this.ore_permesso_totali)._milliseconds -
          moment.duration(item.permessi)._milliseconds;
      } else if (filterTotali.length == 0) {
        console.log("filterTotali.length== 0");
        this.ore_lavoro_totali = this.ore_lavoro_totali - item.totale_giorno;

        this.ore_ferie_totali =
          moment.duration(this.ore_ferie_totali)._milliseconds -
          moment.duration(item.ferie)._milliseconds;

        this.ore_permesso_totali =
          moment.duration(this.ore_permesso_totali)._milliseconds -
          moment.duration(item.permessi)._milliseconds;
      } else if (filterTotali.length == 1) {
        if (filterTotali[0].id != idForFilter) {
          this.ore_lavoro_totali =
            filterTotali[0].totale_giorno - item.totale_giorno;

          this.ore_ferie_totali =
            moment.duration(filterTotali[0].ferie)._milliseconds -
            moment.duration(item.ferie)._milliseconds;

          this.ore_permesso_totali =
            moment.duration(filterTotali[0].permessi)._milliseconds -
            moment.duration(item.permessi)._milliseconds;
        } else if (filterTotali[0].id == idForFilter) {
          this.ore_lavoro_totali = this.edit_totale_giorno;

          this.ore_ferie_totali = moment.duration(
            this.edit_ferie
          )._milliseconds;

          this.ore_permesso_totali = moment.duration(
            this.edit_permessi
          )._milliseconds;
        }
      }

      this.ore_ferie_totali =
        moment
          .duration(this.ore_ferie_totali)
          .hours()
          .toString() +
        ":" +
        moment
          .duration(this.ore_ferie_totali)
          .minutes()
          .toString();
      this.ore_permesso_totali =
        moment
          .duration(this.ore_permesso_totali)
          .hours()
          .toString() +
        ":" +
        moment
          .duration(this.ore_permesso_totali)
          .minutes()
          .toString();

      this.$store.dispatch("deleteTime", { content: item });

      filterTotali.forEach((element) => {
        newDay = [];
        if (element.id != idForFilter) {
          newDay.push({
            name: element.name.toString(),
            start: element.start,
            end: element.end,
            color: element.color,
            timed: this.rnd(0, 3) === 0,
            details: element.details,
            tipologia: element.tipologia,
            entrata_mattino: element.entrata_mattino,
            uscita_mattino: element.uscita_mattino,
            entrata_pomeriggio: element.entrata_pomeriggio,
            uscita_pomeriggio: element.uscita_pomeriggio,
            totale_giorno: element.totale_giorno,
            ferie: element.ferie,
            permessi: element.permessi,
            ticket: element.ticket,
            note: element.note,
            check_mese: element.check_mese,
            mese: element.mese,
            anno: element.anno,
            ore_ferie_totali: this.ore_ferie_totali.toString(),
            ore_permesso_totali: this.ore_permesso_totali.toString(),
            ore_lavoro_totali: this.ore_lavoro_totali,
          });
          this.$store.dispatch("updateTime", {
            content: newDay,
            id: element.id,
          });
        }
      });

      this.edit_data = null;
      this.edit_tipologia = null;
      this.edit_entrata_mattino = null;
      this.edit_uscita_mattino = null;
      this.edit_entrata_pomeriggio = null;
      this.edit_uscita_pomeriggio = null;
      this.edit_totale_giorno = null;
      this.edit_ferie = null;
      this.edit_permessi = null;
      this.edit_ticket = null;
      this.edit_note = null;
      this.edit_id = -1;
      this.edit_check_mese = false;
      this.open_dialog_edit_giorno = false;
      this.selectedOpen = false;
    },

    closeDay() {
      this.edit_data = null;
      this.edit_tipologia = null;
      this.edit_entrata_mattino = null;
      this.edit_uscita_mattino = null;
      this.edit_entrata_pomeriggio = null;
      this.edit_uscita_pomeriggio = null;
      this.edit_totale_giorno = null;
      this.edit_ferie = null;
      this.edit_permessi = null;
      this.edit_ticket = null;
      this.edit_note = null;
      this.edit_id = -1;
      this.edit_check_mese = false;
      this.open_dialog_edit_giorno = false;
    },

    openEditDay() {
      this.open_dialog_edit_giorno = true;
      this.edit_data = this.dataSelezionata;
      this.edit_tipologia = this.selectedElement.tipologia;
      if (
        this.selectedElement.entrata_mattino == null ||
        this.selectedElement.entrata_mattino == undefined
      )
        this.edit_entrata_mattino = "09:00";
      else this.edit_entrata_mattino = this.selectedElement.entrata_mattino;

      if (
        this.selectedElement.uscita_mattino == null ||
        this.selectedElement.uscita_mattino == undefined
      )
        this.edit_uscita_mattino = "13:00";
      else this.edit_uscita_mattino = this.selectedElement.uscita_mattino;

      if (
        this.selectedElement.entrata_pomeriggio == null ||
        this.selectedElement.entrata_pomeriggio == undefined
      )
        this.edit_entrata_pomeriggio = "14:00";
      else
        this.edit_entrata_pomeriggio = this.selectedElement.entrata_pomeriggio;

      if (
        this.selectedElement.uscita_pomeriggio == null ||
        this.selectedElement.uscita_pomeriggio == undefined
      )
        this.edit_uscita_pomeriggio = "18:00";
      else this.edit_uscita_pomeriggio = this.selectedElement.uscita_pomeriggio;

      if (
        this.selectedElement.totale_giorno == null ||
        this.selectedElement.totale_giorno == undefined
      )
        this.edit_totale_giorno = 8;
      else this.edit_totale_giorno = this.selectedElement.totale_giorno;

      this.edit_ferie = this.selectedElement.ferie;
      this.edit_permessi = this.selectedElement.permessi;
      this.edit_ticket = this.selectedElement.ticket;
      this.edit_note = this.selectedElement.note;
      this.edit_check_mese = this.selectedElement.check_mese;
      if (this.selectedElement.id != undefined) {
        this.edit_id = this.selectedElement.id;
      } else {
        this.edit_id = -1;
        this.edit_check_mese = false;
      }
      // this.edit_id_giorno = this.selectedElement.id_giorno;
      //else this.edit_id_giorno = Math.ceil(Math.random()*10);
    },

    up() {
      console.log("up");
      if (
        this.edit_entrata_mattino != null &&
        this.edit_uscita_mattino &&
        this.edit_entrata_pomeriggio &&
        this.edit_uscita_pomeriggio
      ) {
        var [h1, m1] = this.edit_entrata_mattino.split(":");
        var [h2, m2] = this.edit_uscita_mattino.split(":");
        var start = new Date(),
          end = new Date();
        start.setHours(h1);
        start.setMinutes(m1);
        end.setHours(h2);
        end.setMinutes(m2);
        var mattino_diff = end.getTime() - start.getTime();
        var mattino = (mattino_diff / 1000.0 / 60 / 60).toFixed(1);

        [h1, m1] = this.edit_entrata_pomeriggio.split(":");
        [h2, m2] = this.edit_uscita_pomeriggio.split(":");
        (start = new Date()), (end = new Date());
        start.setHours(h1);
        start.setMinutes(m1);
        end.setHours(h2);
        end.setMinutes(m2);
        var pomeriggio_diff = end.getTime() - start.getTime();
        var pomeriggio = (pomeriggio_diff / 1000.0 / 60 / 60).toFixed(1);

        this.edit_totale_giorno = parseFloat(mattino) + parseFloat(pomeriggio);
      }
    },

    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElementHtml = nativeEvent.target;
        setTimeout(() => {
          this.selectedOpen = true;
        }, 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },

    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },

    formatDate(date) {
      var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month, day].join("-");
    },
  },
  filters: {
    formatDate(val) {
      if (!val) {
        return "-";
      }
      let date = val.toDate();
      return moment(date).fromNow();
    },
    trimLength(val) {
      if (val.length < 200) {
        return val;
      }
      return `${val.substring(0, 200)}...`;
    },
  },
};
</script>

<style lang="scss" scoped></style>
