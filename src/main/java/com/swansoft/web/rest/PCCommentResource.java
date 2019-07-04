package com.swansoft.web.rest;

import com.swansoft.domain.PCComment;
import com.swansoft.repository.PCCommentRepository;
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
 * REST controller for managing {@link com.swansoft.domain.PCComment}.
 */
@RestController
@RequestMapping("/api")
public class PCCommentResource {

    private final Logger log = LoggerFactory.getLogger(PCCommentResource.class);

    private static final String ENTITY_NAME = "pCComment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PCCommentRepository pCCommentRepository;

    public PCCommentResource(PCCommentRepository pCCommentRepository) {
        this.pCCommentRepository = pCCommentRepository;
    }

    /**
     * {@code POST  /pc-comments} : Create a new pCComment.
     *
     * @param pCComment the pCComment to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new pCComment, or with status {@code 400 (Bad Request)} if the pCComment has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/pc-comments")
    public ResponseEntity<PCComment> createPCComment(@RequestBody PCComment pCComment) throws URISyntaxException {
        log.debug("REST request to save PCComment : {}", pCComment);
        if (pCComment.getId() != null) {
            throw new BadRequestAlertException("A new pCComment cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PCComment result = pCCommentRepository.save(pCComment);
        return ResponseEntity.created(new URI("/api/pc-comments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /pc-comments} : Updates an existing pCComment.
     *
     * @param pCComment the pCComment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pCComment,
     * or with status {@code 400 (Bad Request)} if the pCComment is not valid,
     * or with status {@code 500 (Internal Server Error)} if the pCComment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/pc-comments")
    public ResponseEntity<PCComment> updatePCComment(@RequestBody PCComment pCComment) throws URISyntaxException {
        log.debug("REST request to update PCComment : {}", pCComment);
        if (pCComment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        PCComment result = pCCommentRepository.save(pCComment);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, pCComment.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /pc-comments} : get all the pCComments.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of pCComments in body.
     */
    @GetMapping("/pc-comments")
    public List<PCComment> getAllPCComments() {
        log.debug("REST request to get all PCComments");
        return pCCommentRepository.findAll();
    }

    /**
     * {@code GET  /pc-comments/:id} : get the "id" pCComment.
     *
     * @param id the id of the pCComment to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the pCComment, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/pc-comments/{id}")
    public ResponseEntity<PCComment> getPCComment(@PathVariable Long id) {
        log.debug("REST request to get PCComment : {}", id);
        Optional<PCComment> pCComment = pCCommentRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(pCComment);
    }

    /**
     * {@code DELETE  /pc-comments/:id} : delete the "id" pCComment.
     *
     * @param id the id of the pCComment to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/pc-comments/{id}")
    public ResponseEntity<Void> deletePCComment(@PathVariable Long id) {
        log.debug("REST request to delete PCComment : {}", id);
        pCCommentRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
