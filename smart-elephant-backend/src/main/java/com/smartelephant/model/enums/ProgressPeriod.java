package com.smartelephant.model.enums;

import java.util.Locale;

/** Period of the parent's progress screen. */
public enum ProgressPeriod {
    /** The last 7 days, today included; activity by day */
    WEEK,
    /** The last 4 weeks (28 days); activity by week */
    MONTH,
    /** Everything; activity by calendar month */
    ALL;

    /** "week" | "month" | "all"; anything else is a week, the default */
    public static ProgressPeriod from(String value) {
        if (value == null) {
            return WEEK;
        }
        try {
            return valueOf(value.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException e) {
            return WEEK;
        }
    }
}
