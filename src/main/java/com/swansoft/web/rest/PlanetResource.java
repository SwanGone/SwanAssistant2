package com.swansoft.web.rest;

import com.swansoft.domain.Planet;
import com.swansoft.repository.PlanetRepository;
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
 * REST controller for managing {@link com.swansoft.domain.Planet}.
 */
@RestController
@RequestMapping("/api")
public class PlanetResource {

    private final Logger log = LoggerFactory.getLogger(PlanetResource.class);

    private static final String ENTITY_NAME = "planet";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PlanetRepository planetRepository;

    public PlanetResource(PlanetRepository planetRepository) {
        this.planetRepository = planetRepository;
    }

    /**
     * {@code POST  /planets} : Create a new planet.
     *
     * @param planet the planet to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new planet, or with status {@code 400 (Bad Request)} if the planet has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/planets")
    public ResponseEntity<Planet> createPlanet(@RequestBody Planet planet) throws URISyntaxException {
        log.debug("REST request to save Planet : {}", planet);
        if (planet.getId() != null) {
            throw new BadRequestAlertException("A new planet cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Planet result = planetRepository.save(planet);
        return ResponseEntity.created(new URI("/api/planets/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /planets} : Updates an existing planet.
     *
     * @param planet the planet to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated planet,
     * or with status {@code 400 (Bad Request)} if the planet is not valid,
     * or with status {@code 500 (Internal Server Error)} if the planet couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/planets")
    public ResponseEntity<Planet> updatePlanet(@RequestBody Planet planet) throws URISyntaxException {
        log.debug("REST request to update Planet : {}", planet);
        if (planet.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Planet result = planetRepository.save(planet);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, planet.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /planets} : get all the planets.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of planets in body.
     */
    @GetMapping("/planets")
    public List<Planet> getAllPlanets(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Planets");
        return planetRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /planets/:id} : get the "id" planet.
     *
     * @param id the id of the planet to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the planet, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/planets/{id}")
    public ResponseEntity<Planet> getPlanet(@PathVariable Long id) {
        log.debug("REST request to get Planet : {}", id);
        Optional<Planet> planet = planetRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(planet);
    }

    /**
     * {@code DELETE  /planets/:id} : delete the "id" planet.
     *
     * @param id the id of the planet to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/planets/{id}")
    public ResponseEntity<Void> deletePlanet(@PathVariable Long id) {
        log.debug("REST request to delete Planet : {}", id);
        planetRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
