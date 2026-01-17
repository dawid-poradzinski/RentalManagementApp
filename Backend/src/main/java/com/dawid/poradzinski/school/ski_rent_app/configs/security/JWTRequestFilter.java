package com.dawid.poradzinski.school.ski_rent_app.configs.security;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.openapitools.model.PersonEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.auth0.jwt.exceptions.JWTDecodeException;
import com.dawid.poradzinski.school.ski_rent_app.service.AuthService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JWTRequestFilter extends OncePerRequestFilter{
    private JWTService jwtService;
    private AuthService authService;
    
    JWTRequestFilter(JWTService jwtService, AuthService authService) {
        this.jwtService = jwtService;
        this.authService = authService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        String token = "";

        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (cookie.getName().equals("jwt")) {
                    token = cookie.getValue();
                }
            }
        }

        if (token.length() != 0) {

            try {
                Long id = jwtService.getId(token);
                Optional<PersonEntity> optional = authService.getPersonById(id);
                if (optional.isPresent()) {
                    PersonEntity personEntity = optional.get();
                    String rank = personEntity.getRank().name();
                    List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + rank));
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(personEntity, null, authorities);
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (JWTDecodeException e) {
                throw new RuntimeException("Error reading cookie:Cookie readout finished in error");
            }
        }

        filterChain.doFilter(request, response);
    }
}
