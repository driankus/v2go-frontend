import {
    startOfDay,
    endOfDay,
    subDays,
    addDays,
    endOfMonth,
    isSameDay,
    isSameMonth,
    addHours
} from 'date-fns';

export class CalendarEventDB {
    private colors: any = {
        red: {
            primary: '#f44336',
            secondary: '#FAE3E3'
        },
        blue: {
            primary: '#247ba0 ',
            secondary: '#D1E8FF'
        },
        yellow: {
            primary: '#ffd97d',
            secondary: '#FDF1BA'
        }
    };

    public events: any[] = [{
        _id: '100',
        start: subDays(startOfDay(new Date()), 1),
        end: addDays(new Date(), 1),
        title: 'Station #412 (reserved)',
        color: this.colors.red
    }, {
        _id: '101',
        start: startOfDay(new Date()),
        end: addDays(new Date(), 1),
        title: 'Station #337 (reserved)',
        color: this.colors.yellow
    }, {
        _id: '103',
        start: addHours(startOfDay(new Date()), 2),
        end: new Date(),
        title: 'My reservation',
        color: this.colors.yellow,
        resizable: {
            beforeStart: true,
            afterEnd: true
        },
        draggable: true
    }];
}
