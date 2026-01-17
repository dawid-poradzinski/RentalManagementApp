package com.dawid.poradzinski.school.ski_rent_app.controller;

import com.dawid.poradzinski.school.ski_rent_app.service.AuthService;

import org.openapitools.model.RequestLogin;
import org.openapitools.model.RequestRegister;
import org.openapitools.model.ResponseAuth;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("v1/api")
public class AuthController {

    private final AuthService authService;

    AuthController(AuthService authService) {
        this.authService = authService;
    }
    
    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody RequestRegister body) {
        ResponseAuth auth = authService.register(body);
        ResponseCookie cookie = ResponseCookie.from("jwt", auth.getJwt())
            .httpOnly(true)
            .secure(true)
            .sameSite("Lax")
            .path("/")
            .maxAge(7 * 24 * 60 * 60)
            .build();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).build();
    }

    @PostMapping("/login")
    public ResponseEntity<Void> login(@RequestBody RequestLogin body) {
        ResponseAuth auth = authService.login(body);
        ResponseCookie cookie = ResponseCookie.from("jwt", auth.getJwt())
            .httpOnly(true)
            .secure(true)
            .sameSite("Lax")
            .path("/")
            .maxAge(7 * 24 * 60 * 60)
            .build();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).build();
    }
    
}
