export enum ComponentTypeEnum {
  CHART = 'chart',
  KPI = 'kpi',
}

export enum GraphTypeEnum {
  STANDARD = 'standard',
  GROWTH_INDEX = 'growth_index',
  BASIC = 'basic',
  SCORECARD = 'scorecard',
  RANKINGS = 'rankings',
  COLUMN_CHART = 'column_chart',
  DONUT_CHART = 'donut_chart',
  PIE_CHART = 'pie_chart',
  BAR_CHART = 'bar_chart',
  LINE_CHART = 'line_chart',
  TABLE_CHART = 'table_chart',
  FUNNEL_CHART = 'funnel_chart',
  AREA_CHART = 'area_chart',
  HEAT_MAP = 'heat_map',
}

export enum BaseObjectEnum {
  ANALYTICS = 'analytics',
}

export enum DateGranularityEnum {
  DAY = 'day',
  MONTH = 'month',
  YEAR = 'year',
}

export enum TaskColumnEnum {
  COUNTRY = 'country',
  STATE = 'state',
  LEGISLATION = 'legislation',
  LEGISLATION_RULE = 'legislation_rule',
  CATEGORY_OF_LAW = 'category_of_law',
  FREQUENCY = 'frequency',
  EXECUTOR = 'executor',
  EVALUATOR = 'evaluator',
  FUNCTION_HEAD = 'function_head',
  IMPACT_ON_UNIT = 'impact_on_unit',
}

export enum DurationTypeEnum {
  TODAY = 'today',
  THIS_WEEK = 'this_week',
  THIS_MONTH = 'this_month',
  THIS_YEAR = 'this_year',
  LAST = 'last',
  CUSTOM = 'custom',
}

export enum ComparisonTypeEnum {
  PREVIOUS_PERIOD = 'previous_period',
  SAME_PERIOD_LAST_YEAR = 'same_period_last_year',
  CUSTOM = 'custom',
}

export enum CompareObjectiveEnum {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
}

export enum ShowRankTypeEnum {
  TOP_5 = 'top_5',
  TOP_10 = 'top_10',
  TOP_15 = 'top_15',
  TOP_20 = 'top_20',
  BOTTOM_5 = 'bottom_5',
  BOTTOM_10 = 'bottom_5',
  BOTTOM_15 = 'bottom_15',
  BOTTOM_20 = 'bottom_20',
  LABEL_ASCENDING = 'label_ascending',
  LABEL_DESCENDING = 'label_descending',
  VALUE_ASCENDING = 'value_ascending',
  VALUE_DESCENDING = 'value_descending',
}
