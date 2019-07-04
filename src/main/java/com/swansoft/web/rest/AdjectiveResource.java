package com.swansoft.web.rest;

import com.swansoft.domain.Adjective;
import com.swansoft.repository.AdjectiveRepository;
import com.swansoft.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.swansoft.domain.Adjective}.
 */
@RestController
@RequestMapping("/api")
public class AdjectiveResource {

    private final Logger log = LoggerFactory.getLogger(AdjectiveResource.class);

    private static final String ENTITY_NAME = "adjective";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AdjectiveRepository adjectiveRepository;

    public AdjectiveResource(AdjectiveRepository adjectiveRepository) {
        this.adjectiveRepository = adjectiveRepository;
    }

    /**
     * {@code POST  /adjectives} : Create a new adjective.
     *
     * @param adjective the adjective to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new adjective, or with status {@code 400 (Bad Request)} if the adjective has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/adjectives")
    public ResponseEntity<Adjective> createAdjective(@RequestBody Adjective adjective) throws URISyntaxException {
        log.debug("REST request to save Adjective : {}", adjective);
        if (adjective.getId() != null) {
            throw new BadRequestAlertException("A new adjective cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Adjective result = adjectiveRepository.save(adjective);
        return ResponseEntity.created(new URI("/api/adjectives/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /adjectives} : Updates an existing adjective.
     *
     * @param adjective the adjective to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated adjective,
     * or with status {@code 400 (Bad Request)} if the adjective is not valid,
     * or with status {@code 500 (Internal Server Error)} if the adjective couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/adjectives")
    public ResponseEntity<Adjective> updateAdjective(@RequestBody Adjective adjective) throws URISyntaxException {
        log.debug("REST request to update Adjective : {}", adjective);
        if (adjective.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Adjective result = adjectiveRepository.save(adjective);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, adjective.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /adjectives} : get all the adjectives.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of adjectives in body.
     */
    @GetMapping("/adjectives")
    public List<Adjective> getAllAdjectives(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Adjectives");
        return adjectiveRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /adjectives/:id} : get the "id" adjective.
     *
     * @param id the id of the adjective to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the adjective, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/adjectives/{id}")
    public ResponseEntity<Adjective> getAdjective(@PathVariable Long id) {
        log.debug("REST request to get Adjective : {}", id);
        Optional<Adjective> adjective = adjectiveRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(adjective);
    }

    /**
     * {@code DELETE  /adjectives/:id} : delete the "id" adjective.
     *
     * @param id the id of the adjective to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/adjectives/{id}")
    public ResponseEntity<Void> deleteAdjective(@PathVariable Long id) {
        log.debug("REST request to delete Adjective : {}", id);
        adjectiveRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
