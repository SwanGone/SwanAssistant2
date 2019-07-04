package com.swansoft.web.rest;

import com.swansoft.domain.HexSector;
import com.swansoft.repository.HexSectorRepository;
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
 * REST controller for managing {@link com.swansoft.domain.HexSector}.
 */
@RestController
@RequestMapping("/api")
public class HexSectorResource {

    private final Logger log = LoggerFactory.getLogger(HexSectorResource.class);

    private static final String ENTITY_NAME = "hexSector";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HexSectorRepository hexSectorRepository;

    public HexSectorResource(HexSectorRepository hexSectorRepository) {
        this.hexSectorRepository = hexSectorRepository;
    }

    /**
     * {@code POST  /hex-sectors} : Create a new hexSector.
     *
     * @param hexSector the hexSector to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new hexSector, or with status {@code 400 (Bad Request)} if the hexSector has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/hex-sectors")
    public ResponseEntity<HexSector> createHexSector(@RequestBody HexSector hexSector) throws URISyntaxException {
        log.debug("REST request to save HexSector : {}", hexSector);
        if (hexSector.getId() != null) {
            throw new BadRequestAlertException("A new hexSector cannot already have an ID", ENTITY_NAME, "idexists");
        }
        HexSector result = hexSectorRepository.save(hexSector);
        return ResponseEntity.created(new URI("/api/hex-sectors/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /hex-sectors} : Updates an existing hexSector.
     *
     * @param hexSector the hexSector to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated hexSector,
     * or with status {@code 400 (Bad Request)} if the hexSector is not valid,
     * or with status {@code 500 (Internal Server Error)} if the hexSector couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/hex-sectors")
    public ResponseEntity<HexSector> updateHexSector(@RequestBody HexSector hexSector) throws URISyntaxException {
        log.debug("REST request to update HexSector : {}", hexSector);
        if (hexSector.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        HexSector result = hexSectorRepository.save(hexSector);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, hexSector.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /hex-sectors} : get all the hexSectors.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of hexSectors in body.
     */
    @GetMapping("/hex-sectors")
    public List<HexSector> getAllHexSectors() {
        log.debug("REST request to get all HexSectors");
        return hexSectorRepository.findAll();
    }

    /**
     * {@code GET  /hex-sectors/:id} : get the "id" hexSector.
     *
     * @param id the id of the hexSector to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the hexSector, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/hex-sectors/{id}")
    public ResponseEntity<HexSector> getHexSector(@PathVariable Long id) {
        log.debug("REST request to get HexSector : {}", id);
        Optional<HexSector> hexSector = hexSectorRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(hexSector);
    }

    /**
     * {@code DELETE  /hex-sectors/:id} : delete the "id" hexSector.
     *
     * @param id the id of the hexSector to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/hex-sectors/{id}")
    public ResponseEntity<Void> deleteHexSector(@PathVariable Long id) {
        log.debug("REST request to delete HexSector : {}", id);
        hexSectorRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
