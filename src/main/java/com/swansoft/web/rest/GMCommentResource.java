package com.swansoft.web.rest;

import com.swansoft.domain.GMComment;
import com.swansoft.repository.GMCommentRepository;
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
 * REST controller for managing {@link com.swansoft.domain.GMComment}.
 */
@RestController
@RequestMapping("/api")
public class GMCommentResource {

    private final Logger log = LoggerFactory.getLogger(GMCommentResource.class);

    private static final String ENTITY_NAME = "gMComment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GMCommentRepository gMCommentRepository;

    public GMCommentResource(GMCommentRepository gMCommentRepository) {
        this.gMCommentRepository = gMCommentRepository;
    }

    /**
     * {@code POST  /gm-comments} : Create a new gMComment.
     *
     * @param gMComment the gMComment to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new gMComment, or with status {@code 400 (Bad Request)} if the gMComment has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/gm-comments")
    public ResponseEntity<GMComment> createGMComment(@RequestBody GMComment gMComment) throws URISyntaxException {
        log.debug("REST request to save GMComment : {}", gMComment);
        if (gMComment.getId() != null) {
            throw new BadRequestAlertException("A new gMComment cannot already have an ID", ENTITY_NAME, "idexists");
        }
        GMComment result = gMCommentRepository.save(gMComment);
        return ResponseEntity.created(new URI("/api/gm-comments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /gm-comments} : Updates an existing gMComment.
     *
     * @param gMComment the gMComment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated gMComment,
     * or with status {@code 400 (Bad Request)} if the gMComment is not valid,
     * or with status {@code 500 (Internal Server Error)} if the gMComment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/gm-comments")
    public ResponseEntity<GMComment> updateGMComment(@RequestBody GMComment gMComment) throws URISyntaxException {
        log.debug("REST request to update GMComment : {}", gMComment);
        if (gMComment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        GMComment result = gMCommentRepository.save(gMComment);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, gMComment.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /gm-comments} : get all the gMComments.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of gMComments in body.
     */
    @GetMapping("/gm-comments")
    public List<GMComment> getAllGMComments() {
        log.debug("REST request to get all GMComments");
        return gMCommentRepository.findAll();
    }

    /**
     * {@code GET  /gm-comments/:id} : get the "id" gMComment.
     *
     * @param id the id of the gMComment to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the gMComment, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/gm-comments/{id}")
    public ResponseEntity<GMComment> getGMComment(@PathVariable Long id) {
        log.debug("REST request to get GMComment : {}", id);
        Optional<GMComment> gMComment = gMCommentRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(gMComment);
    }

    /**
     * {@code DELETE  /gm-comments/:id} : delete the "id" gMComment.
     *
     * @param id the id of the gMComment to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/gm-comments/{id}")
    public ResponseEntity<Void> deleteGMComment(@PathVariable Long id) {
        log.debug("REST request to delete GMComment : {}", id);
        gMCommentRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
