package com.dawid.poradzinski.school.ski_rent_app.configs.security;

import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.List;

import org.openapitools.model.ErrorModel;
import org.openapitools.model.ResponseErrorModel;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {
    
    private final ObjectMapper mapper = new ObjectMapper()
        .registerModule(new JavaTimeModule())
        .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);


    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
            org.springframework.security.access.AccessDeniedException accessDeniedException)
            throws IOException, ServletException {
        ErrorModel error = new ErrorModel();
        error.setCategory("FORBIDDEN");
        error.setMessage("You do not have permission to access this resource");
        error.setFieldPath(request.getRequestURI());
        error.setFieldName(null);
        error.setFieldValue(null);
        ResponseErrorModel responseError = new ResponseErrorModel(OffsetDateTime.now(), List.of(error));
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");
        response.getWriter().write(mapper.writeValueAsString(responseError));
    }
}
