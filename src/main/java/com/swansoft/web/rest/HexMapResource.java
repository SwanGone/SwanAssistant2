package com.swansoft.web.rest;

import com.swansoft.domain.HexMap;
import com.swansoft.repository.HexMapRepository;
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
 * REST controller for managing {@link com.swansoft.domain.HexMap}.
 */
@RestController
@RequestMapping("/api")
public class HexMapResource {

    private final Logger log = LoggerFactory.getLogger(HexMapResource.class);

    private static final String ENTITY_NAME = "hexMap";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HexMapRepository hexMapRepository;

    public HexMapResource(HexMapRepository hexMapRepository) {
        this.hexMapRepository = hexMapRepository;
    }

    /**
     * {@code POST  /hex-maps} : Create a new hexMap.
     *
     * @param hexMap the hexMap to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new hexMap, or with status {@code 400 (Bad Request)} if the hexMap has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/hex-maps")
    public ResponseEntity<HexMap> createHexMap(@RequestBody HexMap hexMap) throws URISyntaxException {
        log.debug("REST request to save HexMap : {}", hexMap);
        if (hexMap.getId() != null) {
            throw new BadRequestAlertException("A new hexMap cannot already have an ID", ENTITY_NAME, "idexists");
        }
        HexMap result = hexMapRepository.save(hexMap);
        return ResponseEntity.created(new URI("/api/hex-maps/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /hex-maps} : Updates an existing hexMap.
     *
     * @param hexMap the hexMap to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated hexMap,
     * or with status {@code 400 (Bad Request)} if the hexMap is not valid,
     * or with status {@code 500 (Internal Server Error)} if the hexMap couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/hex-maps")
    public ResponseEntity<HexMap> updateHexMap(@RequestBody HexMap hexMap) throws URISyntaxException {
        log.debug("REST request to update HexMap : {}", hexMap);
        if (hexMap.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        HexMap result = hexMapRepository.save(hexMap);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, hexMap.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /hex-maps} : get all the hexMaps.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of hexMaps in body.
     */
    @GetMapping("/hex-maps")
    public List<HexMap> getAllHexMaps() {
        log.debug("REST request to get all HexMaps");
        return hexMapRepository.findAll();
    }

    /**
     * {@code GET  /hex-maps/:id} : get the "id" hexMap.
     *
     * @param id the id of the hexMap to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the hexMap, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/hex-maps/{id}")
    public ResponseEntity<HexMap> getHexMap(@PathVariable Long id) {
        log.debug("REST request to get HexMap : {}", id);
        Optional<HexMap> hexMap = hexMapRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(hexMap);
    }

    /**
     * {@code DELETE  /hex-maps/:id} : delete the "id" hexMap.
     *
     * @param id the id of the hexMap to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/hex-maps/{id}")
    public ResponseEntity<Void> deleteHexMap(@PathVariable Long id) {
        log.debug("REST request to delete HexMap : {}", id);
        hexMapRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
