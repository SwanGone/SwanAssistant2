package com.swansoft.web.rest;

import com.swansoft.domain.Species;
import com.swansoft.repository.SpeciesRepository;
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
 * REST controller for managing {@link com.swansoft.domain.Species}.
 */
@RestController
@RequestMapping("/api")
public class SpeciesResource {

    private final Logger log = LoggerFactory.getLogger(SpeciesResource.class);

    private static final String ENTITY_NAME = "species";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SpeciesRepository speciesRepository;

    public SpeciesResource(SpeciesRepository speciesRepository) {
        this.speciesRepository = speciesRepository;
    }

    /**
     * {@code POST  /species} : Create a new species.
     *
     * @param species the species to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new species, or with status {@code 400 (Bad Request)} if the species has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/species")
    public ResponseEntity<Species> createSpecies(@RequestBody Species species) throws URISyntaxException {
        log.debug("REST request to save Species : {}", species);
        if (species.getId() != null) {
            throw new BadRequestAlertException("A new species cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Species result = speciesRepository.save(species);
        return ResponseEntity.created(new URI("/api/species/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /species} : Updates an existing species.
     *
     * @param species the species to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated species,
     * or with status {@code 400 (Bad Request)} if the species is not valid,
     * or with status {@code 500 (Internal Server Error)} if the species couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/species")
    public ResponseEntity<Species> updateSpecies(@RequestBody Species species) throws URISyntaxException {
        log.debug("REST request to update Species : {}", species);
        if (species.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Species result = speciesRepository.save(species);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, species.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /species} : get all the species.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of species in body.
     */
    @GetMapping("/species")
    public List<Species> getAllSpecies(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Species");
        return speciesRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /species/:id} : get the "id" species.
     *
     * @param id the id of the species to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the species, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/species/{id}")
    public ResponseEntity<Species> getSpecies(@PathVariable Long id) {
        log.debug("REST request to get Species : {}", id);
        Optional<Species> species = speciesRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(species);
    }

    /**
     * {@code DELETE  /species/:id} : delete the "id" species.
     *
     * @param id the id of the species to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/species/{id}")
    public ResponseEntity<Void> deleteSpecies(@PathVariable Long id) {
        log.debug("REST request to delete Species : {}", id);
        speciesRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
