package com.smartelephant.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.Clock;
import java.time.DateTimeException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;

/**
 * Days as the child's family sees them. Timestamps in the database are in the server's zone,
 * "today" and "yesterday" are in the client's zone (sent as ?tz=Asia/Jerusalem).
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ClientTime {

    private final Clock clock;

    /** The client's IANA zone; missing or unknown zones fall back to the server's zone. */
    public ZoneId zone(String timeZone) {
        if (timeZone == null || timeZone.isBlank()) {
            return serverZone();
        }
        try {
            return ZoneId.of(timeZone.trim());
        } catch (DateTimeException e) {
            log.warn("Unknown time zone '{}', using the server's zone", timeZone);
            return serverZone();
        }
    }

    public ZoneId serverZone() {
        return clock.getZone();
    }

    public LocalDate today(ZoneId clientZone) {
        return LocalDate.now(clock.withZone(clientZone));
    }

    /** Midnight of the client's day, as the server-zone time the database timestamps use. */
    public LocalDateTime startOfDayOnServer(LocalDate day, ZoneId clientZone) {
        return day.atStartOfDay(clientZone).withZoneSameInstant(serverZone()).toLocalDateTime();
    }

    /** A database timestamp shown in the client's zone. */
    public LocalDateTime toClient(LocalDateTime serverTime, ZoneId clientZone) {
        return serverTime == null ? null
                : serverTime.atZone(serverZone()).withZoneSameInstant(clientZone).toLocalDateTime();
    }
}
