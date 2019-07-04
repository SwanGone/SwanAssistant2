package com.swansoft.web.rest;

import com.swansoft.domain.Occupation;
import com.swansoft.repository.OccupationRepository;
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
 * REST controller for managing {@link com.swansoft.domain.Occupation}.
 */
@RestController
@RequestMapping("/api")
public class OccupationResource {

    private final Logger log = LoggerFactory.getLogger(OccupationResource.class);

    private static final String ENTITY_NAME = "occupation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OccupationRepository occupationRepository;

    public OccupationResource(OccupationRepository occupationRepository) {
        this.occupationRepository = occupationRepository;
    }

    /**
     * {@code POST  /occupations} : Create a new occupation.
     *
     * @param occupation the occupation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new occupation, or with status {@code 400 (Bad Request)} if the occupation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/occupations")
    public ResponseEntity<Occupation> createOccupation(@RequestBody Occupation occupation) throws URISyntaxException {
        log.debug("REST request to save Occupation : {}", occupation);
        if (occupation.getId() != null) {
            throw new BadRequestAlertException("A new occupation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Occupation result = occupationRepository.save(occupation);
        return ResponseEntity.created(new URI("/api/occupations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /occupations} : Updates an existing occupation.
     *
     * @param occupation the occupation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated occupation,
     * or with status {@code 400 (Bad Request)} if the occupation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the occupation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/occupations")
    public ResponseEntity<Occupation> updateOccupation(@RequestBody Occupation occupation) throws URISyntaxException {
        log.debug("REST request to update Occupation : {}", occupation);
        if (occupation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Occupation result = occupationRepository.save(occupation);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, occupation.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /occupations} : get all the occupations.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of occupations in body.
     */
    @GetMapping("/occupations")
    public List<Occupation> getAllOccupations(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Occupations");
        return occupationRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /occupations/:id} : get the "id" occupation.
     *
     * @param id the id of the occupation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the occupation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/occupations/{id}")
    public ResponseEntity<Occupation> getOccupation(@PathVariable Long id) {
        log.debug("REST request to get Occupation : {}", id);
        Optional<Occupation> occupation = occupationRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(occupation);
    }

    /**
     * {@code DELETE  /occupations/:id} : delete the "id" occupation.
     *
     * @param id the id of the occupation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/occupations/{id}")
    public ResponseEntity<Void> deleteOccupation(@PathVariable Long id) {
        log.debug("REST request to delete Occupation : {}", id);
        occupationRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
