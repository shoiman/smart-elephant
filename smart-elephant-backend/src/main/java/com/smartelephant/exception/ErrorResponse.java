package com.smartelephant.exception;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Standard error response shape returned by the API
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErrorResponse {
    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private List<String> details;
}
