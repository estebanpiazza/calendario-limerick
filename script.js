/*************** UTILS **********************/
const { date } = Quasar.utils;
const {
  QCard,
  QTooltip,
  QBtn,
  QIcon,
  QDialog,
  QList,
  QItem,
  QItemSection,
  QItemLabel } =
Quasar;

function format(day, format) {
  return date.formatDate(day, format);
}

function getLabelMonth(day) {
  return format(day, "MMMM YYYY");
}

function getFormatDate(day, isOnlyDate) {
  return format(day, "DD/MM/YYYY" + (isOnlyDate ? "" : " hh:mm:ss A"));
}

function getDate(day) {
  const cloneDate = new Date(day);
  cloneDate.setHours(0, 0, 0, 0);
  return cloneDate;
}

function getTime(day) {
  return getDate(day).getTime();
}

function diffDays(day, daySecond) {
  return (getTime(day) - getTime(daySecond)) / (1000 * 60 * 60 * 24);
}

function getFirstDateMonth(day) {
  const newDate = getDate(day);
  newDate.setDate(1);
  return newDate;
}

/*function isBetweenDate(day, first, last) {
  const time = getDate(day).getTime();
  return getDate(first).getTime() <= time && time <= getDate(last).getTime();
}*/

function getDayIdentifier(day) {
  return day.getFullYear() * 10000 + (day.getMonth() + 1) * 100 + day.getDate();
}


function isBetweenDate(day, first, last) {
  const time = getDayIdentifier(day);
  return getDayIdentifier(first) <= time && time <= getDayIdentifier(last);
}

function equalDate(day, daySecond) {
  return getDate(day).getTime() === getDate(daySecond).getTime();
}

// Others
function isGreater(breakPoint = "md") {
  // xs: x <= 576
  // sm: 576 < x < 768
  // md: 768 < x < 992
  // lg: 992 < x < 1200
  // xl: 1200 < x
  return Quasar.Screen.gt[breakPoint] || Quasar.Screen[breakPoint];
}

function indexOf(arr, cb, initial = 0) {
  if (typeof cb === "function") {
    for (; initial < arr.length; initial++) {
      if (cb(arr[initial], initial)) {
        return initial;
      }
    }
  } else {
    for (; initial < arr.length; initial++) {
      if (cb === arr[initial]) {
        return initial;
      }
    }
  }
  return -1;
}
/************** END UTILS *********************/

const QCalendarMixin = {
  props: {
    optionTitle: {
      type: String,
      default: "title" },

    optionStart: {
      type: String,
      default: "start" },

    optionEnd: {
      type: String,
      default: "end" },

    optionColor: {
      type: String,
      default: "color" },

    optionSubcolor: {
      type: String,
      default: "subcolor" },

    optionCharacter: {
      type: String,
      default: "character" },

    optionIcon: {
      type: String,
      default: "icon" },

    optionHoliday: {
      type: String,
      default: "holiday" },

    optionOnlydate: {
      type: String,
      default: "onlydate" } } };




const QCalendarDay = {
  mixins: [QCalendarMixin],
  props: {
    events: {
      type: Array,
      default: () => [] },

    date: {
      type: [Date, String, Number] } },


  computed: {
    title() {
      return format(this.date, "DD MMMM YYYY");
    } },

  methods: {
    onClick(event) {
      this.$emit("click", event);
    } },

  render(h) {
    return h(QList, [
    h(
    "q-item-label",
    {
      class: "text-primary text-bold row",
      props: {
        header: true } },


    [
    h(
    "div",
    {
      class: "col" },

    this.title),

    h(
    "div",
    {
      class: "calendar-chip" },

    this.events.length)]),



    this.events.map(event => {
      return h(
      "q-item",
      {
        class: "calendar-month-detail",
        style: {
          "border-left-color": event[this.optionColor] },

        props: {
          clickable: true },

        directives: [{ name: "ripple" }],
        on: {
          click: () => {
            this.onClick(event);
          } } },


      [
      event[this.optionSubcolor] !== void 0 ||
      event[this.optionCharacter] !== void 0 ||
      event[this.optionIcon] !== void 0 ?
      h(
      "q-item-section",
      {
        class: "calendar-event-sub",
        props: {
          avatar: true },

        domProps: {
          innerHTML:
          event[this.optionIcon] === void 0 ?
          event[this.optionCharacter] === void 0 ?
          event[this.optionCharacter] :
          "&nbsp;" :
          void 0 },

        style: {
          "background-color": event[this.optionSubcolor] } },


      event[this.optionIcon] !== void 0 ?
      [
      h(QIcon, {
        props: {
          name: event[this.optionIcon] } })] :



      void 0) :

      void 0,
      h(QItemSection, [
      h(QItemLabel, event[this.optionTitle]),
      h(
      QItemLabel,
      {
        props: {
          caption: true } },


      [
      h("span", "Start: "),
      h(
      "span",
      getFormatDate(
      event[this.optionStart],
      event[this.optionOnlydate]))]),




      h(
      QItemLabel,
      {
        props: {
          caption: true } },


      [
      h("span", "End: "),
      h(
      "span",
      getFormatDate(
      event[this.optionEnd],
      event[this.optionOnlydate]))])]),





      h(
      QItemSection,
      {
        props: {
          avatar: true } },


      [
      h(QIcon, {
        props: {
          name: "keyboard_arrow_right",
          color: "secondary" } })])]);






    })]);

  } };


