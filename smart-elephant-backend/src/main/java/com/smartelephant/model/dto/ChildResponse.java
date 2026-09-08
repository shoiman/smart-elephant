package com.smartelephant.model.dto;

import lombok.*;
import java.time.LocalDateTime;

/**
 * Response payload representing a registered child profile
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChildResponse {
    private Long id;
    private String name;
    private Integer age;
    private String language;
    private LocalDateTime createdAt;
}
