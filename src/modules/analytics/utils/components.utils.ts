import * as moment from 'moment';
import {
    ComparisonTypeEnum,
    DurationTypeEnum,
    TaskColumnEnum,
} from "../constants/components.enum";

// export function isRelationField(column: string) {
//     if (
//         column === TaskColumnEnum.EXECUTOR ||
//         column === TaskColumnEnum.EVALUATOR ||
//         column === TaskColumnEnum.FUNCTION_HEAD ||
//         column === TaskColumnEnum.COUNTRY ||
//         column === TaskColumnEnum.STATE ||
//         column === TaskColumnEnum.LEGISLATION ||
//         column === TaskColumnEnum.LEGISLATION_RULE ||
//         column === TaskColumnEnum.CATEGORY_OF_LAW ||
//         column === TaskColumnEnum.FREQUENCY ||
//         column === TaskColumnEnum.IMPACT_ON_UNIT
//     ) {
//         return true;
//     }
//     return false;
// }

export const componentsShowColumns = {
    trip_name: { key: 'trip_name', table: 'trip', type: 'string' },
    travel_type: { key: 'travel_type', table: 'trip', type: 'string' },
    is_billable: { key: 'is_billable', table: 'trip', type: 'string' },
    budget_amount: { key: 'budget_amount', table: 'trip', type: 'string' },
    is_personal: { key: 'is_personal', table: 'trip', type: 'string' },
    is_visa_required: { key: 'is_visa_required', table: 'trip', type: 'string' },
    approval_status: { key: 'approval_status', table: 'trip', type: 'string' },
    // is_personal: { key: 'is_personal', table: 'trip', type: 'string' },
    customer: { key: 'customer', table: 'trip', type: 'lookup', title: 'company_name' },
    project: { key: 'project', table: 'trip', type: 'lookup', title: 'project_name' },
    currency: { key: 'currency', table: 'trip', type: 'lookup', title: 'currency_code' },
    created_at: { key: 'created_at', table: 'trip', type: 'date' },
    updated_at: { key: 'updated_at', table: 'trip', type: 'date' },

    // itineraries
    air_travel_type: { key: 'air_travel_type', table: 'itineraries', type: 'string' },
    travel_mode: { key: 'travel_mode', table: 'itineraries', type: 'string' },

    // flight
    departure_airport_name: { key: 'departure_airport_name', table: 'flight', type: 'string' },
    departure_city: { key: 'departure_city', table: 'flight', type: 'string' },
    departure_country_name: { key: 'departure_country_name', table: 'flight', type: 'string' },
    departure_date: { key: 'departure_date', table: 'flight', type: 'date' },
    arrival_airport_name: { key: 'arrival_airport_name', table: 'flight', type: 'string' },
    arrival_city: { key: 'arrival_city', table: 'flight', type: 'string' },
    arrival_country_name: { key: 'arrival_country_name', table: 'flight', type: 'string' },
    arrival_date: { key: 'arrival_date', table: 'flight', type: 'date' },
    class: { key: 'class', table: 'flight', type: 'string' },
    time_preference: { key: 'time_preference', table: 'flight', type: 'string' },
    seat_type: { key: 'seat_type', table: 'flight', type: 'string' },
    meal_type: { key: 'meal_type', table: 'flight', type: 'string' },

    // hotel
    checkin_date: { key: 'checkin_date', table: 'hotel', type: 'date' },
    checkout_date: { key: 'checkout_date', table: 'hotel', type: 'date' },
    city: { key: 'city', table: 'hotel', type: 'lookup', title: 'name' },

    // car
    pick_up_location: { key: 'pick_up_location', table: 'car', type: 'lookup', title: 'name' },
    pick_up_date: { key: 'pick_up_date', table: 'car', type: 'date' },
    drop_off_location: { key: 'drop_off_location', table: 'car', type: 'lookup', title: 'name' },
    drop_off_date: { key: 'drop_off_date', table: 'car', type: 'date' },
    car_type: { key: 'car_type', table: 'car', type: 'string' },
    is_driver_needed: { key: 'is_driver_needed', table: 'car', type: 'string' },

    // bus
    bus_departure_city: { key: 'departure_city', table: 'bus', type: 'lookup', title: 'name' },
    bus_departure_date: { key: 'departure_date', table: 'bus', type: 'date' },
    bus_arrival_city: { key: 'arrival_city', table: 'bus', type: 'lookup', title: 'name' },
    bus_arrival_date: { key: 'arrival_date', table: 'bus', type: 'date' },

    // train
    train_departure_city: { key: 'departure_city', table: 'train', type: 'lookup', title: 'name' },
    train_departure_date: { key: 'departure_date', table: 'train', type: 'date' },
    train_arrival_city: { key: 'arrival_city', table: 'train', type: 'lookup', title: 'name' },
    train_arrival_date: { key: 'arrival_date', table: 'train', type: 'date' },
}