/**
 * {
 * title <String> - Title,
 * start <Date> - Date start,
 * end <Date> - Date end,
 * color <String> - Hexadecimal color in background,
 * subcolor <String> - Hexadecimal color in border,
 * icon <String> - Icon name for the event,
 * character <String> - Character inside subcolor node,
 * holiday <Boolean> - Is holiday event,
 * onlydate <Boolean> - Only date without hours
 * }
 */

const QCalendar = {
  mixins: [QCalendarMixin],
  props: {
    events: {
      type: Array,
      default() {
        return [];
      } },

    value: {
      type: Date,
      default() {
        return new Date();
      } },

    selectable: Boolean,
    mini: {
      type: [Boolean, String],
      validator: value => [true, false, 'auto'].indexOf(value) !== -1,
      default: "auto" },

    dark: Boolean,
    firstDayWeek: {
      type: Number,
      default: 0,
      validator: value => value >= 0 && value <= 7 } },


  data() {
    return {
      date: new Date(),
      mobileModal: false,
      mobileDate: new Date(),
      eventsDay: [] };

  },
  watch: {
    value(value) {
      this.date = value;
    } },

  computed: {
    isMobile() {
      if (this.mini === 'auto') {
        return isGreater() !== true;
      }
      return this.mini === true;
    } },

  created() {
    if (this.value) {
      this.date = new Date(this.value);
    }
  },
  methods: {
    changeMonth(add) {
      const cloneDate = new Date(this.date);
      cloneDate.setMonth(this.date.getMonth() + add);
      this.date = cloneDate;
      this.$emit("input", cloneDate);
      this.$emit("change", {
        year: cloneDate.getFullYear(),
        month: cloneDate.getMonth() });

    },
    onEvent(event) {
      this.$emit("event", event);
    },
    clickDay(day, events) {
      if (this.isMobile === true) {
        if (Array.isArray(events) && events.length > 0) {
          this.clickMobile(day, events);
        }
      } else if (this.selectable === true) {
        this.$emit("select", day);
      }
    },
    clickMobile(day, events) {
      this.mobileModal = true;
      this.mobileDate = day;
      this.eventsDay = events;
    },
    createEvent(h, size, event, startWeek, endWeek) {
      const classSize = `calendar-event-size-${size}`;
      if (event) {
        const colorEvent =
        event[this.optionHoliday] === true ?
        "#d09dc2" :
        event[this.optionColor];
        return h(
        "div",
        {
          class: {
            "calendar-event": true,
            [classSize]: true,
            "calendar-event-first":
            getTime(startWeek) <= getTime(event[this.optionStart]),
            "calendar-event-last":
            getTime(event[this.optionEnd]) <= getTime(endWeek) },

          style: {
            "background-color": colorEvent },

          on: {
            click: () => {
              this.onEvent(event);
            } } },


        [
        event[this.optionSubcolor] !== void 0 ||
        event[this.optionCharacter] !== void 0 ||
        event[this.optionIcon] ?
        h(
        "span",
        {
          staticClass: "calendar-event-sub",
          style: {
            "background-color": event[this.optionSubcolor],
            border:
            event[this.optionIcon] !== void 0 ? "none" : void 0 },

          domProps: {
            innerHTML:
            event[this.optionIcon] === void 0 ?
            this.event[this.optionCharacter] !== void 0 ?
            event[this.optionCharacter] :
            "&nbsp;" :
            void 0 } },


        event[this.optionIcon] !== void 0 ?
        [
        h(QIcon, {
          props: {
            name: event[this.optionIcon] } })] :



        void 0) :

        void 0,
        h("span", event[this.optionTitle]),
        h(QTooltip, [
        h("div", event[this.optionTitle]),
        h("div", [
        h("span", "Start: "),
        h(
        "span",
        getFormatDate(
        event[this.optionStart],
        event[this.optionOnlydate]))]),



        h("div", [
        h("span", "End: "),
        h(
        "span",
        getFormatDate(
        event[this.optionEnd],
        event[this.optionOnlydate]))])])]);






      } else {
        return h("div", {
          class: ["calendar-event", classSize, "calendar-event-void"],
          domProps: {
            innerHTML: "&nbsp;" } });


      }
    },
    insertEventWeek(
    h,
    events,
    infoWeek,
    dayStartWeek,
    dayEndWeek,
    index,
    availableDays,
    level)
    {
      const iWeek = infoWeek[index];
      if (iWeek && iWeek.start >= availableDays) {
        // Si tiene disponible colocar más eventos
        if (iWeek.start - availableDays) {
          events.push(this.createEvent(h, iWeek.start - availableDays));
        }
        // Se construye el evento
        events.push(
        this.createEvent(h, iWeek.size, iWeek.event, dayStartWeek, dayEndWeek));


        if (level !== 0) {
          // Si entro en la recursividad, entonces se elimina el item
          infoWeek.splice(index, 1);
        }

        const currentAvailableDays = iWeek.start + iWeek.size;
        if (currentAvailableDays < 7) {
          // Lo mismo que !!iWeek.end
          const indexNextEvent = indexOf(
          infoWeek,
          w => w.id !== iWeek.id && w.start >= currentAvailableDays);

          if (indexNextEvent >= 0) {
            this.insertEventWeek(
            h,
            events,
            infoWeek,
            dayStartWeek,
            dayEndWeek,
            indexNextEvent,
            currentAvailableDays,
            level + 1);

          } else {
            this.insertEventWeek(
            h,
            events,
            infoWeek,
            dayStartWeek,
            dayEndWeek,
            index,
            currentAvailableDays,
            level + 1);

          }
        } else {
          // Ya no hay más días disponibles
          // End iteration
        }
      } else {
        events.push(this.createEvent(h, 7 - availableDays));
        // End iteration
      }
    },
    getEventsDay(eventsWeek, nDay) {
      if (this.isMobile) {
        return eventsWeek.filter(event => {
          return isBetweenDate(
          nDay,
          event[this.optionStart],
          event[this.optionEnd]);

        });
      } else {
        return [];
      }
    } },

  render(h) {
    // v0.17: this.$q.i18n
    // v1+: this.$q.lang
    const daysShort = this.$q.lang.date.daysShort;

    // const currentDate = getFirstDateMonth()

    const currentDateMonth = getFirstDateMonth(this.date);
    const year = currentDateMonth.getFullYear();
    const month = currentDateMonth.getMonth();
    const rows = 6; // weekCount(year, month, this.firstDayWeek)
    const weeks = [];

    const initialDay =
    1 - (currentDateMonth.getDay() - this.firstDayWeek + 7) % 7;

    for (let numberWeek = 0; numberWeek < rows; numberWeek++) {
      const events = [];
      const countDaysAux = 7 * numberWeek;
      const dayStartWeek = new Date(year, month, countDaysAux + initialDay);
      const dayEndWeek = new Date(year, month, countDaysAux + initialDay + 6);

      // Calculando eventos por semana
      const eventsWeek = this.events.filter(event => {
        return (
          getTime(event[this.optionEnd]) < getTime(dayEndWeek) &&
          getTime(event[this.optionEnd]) >= getTime(dayStartWeek) ||
          getTime(event[this.optionEnd]) === getTime(dayEndWeek) ||
          getTime(event[this.optionEnd]) > getTime(dayEndWeek) &&
          getTime(event[this.optionStart]) <= getTime(dayEndWeek));

      });

      if (!this.isMobile) {
        const infoWeek = eventsWeek.
        map((event, i) => {
          const start =
          getTime(event[this.optionStart]) <= getTime(dayStartWeek) ?
          0 :
          diffDays(event[this.optionStart], dayStartWeek);
          const end =
          getTime(event[this.optionEnd]) >= getTime(dayEndWeek) ?
          0 :
          diffDays(dayEndWeek, event[this.optionEnd]);
          return {
            start, // Position initial day [0-6]
            end, // Number days available
            size: 7 - (start + end), // Size current event (in days)
            event, // Info
            id: i };

        }).
        sort((a, b) => a.start - b.start);

        infoWeek.forEach((item, i) => {
          this.insertEventWeek(
          h,
          events,
          infoWeek,
          dayStartWeek,
          dayEndWeek,
          i,
          0,
          0);

        });
      }

      // Building each day number
      const arrDays = [];
      for (let i = 0; i < 7; i++) {
        const nDay = getDate(dayStartWeek);
        nDay.setDate(nDay.getDate() + i);

        const eventsDay = Object.freeze(this.getEventsDay(eventsWeek, nDay));

        arrDays.push(
        h(
        "div",
        {
          class: {
            "calendar-day": true,
            "calendar-day-event": eventsDay.length,
            "calendar-day-current": equalDate(nDay, new Date()),
            "calendar-day-other": nDay.getMonth() !== month,
            "calendar-day-holiday": nDay.getDay() === 0 },

          on: {
            click: () => {
              this.clickDay(nDay, eventsDay);
            } } },


        [
        h(
        "div",
        {
          class: "calendar-day-number" },

        nDay.getDate())]));




      }

      const week = h(
      "div",
      {
        staticClass: "calendar-week-row" },

      [
      h(
      "div",
      {
        staticClass: "calendar-week-days row" },

      arrDays),

      h(
      "div",
      {
        staticClass: "calendar-week-events row" },

      events)]);



      weeks.push(week);
    }

    const weeksComponent = daysShort.map((value, i) => {
      const newIndex = (i + this.firstDayWeek) % 7;

      return h(
      "div",
      {
        staticClass: "calendar-week-item"
        /* class: {
        // 'calendar-week-item-holiday': newIndex === 0
        } */ },

      daysShort[newIndex]);

    });

    return h(
    QCard,
    {
      class: {
        "q-calendar": true,
        mobile: this.isMobile },

      props: {
        dark: this.dark } },


    [
    h(
    "div",
    {
      class: "calendar-header row" },

    [
   /*  h(QBtn, {
      props: {
        icon: "chevron_left",
        flat: true,
        round: true },

      on: {
        click: () => {
          this.changeMonth(-1);
        } } }), */


    h(
    "div",
    {
      class: "calendar-header-title col self-center" },

    getLabelMonth(currentDateMonth)),

    /* h(QBtn, {
      props: {
        icon: "chevron_right",
        flat: true,
        round: true },

      on: {
        click: () => {
          this.changeMonth(1);
        } } }) */]),




    h(
    "div",
    {
      class: "calendar-body" },

    [
    h(
    "div",
    {
      class: "calendar-week row" },

    weeksComponent),

    h(
    "div",
    {
      class: "calendar-content" },

    weeks)]),



    h(
    QDialog,
    {
      props: {
        contentClass: "q-modal-month",
        value: this.mobileModal,
        title: "Seleccione un evento",
        ok: false,
        footer: false },

      on: {
        input: value => {
          this.mobileModal = false;
        } } },


    [
    h(QCard, [
    h(QCalendarDay, {
      props: {
        events: this.eventsDay,
        date: this.mobileDate,
        // mixin props
        optionTitle: this.optionTitle,
        optionStart: this.optionStart,
        optionEnd: this.optionEnd,
        optionColor: this.optionColor,
        optionSubcolor: this.optionSubcolor,
        optionIcon: this.optionIcon,
        optionCharacter: this.optionCharacter,
        optionHoliday: this.optionHoliday,
        optionOnlydate: this.optionOnlydate },

      on: {
        click: this.onEvent } })])])]);







  } };


