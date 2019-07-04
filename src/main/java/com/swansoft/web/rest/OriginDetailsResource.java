package com.swansoft.web.rest;

import com.swansoft.domain.OriginDetails;
import com.swansoft.repository.OriginDetailsRepository;
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
 * REST controller for managing {@link com.swansoft.domain.OriginDetails}.
 */
@RestController
@RequestMapping("/api")
public class OriginDetailsResource {

    private final Logger log = LoggerFactory.getLogger(OriginDetailsResource.class);

    private static final String ENTITY_NAME = "originDetails";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OriginDetailsRepository originDetailsRepository;

    public OriginDetailsResource(OriginDetailsRepository originDetailsRepository) {
        this.originDetailsRepository = originDetailsRepository;
    }

    /**
     * {@code POST  /origin-details} : Create a new originDetails.
     *
     * @param originDetails the originDetails to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new originDetails, or with status {@code 400 (Bad Request)} if the originDetails has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/origin-details")
    public ResponseEntity<OriginDetails> createOriginDetails(@RequestBody OriginDetails originDetails) throws URISyntaxException {
        log.debug("REST request to save OriginDetails : {}", originDetails);
        if (originDetails.getId() != null) {
            throw new BadRequestAlertException("A new originDetails cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OriginDetails result = originDetailsRepository.save(originDetails);
        return ResponseEntity.created(new URI("/api/origin-details/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /origin-details} : Updates an existing originDetails.
     *
     * @param originDetails the originDetails to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated originDetails,
     * or with status {@code 400 (Bad Request)} if the originDetails is not valid,
     * or with status {@code 500 (Internal Server Error)} if the originDetails couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/origin-details")
    public ResponseEntity<OriginDetails> updateOriginDetails(@RequestBody OriginDetails originDetails) throws URISyntaxException {
        log.debug("REST request to update OriginDetails : {}", originDetails);
        if (originDetails.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        OriginDetails result = originDetailsRepository.save(originDetails);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, originDetails.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /origin-details} : get all the originDetails.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of originDetails in body.
     */
    @GetMapping("/origin-details")
    public List<OriginDetails> getAllOriginDetails(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all OriginDetails");
        return originDetailsRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /origin-details/:id} : get the "id" originDetails.
     *
     * @param id the id of the originDetails to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the originDetails, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/origin-details/{id}")
    public ResponseEntity<OriginDetails> getOriginDetails(@PathVariable Long id) {
        log.debug("REST request to get OriginDetails : {}", id);
        Optional<OriginDetails> originDetails = originDetailsRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(originDetails);
    }

    /**
     * {@code DELETE  /origin-details/:id} : delete the "id" originDetails.
     *
     * @param id the id of the originDetails to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/origin-details/{id}")
    public ResponseEntity<Void> deleteOriginDetails(@PathVariable Long id) {
        log.debug("REST request to delete OriginDetails : {}", id);
        originDetailsRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
