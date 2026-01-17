package com.dawid.poradzinski.school.ski_rent_app.configs.security;

import java.util.Date;

import org.openapitools.model.PersonEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

import jakarta.annotation.PostConstruct;


@Service
public class JWTService {
    
    @Value("${jwt.algorithm.key}")
    private String algorithmKey;

    @Value("${jwt.issuer}")
    private String issuer;

    @Value("${jwt.expiryInSeconds}")
    private int expiryInSeconds;

    private Algorithm algorithm;
    private static final String USER_ID = "USER_ID";

    @PostConstruct
    public void postConstruct() {
        algorithm = Algorithm.HMAC512(algorithmKey);
    }
    public String generateJWT(PersonEntity personEntity) {
        return JWT.create()
        .withClaim(USER_ID, personEntity.getId())
        .withExpiresAt(new Date(System.currentTimeMillis() + (1000 * expiryInSeconds)))
        .withIssuer(issuer)
        .sign(algorithm);
    }

    public Long getId(String token) {
        return JWT.decode(token).getClaim(USER_ID).asLong();
    }
}