const CURRENT_DAY = new Date();

function getCurrentDay(day) {
  const newDay = new Date(CURRENT_DAY);
  newDay.setDate(day);
  return newDay;
}

const app = new Vue({
  
  el: "#q-app",
  components: { QCalendar },
  data() {
    return {
      miniOptions: [true, false, 'auto'],
      mini: false,
      dark: false,
      events: [
        //secundaria #113119 primaria : #811117 inicial : #044068 universal #04AA6D
      {
        id: 1,
        title: "Torneo de voley",
        color: "#044068",
        start: getCurrentDay(1),
        end: getCurrentDay(1) },

      {
        id: 2,
        title: "Green Day",
        color: "#811117",
        start: getCurrentDay(4),
        end: getCurrentDay(4),
       },

      {
        id: 3,
        title: "Torneo de futbol",
        color: "#113119",
        start: getCurrentDay(8),
        end: getCurrentDay(8),
        },
        {
          id: 3,
          title: "Dia del profe de inicial",
          color: "#044068",
          start: getCurrentDay(18),
          end: getCurrentDay(18),
          },

      {
        id: 9,
        title: "Receso primavera",
        color: "#04AA6D",
        start: getCurrentDay(29),
        end: getCurrentDay(34),
        icon: "flight" }],


      firstDayWeek: 0,
      days: this.$q.lang.date.days.map((label, value) => ({ label, value })) };

  },
  methods: {
    onEvent(event) {
      this.$q.dialog({
        title: "Event",
        message: JSON.stringify(event) });

    } } });