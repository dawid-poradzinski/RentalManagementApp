package com.dawid.poradzinski.school.ski_rent_app.configs.security;

import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.List;

import org.openapitools.model.ErrorModel;
import org.openapitools.model.ResponseErrorModel;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper mapper = new ObjectMapper()
        .registerModule(new JavaTimeModule())
        .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException {

        ErrorModel error = new ErrorModel();
        error.setCategory("UNAUTHORIZED");
        error.setMessage("You must be logged in to access this resource");
        error.setFieldPath(request.getRequestURI());
        ResponseErrorModel responseError = new ResponseErrorModel(OffsetDateTime.now(), List.of(error));

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write(mapper.writeValueAsString(responseError));
    }
}
