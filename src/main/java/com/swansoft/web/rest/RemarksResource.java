package com.swansoft.web.rest;

import com.swansoft.domain.Remarks;
import com.swansoft.repository.RemarksRepository;
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
 * REST controller for managing {@link com.swansoft.domain.Remarks}.
 */
@RestController
@RequestMapping("/api")
public class RemarksResource {

    private final Logger log = LoggerFactory.getLogger(RemarksResource.class);

    private static final String ENTITY_NAME = "remarks";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RemarksRepository remarksRepository;

    public RemarksResource(RemarksRepository remarksRepository) {
        this.remarksRepository = remarksRepository;
    }

    /**
     * {@code POST  /remarks} : Create a new remarks.
     *
     * @param remarks the remarks to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new remarks, or with status {@code 400 (Bad Request)} if the remarks has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/remarks")
    public ResponseEntity<Remarks> createRemarks(@RequestBody Remarks remarks) throws URISyntaxException {
        log.debug("REST request to save Remarks : {}", remarks);
        if (remarks.getId() != null) {
            throw new BadRequestAlertException("A new remarks cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Remarks result = remarksRepository.save(remarks);
        return ResponseEntity.created(new URI("/api/remarks/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /remarks} : Updates an existing remarks.
     *
     * @param remarks the remarks to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated remarks,
     * or with status {@code 400 (Bad Request)} if the remarks is not valid,
     * or with status {@code 500 (Internal Server Error)} if the remarks couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/remarks")
    public ResponseEntity<Remarks> updateRemarks(@RequestBody Remarks remarks) throws URISyntaxException {
        log.debug("REST request to update Remarks : {}", remarks);
        if (remarks.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Remarks result = remarksRepository.save(remarks);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, remarks.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /remarks} : get all the remarks.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of remarks in body.
     */
    @GetMapping("/remarks")
    public List<Remarks> getAllRemarks() {
        log.debug("REST request to get all Remarks");
        return remarksRepository.findAll();
    }

    /**
     * {@code GET  /remarks/:id} : get the "id" remarks.
     *
     * @param id the id of the remarks to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the remarks, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/remarks/{id}")
    public ResponseEntity<Remarks> getRemarks(@PathVariable Long id) {
        log.debug("REST request to get Remarks : {}", id);
        Optional<Remarks> remarks = remarksRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(remarks);
    }

    /**
     * {@code DELETE  /remarks/:id} : delete the "id" remarks.
     *
     * @param id the id of the remarks to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/remarks/{id}")
    public ResponseEntity<Void> deleteRemarks(@PathVariable Long id) {
        log.debug("REST request to delete Remarks : {}", id);
        remarksRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
