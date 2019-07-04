package com.swansoft.web.rest;

import com.swansoft.Swanassistant2App;
import com.swansoft.domain.GMComment;
import com.swansoft.repository.GMCommentRepository;
import com.swansoft.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static com.swansoft.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@Link GMCommentResource} REST controller.
 */
@SpringBootTest(classes = Swanassistant2App.class)
public class GMCommentResourceIT {

    private static final String DEFAULT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE_ADDED = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_ADDED = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    @Autowired
    private GMCommentRepository gMCommentRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restGMCommentMockMvc;

    private GMComment gMComment;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final GMCommentResource gMCommentResource = new GMCommentResource(gMCommentRepository);
        this.restGMCommentMockMvc = MockMvcBuilders.standaloneSetup(gMCommentResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GMComment createEntity(EntityManager em) {
        GMComment gMComment = new GMComment()
            .content(DEFAULT_CONTENT)
            .dateAdded(DEFAULT_DATE_ADDED);
        return gMComment;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GMComment createUpdatedEntity(EntityManager em) {
        GMComment gMComment = new GMComment()
            .content(UPDATED_CONTENT)
            .dateAdded(UPDATED_DATE_ADDED);
        return gMComment;
    }

    @BeforeEach
    public void initTest() {
        gMComment = createEntity(em);
    }

    @Test
    @Transactional
    public void createGMComment() throws Exception {
        int databaseSizeBeforeCreate = gMCommentRepository.findAll().size();

        // Create the GMComment
        restGMCommentMockMvc.perform(post("/api/gm-comments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(gMComment)))
            .andExpect(status().isCreated());

        // Validate the GMComment in the database
        List<GMComment> gMCommentList = gMCommentRepository.findAll();
        assertThat(gMCommentList).hasSize(databaseSizeBeforeCreate + 1);
        GMComment testGMComment = gMCommentList.get(gMCommentList.size() - 1);
        assertThat(testGMComment.getContent()).isEqualTo(DEFAULT_CONTENT);
        assertThat(testGMComment.getDateAdded()).isEqualTo(DEFAULT_DATE_ADDED);
    }

    @Test
    @Transactional
    public void createGMCommentWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = gMCommentRepository.findAll().size();

        // Create the GMComment with an existing ID
        gMComment.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restGMCommentMockMvc.perform(post("/api/gm-comments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(gMComment)))
            .andExpect(status().isBadRequest());

        // Validate the GMComment in the database
        List<GMComment> gMCommentList = gMCommentRepository.findAll();
        assertThat(gMCommentList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllGMComments() throws Exception {
        // Initialize the database
        gMCommentRepository.saveAndFlush(gMComment);

        // Get all the gMCommentList
        restGMCommentMockMvc.perform(get("/api/gm-comments?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(gMComment.getId().intValue())))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT.toString())))
            .andExpect(jsonPath("$.[*].dateAdded").value(hasItem(DEFAULT_DATE_ADDED.toString())));
    }
    
    @Test
    @Transactional
    public void getGMComment() throws Exception {
        // Initialize the database
        gMCommentRepository.saveAndFlush(gMComment);

        // Get the gMComment
        restGMCommentMockMvc.perform(get("/api/gm-comments/{id}", gMComment.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(gMComment.getId().intValue()))
            .andExpect(jsonPath("$.content").value(DEFAULT_CONTENT.toString()))
            .andExpect(jsonPath("$.dateAdded").value(DEFAULT_DATE_ADDED.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingGMComment() throws Exception {
        // Get the gMComment
        restGMCommentMockMvc.perform(get("/api/gm-comments/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateGMComment() throws Exception {
        // Initialize the database
        gMCommentRepository.saveAndFlush(gMComment);

        int databaseSizeBeforeUpdate = gMCommentRepository.findAll().size();

        // Update the gMComment
        GMComment updatedGMComment = gMCommentRepository.findById(gMComment.getId()).get();
        // Disconnect from session so that the updates on updatedGMComment are not directly saved in db
        em.detach(updatedGMComment);
        updatedGMComment
            .content(UPDATED_CONTENT)
            .dateAdded(UPDATED_DATE_ADDED);

        restGMCommentMockMvc.perform(put("/api/gm-comments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedGMComment)))
            .andExpect(status().isOk());

        // Validate the GMComment in the database
        List<GMComment> gMCommentList = gMCommentRepository.findAll();
        assertThat(gMCommentList).hasSize(databaseSizeBeforeUpdate);
        GMComment testGMComment = gMCommentList.get(gMCommentList.size() - 1);
        assertThat(testGMComment.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testGMComment.getDateAdded()).isEqualTo(UPDATED_DATE_ADDED);
    }

    @Test
    @Transactional
    public void updateNonExistingGMComment() throws Exception {
        int databaseSizeBeforeUpdate = gMCommentRepository.findAll().size();

        // Create the GMComment

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGMCommentMockMvc.perform(put("/api/gm-comments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(gMComment)))
            .andExpect(status().isBadRequest());

        // Validate the GMComment in the database
        List<GMComment> gMCommentList = gMCommentRepository.findAll();
        assertThat(gMCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteGMComment() throws Exception {
        // Initialize the database
        gMCommentRepository.saveAndFlush(gMComment);

        int databaseSizeBeforeDelete = gMCommentRepository.findAll().size();

        // Delete the gMComment
        restGMCommentMockMvc.perform(delete("/api/gm-comments/{id}", gMComment.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<GMComment> gMCommentList = gMCommentRepository.findAll();
        assertThat(gMCommentList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(GMComment.class);
        GMComment gMComment1 = new GMComment();
        gMComment1.setId(1L);
        GMComment gMComment2 = new GMComment();
        gMComment2.setId(gMComment1.getId());
        assertThat(gMComment1).isEqualTo(gMComment2);
        gMComment2.setId(2L);
        assertThat(gMComment1).isNotEqualTo(gMComment2);
        gMComment1.setId(null);
        assertThat(gMComment1).isNotEqualTo(gMComment2);
    }
}
