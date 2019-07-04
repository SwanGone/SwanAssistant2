package com.swansoft.web.rest;

import com.swansoft.domain.Backstory;
import com.swansoft.repository.BackstoryRepository;
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
 * REST controller for managing {@link com.swansoft.domain.Backstory}.
 */
@RestController
@RequestMapping("/api")
public class BackstoryResource {

    private final Logger log = LoggerFactory.getLogger(BackstoryResource.class);

    private static final String ENTITY_NAME = "backstory";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BackstoryRepository backstoryRepository;

    public BackstoryResource(BackstoryRepository backstoryRepository) {
        this.backstoryRepository = backstoryRepository;
    }

    /**
     * {@code POST  /backstories} : Create a new backstory.
     *
     * @param backstory the backstory to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new backstory, or with status {@code 400 (Bad Request)} if the backstory has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/backstories")
    public ResponseEntity<Backstory> createBackstory(@RequestBody Backstory backstory) throws URISyntaxException {
        log.debug("REST request to save Backstory : {}", backstory);
        if (backstory.getId() != null) {
            throw new BadRequestAlertException("A new backstory cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Backstory result = backstoryRepository.save(backstory);
        return ResponseEntity.created(new URI("/api/backstories/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /backstories} : Updates an existing backstory.
     *
     * @param backstory the backstory to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated backstory,
     * or with status {@code 400 (Bad Request)} if the backstory is not valid,
     * or with status {@code 500 (Internal Server Error)} if the backstory couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/backstories")
    public ResponseEntity<Backstory> updateBackstory(@RequestBody Backstory backstory) throws URISyntaxException {
        log.debug("REST request to update Backstory : {}", backstory);
        if (backstory.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Backstory result = backstoryRepository.save(backstory);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, backstory.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /backstories} : get all the backstories.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of backstories in body.
     */
    @GetMapping("/backstories")
    public List<Backstory> getAllBackstories() {
        log.debug("REST request to get all Backstories");
        return backstoryRepository.findAll();
    }

    /**
     * {@code GET  /backstories/:id} : get the "id" backstory.
     *
     * @param id the id of the backstory to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the backstory, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/backstories/{id}")
    public ResponseEntity<Backstory> getBackstory(@PathVariable Long id) {
        log.debug("REST request to get Backstory : {}", id);
        Optional<Backstory> backstory = backstoryRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(backstory);
    }

    /**
     * {@code DELETE  /backstories/:id} : delete the "id" backstory.
     *
     * @param id the id of the backstory to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/backstories/{id}")
    public ResponseEntity<Void> deleteBackstory(@PathVariable Long id) {
        log.debug("REST request to delete Backstory : {}", id);
        backstoryRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
