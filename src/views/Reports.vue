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

                <v-select
                  v-model="selected"
                  :items="users"
                  label="Lista Utenti"
                  item-text="name"
                  item-value="id"
                  @change="changeSelect"
                ></v-select>

                <download-excel
                  class="btn btn-default"
                  :data="eventsById"
                  :fields="json_fields"
                  :before-generate="startDownload"
                  worksheet="My Worksheet"
                  name="filename.xls"
                  header="footerText"
                  footer="this.footerText.text"
                >
                  <v-btn class="mx-2" fab dark small color="primary">
                    <v-icon dark>
                      mdi-download
                    </v-icon>
                  </v-btn>
                </download-excel>
              </v-toolbar>
            </v-sheet>
            <v-sheet height="600">
              <v-calendar
                ref="calendar"
                v-model="focus"
                color="primary"
                :events="eventsById"
                :event-color="getEventColor"
                :type="type"
                @click:event="showEvent"
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
import downloadExcel from "vue-json-excel";
export default {
  components: {
    downloadExcel,
  },
  data() {
    return {
      json_fields: {
        "": "giorno_name",
        Data: "start",
        "Tipo Giornata": "totale_giorno",
        "Entrata Mat.": "totale_giorno",
        "Uscita Mat.": "totale_giorno",
        "Entrata Pom.": "totale_giorno",
        "Uscita Pom.": "totale_giorno",
        "Totale Giornata": "totale_giorno",
        FERIE: "totale_giorno",
        PERMESSI: "totale_giorno",
        TICKET: "totale_giorno",
        NOTE: "totale_giorno",
      },
      foglio: null,
      footerText: "ciao",
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
      open_dialog_edit_giorno: false,
      current_date: new Date(),
      selected: null,
      set_date: "",
      events: [],
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
    ...mapState(["userProfile", "users", "eventsById"])
  },
  created() {
    this.setInfo(new Date());
    this.eventsById = []
  },
  beforeUpdate() {
    this.setInfo(this.current_date);
  },
  mounted() {
    this.$refs.calendar.checkChange();
    this.setInfo(this.current_date);
    this.eventsById = [];
  },
  methods: {
    changeSelect() {
      (this.eventsById = []),
        this.$store.dispatch("getEventsById", { content: this.selected });
    },
    startDownload() {
      console.log("enter")
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
        if (d.getDay() == 6 && d.getDay() == 0) {
          var day = this.formatDate(d);
          var timeInMonth = filterTotali.filter(function(d) {
            return d.start == day;
          });
          if (timeInMonth == 0) {
            var color = "white";
            var options = { weekday: "long" };
            this.edit_giorno_text = new Date(day).toLocaleString(
              "it-IT",
              options
            );
            var newDay = [];
            this.eventsById.push({
              name: "weekend",
              start: day,
              end: day,
              giorno_name: this.edit_giorno_text,
              color: color,
              timed: this.rnd(0, 3) === 0,
              details: "test",
              tipologia: "weekend",
              entrata_mattino: "00:00",
              uscita_mattino: "00:00",
              entrata_pomeriggio: "00:00",
              uscita_pomeriggio: "00:00",
              totale_giorno: 0,
              ferie: "00:00",
              permessi: "00:00",
              ticket: 0,
              note: "",
              check_mese: false,
              mese: new Date(this.edit_data).getMonth() + 1,
              anno: new Date(this.edit_data).getFullYear(),
              ore_ferie_totali: 0,
              ore_permesso_totali: 0,
              ore_lavoro_totali: 0,
            });
             console.log(this.eventsById);
          }
        }
      }
    },
    setInfo(data) {
      this.ore_lavoro_totali = 0;
      this.ore_ferie_totali = "00:00";
      this.ore_permesso_totali = "00:00";

      var filterTotali = this.eventsById.filter(function(d) {
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
