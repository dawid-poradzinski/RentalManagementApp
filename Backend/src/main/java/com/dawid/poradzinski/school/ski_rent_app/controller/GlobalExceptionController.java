package com.dawid.poradzinski.school.ski_rent_app.controller;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import org.openapitools.model.Error;
import org.openapitools.model.ResponseError;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import tools.jackson.core.JacksonException;
import tools.jackson.databind.exc.InvalidFormatException;
import tools.jackson.databind.exc.MismatchedInputException;

@ControllerAdvice
public class GlobalExceptionController {

    @ExceptionHandler
    public ResponseEntity<ResponseError> handleMethodArgumentNotValidException(MethodArgumentNotValidException exception) {
        
        List<Error> errors = new ArrayList<>();

        exception.getBindingResult().getAllErrors().forEach(error -> {
            String description = error.getDefaultMessage();
            String entirePath = ((FieldError) error).getField();
            String fieldPath;
            String fieldName;
            if (entirePath.contains(".")) {
                fieldPath = entirePath.substring(0, entirePath.lastIndexOf("."));
                fieldName = entirePath.substring(entirePath.lastIndexOf(".") + 1);
            } else {
                fieldPath = ".";
                fieldName = entirePath;
            }

            String fieldValue = Objects.requireNonNullElse(((FieldError) error).getRejectedValue(), "").toString();
            
            errors.add(new Error()
                    .fieldPath(fieldPath)
                    .fieldName(fieldName)
                    .fieldValue(description.contains("size must be between") ? description : fieldValue)
                    .category(exception.getBody().getDetail())
                    .message(description));
        });

        return ResponseEntity.status(exception.getStatusCode()).body(new ResponseError().timestamp(OffsetDateTime.now()).errors(errors));
    }

    @ExceptionHandler
    ResponseEntity<ResponseError> handleHttpMessageNotReadableExceltion(HttpMessageNotReadableException exception) {

        List<String> pathParts = new ArrayList<>();
        String fieldValue = "";
        String fieldPath = "";
        String fieldName = "";

        JacksonException abc = (JacksonException) exception.getCause();
        
        String category = exception.getMessage().substring(0, exception.getMessage().indexOf(':'));

        if (exception.getCause() instanceof InvalidFormatException invalidFormatException) {
            fieldValue = invalidFormatException.getValue().toString();
        } else if (exception.getCause() instanceof MismatchedInputException mismatchedInputException) {
            fieldValue = mismatchedInputException.getCurrentToken().asString();
        }

        abc.getPath().forEach(path -> {
            pathParts.add(getValueFromPath(path));
        });

        List<String> fieldPathParts = new ArrayList<>();

        if(!pathParts.isEmpty()) {
            StringBuilder pathBuilder = new StringBuilder(pathParts.getFirst());
            
            pathParts.stream().skip(1).forEach(path -> {
                if(path.contains("[")) {
                    pathBuilder.append(path);
                    fieldPathParts.add(pathBuilder.toString());
                    pathBuilder.setLength(0);
                } else {
                    fieldPathParts.add(pathBuilder.toString());
                    pathBuilder.replace(0, pathBuilder.length(), path);
                }
            });
            fieldPath = fieldPathParts.isEmpty() ? "." : String.join(".", fieldPathParts);
            fieldName = pathBuilder.isEmpty() ? "." : pathBuilder.toString();
        }

        Error error = new Error().fieldName(fieldName).fieldPath(fieldPath).fieldValue(fieldValue).message(exception.getMessage()).category(category);
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseError().timestamp(OffsetDateTime.now()).errors(List.of(error)));
    }

    @ExceptionHandler ResponseEntity<ResponseError> handleRuntimeException(RuntimeException exception) {
        Error error = new Error();

        String[] message = exception.getMessage().split(":");
        error.setCategory(exception.getClass().getSimpleName());
        error.setMessage(message[0]);
        error.setFieldValue(message[1].strip());

        List<Error> errors = new ArrayList<>();
        errors.add(error);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ResponseError().timestamp(OffsetDateTime.now()).errors(errors));
    }

    @ExceptionHandler
    public ResponseEntity<ResponseError> handleErrors(Exception exception) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ResponseError());
    }

    private String getValueFromPath(JacksonException.Reference path) {
        return path.toString().indexOf('"') == -1 ? path.toString().substring(path.toString().indexOf("[")) : path.getPropertyName();
    }
}
