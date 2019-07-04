package com.swansoft.web.rest;

import com.swansoft.domain.PCCommentThread;
import com.swansoft.repository.PCCommentThreadRepository;
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
 * REST controller for managing {@link com.swansoft.domain.PCCommentThread}.
 */
@RestController
@RequestMapping("/api")
public class PCCommentThreadResource {

    private final Logger log = LoggerFactory.getLogger(PCCommentThreadResource.class);

    private static final String ENTITY_NAME = "pCCommentThread";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PCCommentThreadRepository pCCommentThreadRepository;

    public PCCommentThreadResource(PCCommentThreadRepository pCCommentThreadRepository) {
        this.pCCommentThreadRepository = pCCommentThreadRepository;
    }

    /**
     * {@code POST  /pc-comment-threads} : Create a new pCCommentThread.
     *
     * @param pCCommentThread the pCCommentThread to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new pCCommentThread, or with status {@code 400 (Bad Request)} if the pCCommentThread has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/pc-comment-threads")
    public ResponseEntity<PCCommentThread> createPCCommentThread(@RequestBody PCCommentThread pCCommentThread) throws URISyntaxException {
        log.debug("REST request to save PCCommentThread : {}", pCCommentThread);
        if (pCCommentThread.getId() != null) {
            throw new BadRequestAlertException("A new pCCommentThread cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PCCommentThread result = pCCommentThreadRepository.save(pCCommentThread);
        return ResponseEntity.created(new URI("/api/pc-comment-threads/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /pc-comment-threads} : Updates an existing pCCommentThread.
     *
     * @param pCCommentThread the pCCommentThread to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pCCommentThread,
     * or with status {@code 400 (Bad Request)} if the pCCommentThread is not valid,
     * or with status {@code 500 (Internal Server Error)} if the pCCommentThread couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/pc-comment-threads")
    public ResponseEntity<PCCommentThread> updatePCCommentThread(@RequestBody PCCommentThread pCCommentThread) throws URISyntaxException {
        log.debug("REST request to update PCCommentThread : {}", pCCommentThread);
        if (pCCommentThread.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        PCCommentThread result = pCCommentThreadRepository.save(pCCommentThread);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, pCCommentThread.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /pc-comment-threads} : get all the pCCommentThreads.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of pCCommentThreads in body.
     */
    @GetMapping("/pc-comment-threads")
    public List<PCCommentThread> getAllPCCommentThreads() {
        log.debug("REST request to get all PCCommentThreads");
        return pCCommentThreadRepository.findAll();
    }

    /**
     * {@code GET  /pc-comment-threads/:id} : get the "id" pCCommentThread.
     *
     * @param id the id of the pCCommentThread to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the pCCommentThread, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/pc-comment-threads/{id}")
    public ResponseEntity<PCCommentThread> getPCCommentThread(@PathVariable Long id) {
        log.debug("REST request to get PCCommentThread : {}", id);
        Optional<PCCommentThread> pCCommentThread = pCCommentThreadRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(pCCommentThread);
    }

    /**
     * {@code DELETE  /pc-comment-threads/:id} : delete the "id" pCCommentThread.
     *
     * @param id the id of the pCCommentThread to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/pc-comment-threads/{id}")
    public ResponseEntity<Void> deletePCCommentThread(@PathVariable Long id) {
        log.debug("REST request to delete PCCommentThread : {}", id);
        pCCommentThreadRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
