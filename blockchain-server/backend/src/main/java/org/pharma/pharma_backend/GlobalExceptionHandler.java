package org.pharma.pharma_backend;

import org.hyperledger.fabric.client.GatewayException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(GatewayException.class)
    public ResponseEntity<Map<String, Object>> handleGatewayException(GatewayException ex) {
        String message = ex.getMessage();
        String code = "CHAIN_ERROR";
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;

        if (message != null) {
            if (message.contains("TRANSITION_NOT_FOUND")) {
                code = "TRANSITION_NOT_FOUND";
                status = HttpStatus.NOT_FOUND;
            } else if (message.contains("TRANSITION_ALREADY_EXISTS")) {
                code = "TRANSITION_ALREADY_EXISTS";
                status = HttpStatus.CONFLICT;
            } else if (message.contains("ALREADY_SOLD")) {
                code = "ALREADY_SOLD";
                status = HttpStatus.CONFLICT;
            } else if (message.contains("BATCH_RECALLED") || message.contains("RECALLED")) {
                code = "RECALLED";
                status = HttpStatus.CONFLICT;
            } else if (message.contains("CUSTODY_CHAIN_VIOLATION")) {
                code = "CUSTODY_CHAIN_VIOLATION";
                status = HttpStatus.CONFLICT;
            } else if (message.contains("UNAUTHORIZED_SELLER")) {
                code = "UNAUTHORIZED_SELLER";
                status = HttpStatus.CONFLICT;
            } else if (message.contains("INVALID_GENESIS")) {
                code = "INVALID_GENESIS";
                status = HttpStatus.BAD_REQUEST;
            } else if (message.contains("INVALID_TRANSITION")) {
                code = "INVALID_TRANSITION";
                status = HttpStatus.BAD_REQUEST;
            }
        }

        Map<String, Object> body = new HashMap<>();
        body.put("status", "error");
        body.put("code", code);
        body.put("message", message);

        return new ResponseEntity<>(body, status);
    }

    @ExceptionHandler(org.springframework.http.converter.HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleHttpMessageNotReadableException(org.springframework.http.converter.HttpMessageNotReadableException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("status", "error");
        body.put("code", "BAD_REQUEST");
        body.put("message", "Malformed JSON body: " + ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("status", "error");
        body.put("code", "INTERNAL_SERVER_ERROR");
        body.put("message", ex.getMessage());

        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
