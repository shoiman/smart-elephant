package com.smartelephant.exception;

/**
 * Thrown when a requested resource (child, animal, game session, etc.) is not found
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
