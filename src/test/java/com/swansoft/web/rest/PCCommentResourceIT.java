package com.swansoft.web.rest;

import com.swansoft.Swanassistant2App;
import com.swansoft.domain.PCComment;
import com.swansoft.repository.PCCommentRepository;
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
 * Integration tests for the {@Link PCCommentResource} REST controller.
 */
@SpringBootTest(classes = Swanassistant2App.class)
public class PCCommentResourceIT {

    private static final String DEFAULT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE_ADDED = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_ADDED = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    @Autowired
    private PCCommentRepository pCCommentRepository;

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

    private MockMvc restPCCommentMockMvc;

    private PCComment pCComment;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PCCommentResource pCCommentResource = new PCCommentResource(pCCommentRepository);
        this.restPCCommentMockMvc = MockMvcBuilders.standaloneSetup(pCCommentResource)
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
    public static PCComment createEntity(EntityManager em) {
        PCComment pCComment = new PCComment()
            .content(DEFAULT_CONTENT)
            .dateAdded(DEFAULT_DATE_ADDED);
        return pCComment;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PCComment createUpdatedEntity(EntityManager em) {
        PCComment pCComment = new PCComment()
            .content(UPDATED_CONTENT)
            .dateAdded(UPDATED_DATE_ADDED);
        return pCComment;
    }

    @BeforeEach
    public void initTest() {
        pCComment = createEntity(em);
    }

    @Test
    @Transactional
    public void createPCComment() throws Exception {
        int databaseSizeBeforeCreate = pCCommentRepository.findAll().size();

        // Create the PCComment
        restPCCommentMockMvc.perform(post("/api/pc-comments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pCComment)))
            .andExpect(status().isCreated());

        // Validate the PCComment in the database
        List<PCComment> pCCommentList = pCCommentRepository.findAll();
        assertThat(pCCommentList).hasSize(databaseSizeBeforeCreate + 1);
        PCComment testPCComment = pCCommentList.get(pCCommentList.size() - 1);
        assertThat(testPCComment.getContent()).isEqualTo(DEFAULT_CONTENT);
        assertThat(testPCComment.getDateAdded()).isEqualTo(DEFAULT_DATE_ADDED);
    }

    @Test
    @Transactional
    public void createPCCommentWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = pCCommentRepository.findAll().size();

        // Create the PCComment with an existing ID
        pCComment.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPCCommentMockMvc.perform(post("/api/pc-comments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pCComment)))
            .andExpect(status().isBadRequest());

        // Validate the PCComment in the database
        List<PCComment> pCCommentList = pCCommentRepository.findAll();
        assertThat(pCCommentList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllPCComments() throws Exception {
        // Initialize the database
        pCCommentRepository.saveAndFlush(pCComment);

        // Get all the pCCommentList
        restPCCommentMockMvc.perform(get("/api/pc-comments?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pCComment.getId().intValue())))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT.toString())))
            .andExpect(jsonPath("$.[*].dateAdded").value(hasItem(DEFAULT_DATE_ADDED.toString())));
    }
    
    @Test
    @Transactional
    public void getPCComment() throws Exception {
        // Initialize the database
        pCCommentRepository.saveAndFlush(pCComment);

        // Get the pCComment
        restPCCommentMockMvc.perform(get("/api/pc-comments/{id}", pCComment.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(pCComment.getId().intValue()))
            .andExpect(jsonPath("$.content").value(DEFAULT_CONTENT.toString()))
            .andExpect(jsonPath("$.dateAdded").value(DEFAULT_DATE_ADDED.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingPCComment() throws Exception {
        // Get the pCComment
        restPCCommentMockMvc.perform(get("/api/pc-comments/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePCComment() throws Exception {
        // Initialize the database
        pCCommentRepository.saveAndFlush(pCComment);

        int databaseSizeBeforeUpdate = pCCommentRepository.findAll().size();

        // Update the pCComment
        PCComment updatedPCComment = pCCommentRepository.findById(pCComment.getId()).get();
        // Disconnect from session so that the updates on updatedPCComment are not directly saved in db
        em.detach(updatedPCComment);
        updatedPCComment
            .content(UPDATED_CONTENT)
            .dateAdded(UPDATED_DATE_ADDED);

        restPCCommentMockMvc.perform(put("/api/pc-comments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPCComment)))
            .andExpect(status().isOk());

        // Validate the PCComment in the database
        List<PCComment> pCCommentList = pCCommentRepository.findAll();
        assertThat(pCCommentList).hasSize(databaseSizeBeforeUpdate);
        PCComment testPCComment = pCCommentList.get(pCCommentList.size() - 1);
        assertThat(testPCComment.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testPCComment.getDateAdded()).isEqualTo(UPDATED_DATE_ADDED);
    }

    @Test
    @Transactional
    public void updateNonExistingPCComment() throws Exception {
        int databaseSizeBeforeUpdate = pCCommentRepository.findAll().size();

        // Create the PCComment

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPCCommentMockMvc.perform(put("/api/pc-comments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pCComment)))
            .andExpect(status().isBadRequest());

        // Validate the PCComment in the database
        List<PCComment> pCCommentList = pCCommentRepository.findAll();
        assertThat(pCCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deletePCComment() throws Exception {
        // Initialize the database
        pCCommentRepository.saveAndFlush(pCComment);

        int databaseSizeBeforeDelete = pCCommentRepository.findAll().size();

        // Delete the pCComment
        restPCCommentMockMvc.perform(delete("/api/pc-comments/{id}", pCComment.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PCComment> pCCommentList = pCCommentRepository.findAll();
        assertThat(pCCommentList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PCComment.class);
        PCComment pCComment1 = new PCComment();
        pCComment1.setId(1L);
        PCComment pCComment2 = new PCComment();
        pCComment2.setId(pCComment1.getId());
        assertThat(pCComment1).isEqualTo(pCComment2);
        pCComment2.setId(2L);
        assertThat(pCComment1).isNotEqualTo(pCComment2);
        pCComment1.setId(null);
        assertThat(pCComment1).isNotEqualTo(pCComment2);
    }
}
