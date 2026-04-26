import { addDays, format, getDay, getMonth, getWeek, getYear, parseISO, subDays } from 'date-fns';
import { DayRecord, StoreData } from '../types';

const STORES: StoreData[] = [
  { id: 1, storeType: 'c', assortment: 'a', competitionDistance: 1270, promo2: false },
  { id: 2, storeType: 'a', assortment: 'a', competitionDistance: 570, promo2: true },
  { id: 3, storeType: 'a', assortment: 'a', competitionDistance: 14130, promo2: true },
  { id: 4, storeType: 'c', assortment: 'c', competitionDistance: 620, promo2: false },
  { id: 5, storeType: 'a', assortment: 'a', competitionDistance: 29910, promo2: false },
];

export function generateRossmannData(days: number = 730): { records: DayRecord[], stores: StoreData[] } {
  const records: DayRecord[] = [];
  const baseDate = subDays(new Date(), days);

  STORES.forEach(store => {
    let baseWeeklyPattern = [0, 5000, 4500, 4200, 4400, 5500, 6000]; // Sun to Sat
    if (store.storeType === 'b') baseWeeklyPattern = [4000, 5200, 4800, 4900, 5100, 6000, 6500]; // Type b usually open on Sun

    for (let i = 0; i < days; i++) {
      const currentDate = addDays(baseDate, i);
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const dayOfWeek = getDay(currentDate); // 0 (Sun) to 6 (Sat)
      
      const isOpen = store.storeType === 'b' || dayOfWeek !== 0; // Most close on Sun
      const isPromo = (i % 14 < 5); // 5 days promo every 2 weeks
      
      let sales = 0;
      let customers = 0;

      if (isOpen) {
        const seasonality = 1 + 0.1 * Math.sin((2 * Math.PI * i) / 365); // Annual swing
        const promoEffect = isPromo ? 1.3 : 1.0;
        const noise = 0.95 + Math.random() * 0.1;
        
        sales = baseWeeklyPattern[dayOfWeek] * seasonality * promoEffect * noise;
        customers = sales / (5 + Math.random() * 2);
      }

      records.push({
        date: dateStr,
        storeId: store.id,
        dayOfWeek: dayOfWeek === 0 ? 7 : dayOfWeek, // Rossmann format: 1 (Mon) to 7 (Sun)
        sales: Math.round(sales),
        customers: Math.round(customers),
        open: isOpen,
        promo: isPromo,
        stateHoliday: '0',
        schoolHoliday: Math.random() > 0.9,
      });
    }
  });

  return { records, stores: STORES };
}
