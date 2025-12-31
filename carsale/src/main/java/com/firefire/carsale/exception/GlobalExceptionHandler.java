package com.firefire.carsale.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import jakarta.servlet.http.HttpServletRequest;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler(ResourceNotFoundException.class)
        public ResponseEntity<ErrorResponse> handleNotFound(
                        ResourceNotFoundException ex, HttpServletRequest request) {

                return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage(), request);
        }

        @ExceptionHandler(BadRequestException.class)
        public ResponseEntity<ErrorResponse> handleBadRequest(
                        BadRequestException ex, HttpServletRequest request) {

                return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
        }

        @ExceptionHandler(ConflictException.class)
        public ResponseEntity<ErrorResponse> handleConflict(
                        ConflictException ex, HttpServletRequest request) {

                return buildResponse(HttpStatus.CONFLICT, ex.getMessage(), request);
        }

        @ExceptionHandler(UnauthorizedException.class)
        public ResponseEntity<ErrorResponse> handleUnauthorized(
                        UnauthorizedException ex, HttpServletRequest request) {

                return buildResponse(HttpStatus.UNAUTHORIZED, ex.getMessage(), request);
        }

        @ExceptionHandler(ForbiddenException.class)
        public ResponseEntity<ErrorResponse> handleForbidden(
                        ForbiddenException ex, HttpServletRequest request) {

                return buildResponse(HttpStatus.FORBIDDEN, ex.getMessage(), request);
        }

        @ExceptionHandler(BusinessException.class)
        public ResponseEntity<ErrorResponse> handleBusiness(
                        BusinessException ex, HttpServletRequest request) {

                return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<ErrorResponse> handleOther(
                        Exception ex, HttpServletRequest request) {

                return buildResponse(
                                HttpStatus.INTERNAL_SERVER_ERROR,
                                "Internal server error",
                                request);
        }

        private ResponseEntity<ErrorResponse> buildResponse(
                        HttpStatus status,
                        String message,
                        HttpServletRequest request) {

                ErrorResponse response = new ErrorResponse(
                                status.value(),
                                status.getReasonPhrase(),
                                message,
                                request.getRequestURI(),
                                LocalDateTime.now());

                return new ResponseEntity<>(response, status);
        }
}
