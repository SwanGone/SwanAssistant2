package com.swansoft.web.rest;

import com.swansoft.domain.PlaceOfInterest;
import com.swansoft.repository.PlaceOfInterestRepository;
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
 * REST controller for managing {@link com.swansoft.domain.PlaceOfInterest}.
 */
@RestController
@RequestMapping("/api")
public class PlaceOfInterestResource {

    private final Logger log = LoggerFactory.getLogger(PlaceOfInterestResource.class);

    private static final String ENTITY_NAME = "placeOfInterest";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PlaceOfInterestRepository placeOfInterestRepository;

    public PlaceOfInterestResource(PlaceOfInterestRepository placeOfInterestRepository) {
        this.placeOfInterestRepository = placeOfInterestRepository;
    }

    /**
     * {@code POST  /place-of-interests} : Create a new placeOfInterest.
     *
     * @param placeOfInterest the placeOfInterest to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new placeOfInterest, or with status {@code 400 (Bad Request)} if the placeOfInterest has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/place-of-interests")
    public ResponseEntity<PlaceOfInterest> createPlaceOfInterest(@RequestBody PlaceOfInterest placeOfInterest) throws URISyntaxException {
        log.debug("REST request to save PlaceOfInterest : {}", placeOfInterest);
        if (placeOfInterest.getId() != null) {
            throw new BadRequestAlertException("A new placeOfInterest cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PlaceOfInterest result = placeOfInterestRepository.save(placeOfInterest);
        return ResponseEntity.created(new URI("/api/place-of-interests/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /place-of-interests} : Updates an existing placeOfInterest.
     *
     * @param placeOfInterest the placeOfInterest to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated placeOfInterest,
     * or with status {@code 400 (Bad Request)} if the placeOfInterest is not valid,
     * or with status {@code 500 (Internal Server Error)} if the placeOfInterest couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/place-of-interests")
    public ResponseEntity<PlaceOfInterest> updatePlaceOfInterest(@RequestBody PlaceOfInterest placeOfInterest) throws URISyntaxException {
        log.debug("REST request to update PlaceOfInterest : {}", placeOfInterest);
        if (placeOfInterest.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        PlaceOfInterest result = placeOfInterestRepository.save(placeOfInterest);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, placeOfInterest.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /place-of-interests} : get all the placeOfInterests.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of placeOfInterests in body.
     */
    @GetMapping("/place-of-interests")
    public List<PlaceOfInterest> getAllPlaceOfInterests() {
        log.debug("REST request to get all PlaceOfInterests");
        return placeOfInterestRepository.findAll();
    }

    /**
     * {@code GET  /place-of-interests/:id} : get the "id" placeOfInterest.
     *
     * @param id the id of the placeOfInterest to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the placeOfInterest, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/place-of-interests/{id}")
    public ResponseEntity<PlaceOfInterest> getPlaceOfInterest(@PathVariable Long id) {
        log.debug("REST request to get PlaceOfInterest : {}", id);
        Optional<PlaceOfInterest> placeOfInterest = placeOfInterestRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(placeOfInterest);
    }

    /**
     * {@code DELETE  /place-of-interests/:id} : delete the "id" placeOfInterest.
     *
     * @param id the id of the placeOfInterest to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/place-of-interests/{id}")
    public ResponseEntity<Void> deletePlaceOfInterest(@PathVariable Long id) {
        log.debug("REST request to delete PlaceOfInterest : {}", id);
        placeOfInterestRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
