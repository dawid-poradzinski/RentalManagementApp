package com.dawid.poradzinski.school.ski_rent_app.service;

import java.time.OffsetDateTime;
import java.util.Optional;

import org.openapitools.model.PersonEntity;
import org.openapitools.model.RequestLogin;
import org.openapitools.model.RequestRegister;
import org.openapitools.model.ResponseAuth;
import org.openapitools.model.ResponseAuthMe;
import org.springframework.stereotype.Service;

import com.dawid.poradzinski.school.ski_rent_app.addons.exceptions.UserNotFoundException;
import com.dawid.poradzinski.school.ski_rent_app.addons.mapper.PersonMapper;
import com.dawid.poradzinski.school.ski_rent_app.configs.security.EncryptionService;
import com.dawid.poradzinski.school.ski_rent_app.configs.security.JWTService;
import com.dawid.poradzinski.school.ski_rent_app.repository.PersonPrivateRepository;
import com.dawid.poradzinski.school.ski_rent_app.repository.PersonRepository;
import com.dawid.poradzinski.school.ski_rent_app.sql.Person;
import com.dawid.poradzinski.school.ski_rent_app.sql.PersonPrivate;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@Service
public class AuthService {

    private final JWTService JWTService;

    private final EncryptionService encryptionService;
    private final PersonRepository personRepository;
    private final PersonPrivateRepository personPrivateRepository;
    private final PersonMapper personMapper;

    AuthService(PersonRepository personRepository, PersonMapper personMapper, PersonPrivateRepository personPrivateRepository, EncryptionService encryptionService, JWTService JWTService) {
        this.personRepository = personRepository;
        this.personMapper = personMapper;
        this.personPrivateRepository = personPrivateRepository;
        this.encryptionService = encryptionService;
        this.JWTService = JWTService;
    }

    public ResponseAuthMe getPersonEntityByToken(HttpServletRequest request) {
        String token = "";
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (cookie.getName().equals("jwt")) {
                    token = cookie.getValue();
                }
            }
        }
        var person = getPersonById(JWTService.getId(token)).orElseThrow(() -> new UserNotFoundException());

        return new ResponseAuthMe()
                .timestamp(OffsetDateTime.now())
                .user(person);
    }

    public Optional<PersonEntity> getPersonById(Long id) {
        var optional = personRepository.findById(id);

        if (optional.isPresent()) {
            return Optional.of(personMapper.mapSqlPeronToPersonEntity(optional.get()));
        }

        return Optional.empty();
    }

    public ResponseAuth register(RequestRegister body) {
        if (personRepository.findByLoginOrPhone(body.getLogin(), body.getPhone()).isPresent()) {
            throw new RuntimeException("User already exist:User already exist");
        }

        Person person = personMapper.mapRequestRegisterToperson(body);

        PersonPrivate personPrivate = new PersonPrivate();
        personPrivate.setHash(encryptionService.encryptPassword(body.getPassword()));
        personPrivate.setPerson(person);

        personPrivate = personPrivateRepository.save(personPrivate);

        return new ResponseAuth()
                .jwt(JWTService.generateJWT(personMapper.mapSqlPeronToPersonEntity(personPrivate.getPerson())))
                .timestamp(OffsetDateTime.now());
    }

    public ResponseAuth login(RequestLogin body) {
        Optional<Person> optional = personRepository.findByLoginOrPhone(body.getLoginOrPhone().toLowerCase(), body.getLoginOrPhone());
        if (optional.isEmpty()) {
            throw new UserNotFoundException();
        }

        PersonPrivate personPrivate = personPrivateRepository.findByPerson(optional.get()).orElseThrow(() -> new UserNotFoundException());

        if(!encryptionService.verifyPassword(body.getPassword(), personPrivate.getHash())) {
            throw new UserNotFoundException();
        }

        return new ResponseAuth()
            .jwt(JWTService.generateJWT(personMapper.mapSqlPeronToPersonEntity(optional.get())))
            .timestamp(OffsetDateTime.now());
    }
}
