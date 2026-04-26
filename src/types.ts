export interface StoreData {
  id: number;
  storeType: 'a' | 'b' | 'c' | 'd';
  assortment: 'a' | 'b' | 'c';
  competitionDistance: number;
  promo2: boolean;
}

export interface DayRecord {
  date: string;
  storeId: number;
  dayOfWeek: number;
  sales: number;
  customers: number;
  open: boolean;
  promo: boolean;
  stateHoliday: '0' | 'a' | 'b' | 'c';
  schoolHoliday: boolean;
}

export interface EnhancedRecord extends DayRecord {
  // Time features
  month: number;
  weekOfYear: number;
  year: number;
  
  // Lags
  lag_1: number;
  lag_7: number;
  lag_14: number;
  
  // Rolling
  rolling_mean_7: number;
  rolling_mean_30: number;
  
  // Categorical encodings (simple)
  storeType_ordinal: number;
  assortment_ordinal: number;
}

export interface ModelMetrics {
  rmse: number;
  mae: number;
  r2: number;
}

export interface PipelineResults {
  trainRecords: EnhancedRecord[];
  testRecords: EnhancedRecord[];
  metrics: {
    linear: ModelMetrics;
    tree: ModelMetrics;
    naive: ModelMetrics;
    storeSpecific: ModelMetrics;
  };
  storeComparison: { storeId: number; globalRmse: number; localRmse: number }[];
  featureImportance: { name: string; score: number }[];
  forecast: { date: string; sales: number }[];
}
