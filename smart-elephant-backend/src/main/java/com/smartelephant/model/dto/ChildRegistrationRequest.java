package com.smartelephant.model.dto;

import lombok.*;
import jakarta.validation.constraints.*;

/**
 * Request payload for registering a new child profile
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChildRegistrationRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must be at most 100 characters")
    private String name;

    @NotNull(message = "Age is required")
    @Min(value = 2, message = "Age must be at least 2")
    @Max(value = 6, message = "Age must be at most 6")
    private Integer age;

    @NotBlank(message = "Language is required")
    @Pattern(regexp = "^(he|ru|uk|en)$", message = "Language must be one of: he, ru, uk, en")
    private String language;
}