export function getDateRanges(component) {
    const today = moment(); // Initialize with moment.js

    switch (component.duration_type) {
        case DurationTypeEnum.TODAY:
            return {
                from_date: today.clone().startOf('day').format('YYYY-MM-DD'),
                to_date: today.clone().endOf('day').format('YYYY-MM-DD'),
            };
        case DurationTypeEnum.THIS_WEEK:
            return {
                from_date: today.clone().startOf('week').add(1, 'days').format('YYYY-MM-DD'),
                to_date: today.clone().endOf('week').add(1, 'days').format('YYYY-MM-DD'),
            };
        case DurationTypeEnum.THIS_MONTH:
            return {
                from_date: today.clone().startOf('month').format('YYYY-MM-DD'),
                to_date: today.clone().endOf('month').format('YYYY-MM-DD'),
            };
        case DurationTypeEnum.THIS_YEAR:
            return {
                from_date: today.clone().startOf('year').format('YYYY-MM-DD'),
                to_date: today.clone().endOf('year').format('YYYY-MM-DD'),
            };
        case DurationTypeEnum.LAST: {
            const day = component.custom_last_days - 1;
            return {
                from_date: moment().subtract(day, 'days').startOf('day').format('YYYY-MM-DD'),
                to_date: moment().endOf('day').format('YYYY-MM-DD'),
            };
        }
        case DurationTypeEnum.CUSTOM:
            return {
                from_date: moment(component.custom_from_date).startOf('day').format('YYYY-MM-DD'),
                to_date: moment(component.custom_to_date).endOf('day').format('YYYY-MM-DD'),
            };
    }
}

export function getCompareDateRanges(component) {
    const today = moment();

    if (component.compare_to === ComparisonTypeEnum.PREVIOUS_PERIOD) {
        switch (component.duration_type) {
            case DurationTypeEnum.TODAY:
                return {
                    compare_from_date: today.clone().subtract(1, 'days').startOf('day').format('YYYY-MM-DD'),
                    compare_to_date: today.clone().subtract(1, 'days').endOf('day').format('YYYY-MM-DD'),
                }
            case DurationTypeEnum.THIS_WEEK:
                return {
                    compare_from_date: today.clone().subtract(1, 'week').startOf('week').add(1, 'days').format('YYYY-MM-DD'),
                    compare_to_date: today.clone().subtract(1, 'week').endOf('week').add(1, 'days').format('YYYY-MM-DD'),
                };
            case DurationTypeEnum.THIS_MONTH:
                return {
                    compare_from_date: today.clone().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
                    compare_to_date: today.clone().subtract(1, 'month').endOf('month').format('YYYY-MM-DD'),
                };
            case DurationTypeEnum.THIS_YEAR:
                return {
                    compare_from_date: today.clone().subtract(1, 'year').startOf('year').format('YYYY-MM-DD'),
                    compare_to_date: today.clone().subtract(1, 'year').endOf('year').format('YYYY-MM-DD'),
                };
        }
    }
    else if (component.compare_to === ComparisonTypeEnum.SAME_PERIOD_LAST_YEAR) {
        switch (component.duration_type) {
            case DurationTypeEnum.TODAY:
                return {
                    compare_from_date: today.clone().subtract(1, 'year').startOf('day').format('YYYY-MM-DD'),
                    compare_to_date: today.clone().subtract(1, 'year').endOf('day').format('YYYY-MM-DD'),
                }
            case DurationTypeEnum.THIS_WEEK:
                return {
                    compare_from_date: today.clone().subtract(1, 'year').startOf('week').add(1, 'days').format('YYYY-MM-DD'),
                    compare_to_date: today.clone().subtract(1, 'year').endOf('week').add(1, 'days').format('YYYY-MM-DD'),
                };
            case DurationTypeEnum.THIS_MONTH:
                return {
                    compare_from_date: today.clone().subtract(1, 'year').startOf('month').format('YYYY-MM-DD'),
                    compare_to_date: today.clone().subtract(1, 'year').endOf('month').format('YYYY-MM-DD'),
                };
            case DurationTypeEnum.THIS_YEAR:
                return {
                    compare_from_date: today.clone().subtract(1, 'year').startOf('year').format('YYYY-MM-DD'),
                    compare_to_date: today.clone().subtract(1, 'year').endOf('year').format('YYYY-MM-DD'),
                };
        }
    }
    else if (component.compare_to === ComparisonTypeEnum.CUSTOM) {
        return {
            from_date: moment(component.compare_from_date).startOf('day').format('YYYY-MM-DD'),
            to_date: moment(component.compare_to_date).endOf('day').format('YYYY-MM-DD'),
        };
    }
}

export function previousLabel(component, from_date, to_date) {

    if (component.compare_to === ComparisonTypeEnum.PREVIOUS_PERIOD) {
        switch (component.duration_type) {
            case DurationTypeEnum.TODAY:
                return 'yesterday';
            case DurationTypeEnum.THIS_WEEK:
                return 'last week';
            case DurationTypeEnum.THIS_MONTH:
                return 'last month';
            case DurationTypeEnum.THIS_YEAR:
                return 'last year';
        }
    }
    else if (component.compare_to === ComparisonTypeEnum.SAME_PERIOD_LAST_YEAR) {
        return 'same period last year';
    }
    else if (component.compare_to === ComparisonTypeEnum.CUSTOM) {
        return `${from_date} - ${to_date}`;
    }
}


export async function comparator(queryBuilder, component) {
    if (component?.criteria_filters)
        for (let filter of component.criteria_filters) {
            const { comparator, api_name, value } = filter;
            const column = componentsShowColumns[`${api_name}`];

            let key = `${column.table}.${column.key}`;
            if (column.type === 'lookup')
                key = `${component.column}.${column.title}`;

            switch (comparator) {
                case 'equal':
                    if (column.type === 'date')
                        queryBuilder.andWhere(`DATE(${key}) = :value`, { value: new Date(value) });
                    else
                        queryBuilder.andWhere(`${key} = :value`, { value });
                    break;

                case "not_equal":
                    if (column.type === 'date')
                        queryBuilder.andWhere(`DATE(${key}) <> :value OR ${key} IS NULL`, { value: new Date(value) });
                    else
                        queryBuilder.andWhere(`${key} <> :value OR ${key} IS NULL`, { value });
                    break;

                case 'contains':
                    queryBuilder.andWhere(`${key} LIKE :value`, { value: `%${value}%` });
                    break;

                case 'not_contains':
                    queryBuilder.andWhere(`${key} NOT LIKE :value OR ${key} IS NULL`, { value: `%${value}%` });
                    break;

                case 'starts_with':
                    queryBuilder.andWhere(`${key} LIKE :value`, { value: `${value}%` });
                    break;

                case 'ends_with':
                    queryBuilder.andWhere(`${key} LIKE :value`, { value: `%${value}` });
                    break;

                case 'is_empty':
                    queryBuilder.andWhere(`${key} IS NULL`);
                    break;

                case 'is_not_empty':
                    queryBuilder.andWhere(`${key} IS NOT NULL`);
                    break;

                // case 'between':
                //     const [start, end] = value.split(',');
                //     queryBuilder.andWhere(`compliance_task.${api_name} BETWEEN :start AND :end`, {
                //         start: moment(start, 'MM/DD/YYYY hh:mm A').toISOString(),
                //         end: moment(end, 'MM/DD/YYYY hh:mm A').toISOString()
                //     });
                //     break;

                case 'is_before':
                    queryBuilder.andWhere(`DATE(${key}) < :value`, { value: new Date(value) });
                    break;

                case 'is_after':
                    queryBuilder.andWhere(`DATE(${key}) > :value`, { value: new Date(value) });
                    break;

                case 'between':
                    const [start, end] = value.split(',');
                    queryBuilder.andWhere(`DATE(${key}) BETWEEN :start AND :end`, {
                        start: moment(start, 'MM/DD/YYYY hh:mm A').toDate(),
                        end: moment(end, 'MM/DD/YYYY hh:mm A').toDate()
                    });
                    break;

                case 'not_between':
                    const [notStart, notEnd] = value.split(',');
                    queryBuilder.andWhere(`DATE(${key}) NOT BETWEEN :start AND :end`, {
                        start: moment(notStart, 'MM/DD/YYYY hh:mm A').toDate(),
                        end: moment(notEnd, 'MM/DD/YYYY hh:mm A').toDate()
                    });
                    break;

                case 'today':
                    const startOfToday = moment().startOf('day').format('YYYY-MM-DD');
                    queryBuilder.andWhere(`DATE(${key}) = :date`, {
                        date: startOfToday,
                    });
                    break;

                case 'tomorrow':
                    const startOfTomorrow = moment().add(1, 'day').startOf('day').format('YYYY-MM-DD');
                    queryBuilder.andWhere(`DATE(${key}) = :date`, {
                        date: startOfTomorrow,
                    });
                    break;

                case 'tomorrow_onwards':
                    const startOfTomorrowOnwards = moment().add(1, 'day').startOf('day').format('YYYY-MM-DD');
                    queryBuilder.andWhere(`DATE(${key}) >= :start`, {
                        start: startOfTomorrowOnwards
                    });
                    break;

                case 'yesterday':
                    const startOfYesterday = moment().subtract(1, 'day').startOf('day').format('YYYY-MM-DD');
                    queryBuilder.andWhere(`DATE(${key}) = :date`, {
                        date: startOfYesterday,
                    });
                    break;

                case 'till_yesterday':
                    const endOfYesterdayTill = moment().subtract(1, 'day').startOf('day').format('YYYY-MM-DD');
                    queryBuilder.andWhere(`DATE(${key}) <= :end`, {
                        end: endOfYesterdayTill
                    });
                    break;

                case 'last_month':
                    const startOfLastMonth = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
                    const endOfLastMonth = moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD');
                    queryBuilder.andWhere(`DATE(${key}) BETWEEN :start AND :end`, {
                        start: startOfLastMonth,
                        end: endOfLastMonth
                    });
                    break;

                case 'this_month':
                    const startOfThisMonth = moment().startOf('month').format('YYYY-MM-DD');
                    const endOfThisMonth = moment().endOf('month').format('YYYY-MM-DD');
                    queryBuilder.andWhere(`DATE(${key}) BETWEEN :start AND :end`, {
                        start: startOfThisMonth,
                        end: endOfThisMonth
                    });
                    break;

                case 'next_month':
                    const startOfNextMonth = moment().add(1, 'month').startOf('month').format('YYYY-MM-DD');
                    const endOfNextMonth = moment().add(1, 'month').endOf('month').format('YYYY-MM-DD');
                    queryBuilder.andWhere(`DATE(${key}) BETWEEN :start AND :end`, {
                        start: startOfNextMonth,
                        end: endOfNextMonth
                    });
                    break;

                case 'last_week':
                    const startOfLastWeek = moment().subtract(1, 'week').startOf('week').add(1, 'days').format('YYYY-MM-DD');
                    const endOfLastWeek = moment().subtract(1, 'week').endOf('week').add(1, 'days').format('YYYY-MM-DD');
                    queryBuilder.andWhere(`DATE(${key}) BETWEEN :start AND :end`, {
                        start: startOfLastWeek,
                        end: endOfLastWeek
                    });
                    break;

                case 'this_week':
                    const startOfThisWeek = moment().startOf('week').add(1, 'days').format('YYYY-MM-DD');
                    const endOfThisWeek = moment().endOf('week').add(1, 'days').format('YYYY-MM-DD');
                    queryBuilder.andWhere(`DATE(${key}) BETWEEN :start AND :end`, {
                        start: startOfThisWeek,
                        end: endOfThisWeek
                    });
                    break;

                case 'next_week':
                    const startOfNextWeek = moment().add(1, 'week').startOf('week').add(1, 'days').format('YYYY-MM-DD');
                    const endOfNextWeek = moment().add(1, 'week').endOf('week').add(1, 'days').format('YYYY-MM-DD');
                    queryBuilder.andWhere(`DATE(${key}) BETWEEN :start AND :end`, {
                        start: startOfNextWeek,
                        end: endOfNextWeek
                    });
                    break;

                case 'age_in_days':
                    const ageInDays = parseInt(value, 10);
                    const startOfDate = moment().subtract(ageInDays, 'days').startOf('day').format('YYYY-MM-DD');
                    queryBuilder.andWhere(`DATE(${key}) <= :start`, { start: startOfDate });
                    break;

                case 'due_in_days':
                    const dueInDays = parseInt(value, 10);
                    const endOfDate = moment().add(dueInDays, 'days').endOf('day').format('YYYY-MM-DD');
                    queryBuilder.andWhere(`DATE(${key}) <= :end`, { end: endOfDate });
                    break;

                default:
                    break;
            }
        }
    return;
}

export const paginatedData = (obj: any, skip: number, take: number) => {
    const paginatedEntries = obj.slice(skip, skip + take);
    return paginatedEntries;
}